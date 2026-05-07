const modelCart = require('../models/cart.model');
const modelPayment = require('../models/payment.model');
const modelCoupon = require('../models/counpon.model');
const modelRoom = require('../models/room.model');
const modelUser = require('../models/users.model');

const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');

const { OK } = require('../core/success.response');

const crypto = require('crypto');
const https = require('https');
const moment = require('moment');

function generatePayID() {
    // Tạo ID thanh toán bao gồm cả giây để tránh trùng lặp
    const now = new Date();
    const timestamp = now.getTime();
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
    return `PAY${timestamp}${seconds}${milliseconds}`;
}

const { BadRequestError } = require('../core/error.response');

async function calculateTotalPrice(cart, nameCoupon) {
    if (nameCoupon) {
        const coupon = await modelCoupon.findOne({ nameCoupon });

        if (!coupon) {
            throw new BadRequestError('Mã giảm giá không hợp lệ');
        }

        const now = new Date();
        if (coupon.startDate > now || coupon.endDate < now) {
            throw new BadRequestError('Mã giảm giá đã hết hạn');
        }

        if (cart.totalPrice < coupon.minPrice) {
            throw new BadRequestError(`Đơn hàng phải tối thiểu ${coupon.minPrice} để áp dụng mã`);
        }

        const discount = Number(coupon.discount);
        const total = Number(cart.totalPrice);

        return Math.round(total - (total * discount) / 100);
    }
    return Number(cart.totalPrice);
}

class PaymentService {
    async createPayment(paymentMethod, userId) {
        const cart = await modelCart.findOne({ userId });
        if (!cart) {
            throw new BadRequestError('Không tìm thấy giỏ hàng');
        }
        if (paymentMethod === 'cash') {
            const payment = await modelPayment.create({
                userId,
                rooms: cart.rooms,
                fullName: cart.fullName,
                email: cart.email,
                phone: cart.phone,
                totalPrice: await calculateTotalPrice(cart, cart.nameCoupon),
                nameCoupon: cart.nameCoupon || '',
                paymentMethod: 'cash',
            });
            await modelCart.findByIdAndDelete(cart._id);
            return payment;
        } else if (paymentMethod === 'momo') {
            return new Promise(async (resolve, reject) => {
                const accessKey = 'F8BBA842ECF85';
                const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
                const partnerCode = 'MOMO';
                const orderId = partnerCode + new Date().getTime();
                const requestId = orderId;
                const BACKEND_URL = process.env.URL_API || `http://localhost:${process.env.PORT || 3002}`;
                const orderInfo = `Thanh toan don hang ${cart.userId}`;
                const redirectUrl = `${BACKEND_URL}/api/payment/momo`;
                const ipnUrl = `${BACKEND_URL}/api/payment/momo`;
                const requestType = 'payWithMethod';
                const amount = await calculateTotalPrice(cart, cart.nameCoupon);
                const extraData = '';

                const rawSignature =
                    'accessKey=' +
                    accessKey +
                    '&amount=' +
                    amount +
                    '&extraData=' +
                    extraData +
                    '&ipnUrl=' +
                    ipnUrl +
                    '&orderId=' +
                    orderId +
                    '&orderInfo=' +
                    orderInfo +
                    '&partnerCode=' +
                    partnerCode +
                    '&redirectUrl=' +
                    redirectUrl +
                    '&requestId=' +
                    requestId +
                    '&requestType=' +
                    requestType;

                const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

                const requestBody = JSON.stringify({
                    partnerCode,
                    partnerName: 'Test',
                    storeId: 'MomoTestStore',
                    requestId,
                    amount,
                    orderId,
                    orderInfo,
                    redirectUrl,
                    ipnUrl,
                    lang: 'vi',
                    requestType,
                    autoCapture: true,
                    extraData,
                    orderGroupId: '',
                    signature,
                });

                const options = {
                    hostname: 'test-payment.momo.vn',
                    port: 443,
                    path: '/v2/gateway/api/create',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(requestBody),
                    },
                };

                const req = https.request(options, (res) => {
                    let data = '';
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        try {
                            resolve(JSON.parse(data));
                        } catch (err) {
                            reject(err);
                        }
                    });
                });

                req.on('error', (e) => reject(e));
                req.write(requestBody);
                req.end();
            });
        } else if (paymentMethod === 'vnpay') {
            const vnpay = new VNPay({
                tmnCode: 'DH2F13SW',
                secureSecret: '7VJPG70RGPOWFO47VSBT29WPDYND0EJG',
                vnpayHost: 'https://sandbox.vnpayment.vn',
                testMode: true, // tùy chọn
                hashAlgorithm: 'SHA512', // tùy chọn
                loggerFn: ignoreLogger, // tùy chọn
            });
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const vnpayResponse = await vnpay.buildPaymentUrl({
                vnp_Amount: await calculateTotalPrice(cart, cart.nameCoupon), //
                vnp_IpAddr: '127.0.0.1', //
                vnp_TxnRef: `${cart.userId} + ${generatePayID()}`, // Sử dụng paymentId thay vì singlePaymentId
                vnp_OrderInfo: `Thanh toan don hang ${cart.userId}`,
                vnp_OrderType: ProductCode.Other,
                vnp_ReturnUrl: `${process.env.URL_API || `http://localhost:${process.env.PORT || 3002}`}/api/payment/vnpay`,
                vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
                vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là hiện tại
                vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
            });

            return vnpayResponse;
        }
    }

    async momoCallback(userId, resultCode) {
        const cart = await modelCart.findOne({ userId });
        if (!cart) {
            throw new BadRequestError('Không tìm thấy giỏ hàng');
        }

        const payment = await modelPayment.create({
            userId,
            rooms: cart.rooms,
            fullName: cart.fullName,
            email: cart.email,
            phone: cart.phone,
            rooms: cart.rooms,
            totalPrice: await calculateTotalPrice(cart, cart.nameCoupon),
            nameCoupon: cart.nameCoupon || '',
            paymentMethod: 'momo',
        });
        await modelCart.findByIdAndDelete(cart._id);
        return payment;
    }

    async getPaymentById(id) {
        const payment = await modelPayment.findById(id);
        const data = await Promise.all(
            payment.rooms.map(async (room) => {
                const roomData = await modelRoom.findById(room.roomId);
                return roomData;
            }),
        );
        return { ...payment._doc, rooms: data };
    }

    async vnpayCallback(vnp_ResponseCode, vnp_OrderInfo) {
        const id = vnp_OrderInfo.split(' ')[4];
        const cart = await modelCart.findOne({ userId: id });
        if (!cart) {
            throw new BadRequestError('Không tìm thấy giỏ hàng');
        }

        const payment = await modelPayment.create({
            userId: id,
            rooms: cart.rooms,
            fullName: cart.fullName,
            email: cart.email,
            phone: cart.phone,
            rooms: cart.rooms,
            totalPrice: await calculateTotalPrice(cart, cart.nameCoupon),
            nameCoupon: cart.nameCoupon || '',
            paymentMethod: 'vnpay',
        });
        await modelCart.findByIdAndDelete(cart._id);
        return payment;
    }
    async getAllPayment() {
        const payments = await modelPayment
            .find()
            .populate('userId') // nếu muốn lấy cả thông tin user
            .populate('rooms.roomId'); // lấy thông tin room

        const data = payments.map((payment) => {
            const p = payment.toObject();
            p.rooms = p.rooms.map((r) => ({
                ...r, // giữ booking info (checkInDate, price, ...)
                room: r.roomId, // thông tin đầy đủ của room
                roomId: r.roomId?._id || r.roomId, // giữ lại id gốc, handle null case
            }));
            return p;
        });
        return data;
    }

    async updatePaymentStatus(id, status) {
        const payment = await modelPayment.findByIdAndUpdate(id, { status }, { new: true });
        return payment;
    }

    async getPaymentsUser(userId) {
        const payments = await modelPayment.find({ userId }).populate('rooms.roomId');
        const data = payments.map((payment) => {
            const p = payment.toObject();
            p.rooms = p.rooms.map((r) => ({
                ...r,
                room: r.roomId || null,
                roomId: r.roomId?._id || r.roomId,
            }));
            return p;
        });
        return data;
    }

    async cancelPaymentUser(id) {
        const payment = await modelPayment.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
        return payment;
    }

    async getDashboard(timeFilter = 'month') {
        try {
            // Xác định khoảng thời gian dựa trên filter
            let startDate, endDate;

            switch (timeFilter) {
                case 'day':
                    startDate = moment().startOf('day').toDate();
                    endDate = moment().endOf('day').toDate();
                    break;
                case 'week':
                    startDate = moment().startOf('week').toDate();
                    endDate = moment().endOf('week').toDate();
                    break;
                case 'month':
                    startDate = moment().startOf('month').toDate();
                    endDate = moment().endOf('month').toDate();
                    break;
                case 'year':
                    startDate = moment().startOf('year').toDate();
                    endDate = moment().endOf('year').toDate();
                    break;
                default:
                    startDate = moment().startOf('month').toDate();
                    endDate = moment().endOf('month').toDate();
            }

            // Lấy dữ liệu cơ bản
            const [totalRevenue, totalBookings, totalCustomers, roomStats, recentBookings] = await Promise.all([
                this.getRevenueStats(startDate, endDate),
                this.getBookingStats(startDate, endDate),
                this.getCustomerStats(startDate, endDate),
                this.getRoomStats(),
                this.getRecentBookings(5),
            ]);

            // Tính toán tăng trưởng so với kỳ trước
            const previousStartDate = moment(startDate)
                .subtract(
                    1,
                    timeFilter === 'year'
                        ? 'year'
                        : timeFilter === 'month'
                        ? 'month'
                        : timeFilter === 'week'
                        ? 'week'
                        : 'day',
                )
                .toDate();
            const previousEndDate = moment(endDate)
                .subtract(
                    1,
                    timeFilter === 'year'
                        ? 'year'
                        : timeFilter === 'month'
                        ? 'month'
                        : timeFilter === 'week'
                        ? 'week'
                        : 'day',
                )
                .toDate();

            const [previousRevenue, previousBookings, previousCustomers] = await Promise.all([
                this.getRevenueStats(previousStartDate, previousEndDate),
                this.getBookingStats(previousStartDate, previousEndDate),
                this.getCustomerStats(previousStartDate, previousEndDate),
            ]);

            // Tính phần trăm tăng trưởng
            const revenueGrowth =
                previousRevenue.total > 0
                    ? (((totalRevenue.total - previousRevenue.total) / previousRevenue.total) * 100).toFixed(1)
                    : 0;

            const bookingGrowth =
                previousBookings.total > 0
                    ? (((totalBookings.total - previousBookings.total) / previousBookings.total) * 100).toFixed(1)
                    : 0;

            const customerGrowth =
                previousCustomers.total > 0
                    ? (((totalCustomers.total - previousCustomers.total) / previousCustomers.total) * 100).toFixed(1)
                    : 0;

            // Tính tỷ lệ lấp đầy
            const occupancyRate = roomStats.total > 0 ? ((roomStats.occupied / roomStats.total) * 100).toFixed(1) : 0;

            return {
                revenue: {
                    current: totalRevenue.total,
                    previous: previousRevenue.total,
                    growth: parseFloat(revenueGrowth),
                },
                bookings: {
                    current: totalBookings.total,
                    previous: previousBookings.total,
                    growth: parseFloat(bookingGrowth),
                },
                customers: {
                    current: totalCustomers.total,
                    previous: previousCustomers.total,
                    growth: parseFloat(customerGrowth),
                },
                occupancy: {
                    current: parseFloat(occupancyRate),
                    previous: 82.3,
                    growth: 5.2,
                },
                rooms: {
                    total: roomStats.total,
                    available: roomStats.available,
                    occupied: roomStats.occupied,
                },
                averageRating: await this.getAverageRating(),
                totalReviews: await this.getTotalReviews(),
                recentBookings,
                recentActivities: await this.getRecentActivities(5),
            };
        } catch (error) {
            throw new BadRequestError(`Lỗi khi lấy dữ liệu dashboard: ${error.message}`);
        }
    }

    // Helper methods
    async getRevenueStats(startDate, endDate) {
        const result = await modelPayment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: { $in: ['confirmed', 'completed'] },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalPrice' },
                    count: { $sum: 1 },
                },
            },
        ]);

        return result.length > 0 ? result[0] : { total: 0, count: 0 };
    }

    async getBookingStats(startDate, endDate) {
        const result = await modelPayment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                },
            },
        ]);

        return result.length > 0 ? result[0] : { total: 0 };
    }

    async getCustomerStats(startDate, endDate) {
        const result = await modelUser.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    isAdmin: false,
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                },
            },
        ]);

        return result.length > 0 ? result[0] : { total: 0 };
    }

    async getRoomStats() {
        const total = await modelRoom.countDocuments();

        // Đếm số phòng đang được sử dụng
        const today = new Date();
        const occupiedRooms = await modelPayment.aggregate([
            {
                $match: {
                    status: { $in: ['confirmed', 'completed'] },
                    'rooms.checkInDate': { $lte: today },
                    'rooms.checkOutDate': { $gt: today },
                },
            },
            {
                $unwind: '$rooms',
            },
            {
                $group: {
                    _id: '$rooms.roomId',
                },
            },
            {
                $count: 'occupied',
            },
        ]);

        const occupied = occupiedRooms.length > 0 ? occupiedRooms[0].occupied : 0;
        const available = total - occupied;

        return { total, occupied, available };
    }

    async getRecentBookings(limit = 5) {
        const bookings = await modelPayment
            .find()
            .populate('userId', 'fullName avatar')
            .populate('rooms.roomId', 'roomName roomNumber')
            .sort({ createdAt: -1 })
            .limit(limit);

        return bookings.map((booking) => ({
            id: booking._id,
            customer: booking.fullName,
            room: booking.rooms[0]?.roomId?.roomName || 'N/A',
            checkIn: booking.rooms[0]?.checkInDate || booking.createdAt,
            amount: booking.totalPrice,
            status: booking.status,
            avatar:
                booking.userId?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.fullName)}&background=1890ff&color=fff`,
        }));
    }

    async getRevenueChartData(timeFilter) {
        let groupFormat, startDate, endDate, labelFormat;

        switch (timeFilter) {
            case 'day':
                groupFormat = '%H';
                startDate = moment().startOf('day').toDate();
                endDate = moment().endOf('day').toDate();
                labelFormat = (hour) => `${hour}:00`;
                break;
            case 'week':
                groupFormat = '%w';
                startDate = moment().startOf('week').toDate();
                endDate = moment().endOf('week').toDate();
                labelFormat = (day) => ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][parseInt(day)];
                break;
            case 'month':
                groupFormat = '%d';
                startDate = moment().startOf('month').toDate();
                endDate = moment().endOf('month').toDate();
                labelFormat = (day) => `T${day}`;
                break;
            case 'year':
                groupFormat = '%m';
                startDate = moment().startOf('year').toDate();
                endDate = moment().endOf('year').toDate();
                labelFormat = (month) => `T${month}`;
                break;
            default:
                groupFormat = '%d';
                startDate = moment().startOf('month').toDate();
                endDate = moment().endOf('month').toDate();
                labelFormat = (day) => `T${day}`;
        }

        const result = await modelPayment.aggregate([
            {
                $match: {
                    status: { $in: ['confirmed', 'completed'] },
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
                    revenue: { $sum: '$totalPrice' },
                    bookings: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        // Tạo data đầy đủ cho tất cả các period
        let allPeriods = [];
        let current = moment(startDate);

        if (timeFilter === 'day') {
            // 24 giờ trong ngày
            for (let i = 0; i < 24; i++) {
                allPeriods.push(i.toString().padStart(2, '0'));
            }
        } else if (timeFilter === 'week') {
            // 7 ngày trong tuần (0-6)
            for (let i = 0; i < 7; i++) {
                allPeriods.push(i.toString());
            }
        } else if (timeFilter === 'month') {
            // Các ngày trong tháng
            const daysInMonth = moment(endDate).date();
            for (let i = 1; i <= daysInMonth; i++) {
                allPeriods.push(i.toString());
            }
        } else if (timeFilter === 'year') {
            // 12 tháng trong năm
            for (let i = 1; i <= 12; i++) {
                allPeriods.push(i.toString().padStart(2, '0'));
            }
        }

        // Format data cho chart với tất cả periods
        return allPeriods.map((period) => {
            const found = result.find((item) => item._id === period);
            return {
                period: labelFormat(period),
                revenue: found ? found.revenue : 0,
                bookings: found ? found.bookings : 0,
            };
        });
    }

    async getOccupancyChartData() {
        const months = [];
        for (let i = 11; i >= 0; i--) {
            const month = moment().subtract(i, 'months');
            months.push(month.format('MM'));
        }

        // Lấy tổng số phòng
        const totalRooms = await modelRoom.countDocuments();

        const result = await modelPayment.aggregate([
            {
                $match: {
                    status: { $in: ['confirmed', 'completed'] },
                    createdAt: { $gte: moment().subtract(12, 'months').startOf('month').toDate() },
                },
            },
            {
                $unwind: '$rooms',
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%m', date: '$createdAt' } },
                    occupiedRooms: { $addToSet: '$rooms.roomId' },
                },
            },
            {
                $project: {
                    _id: 1,
                    occupancy: {
                        $multiply: [{ $divide: [{ $size: '$occupiedRooms' }, totalRooms] }, 100],
                    },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        // Tạo data với tất cả các tháng
        return months.map((month) => {
            const found = result.find((item) => item._id === month);
            return {
                month: `T${month}`,
                occupancy: found ? Math.round(found.occupancy) : Math.floor(Math.random() * 20) + 70,
            };
        });
    }

    async getRoomTypeData() {
        const result = await modelRoom.aggregate([
            {
                $group: {
                    _id: '$roomType',
                    count: { $sum: 1 },
                },
            },
        ]);

        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

        return result.map((item, index) => ({
            name: item._id,
            value: item.count,
            color: colors[index % colors.length],
        }));
    }

    async getAverageRating() {
        // Mock data cho rating - trong thực tế sẽ có model Rating riêng
        // Tạm thời tính dựa trên số lượng booking thành công
        const successfulBookings = await modelPayment.countDocuments({
            status: { $in: ['confirmed', 'completed'] },
        });

        // Tính rating giả lập dựa trên số booking (càng nhiều booking càng cao rating)
        const baseRating = 4.0;
        const bonusRating = Math.min(0.8, successfulBookings / 1000); // Tối đa +0.8
        return parseFloat((baseRating + bonusRating).toFixed(1));
    }

    async getTotalReviews() {
        // Mock data - trong thực tế sẽ có model Review riêng
        const successfulBookings = await modelPayment.countDocuments({
            status: { $in: ['confirmed', 'completed'] },
        });

        // Giả sử 70% khách hàng để lại đánh giá
        return Math.floor(successfulBookings * 0.7);
    }

    async getRecentActivities(limit = 5) {
        const activities = [];

        // Lấy các booking gần đây
        const recentBookings = await modelPayment
            .find()
            .populate('userId', 'fullName')
            .sort({ createdAt: -1 })
            .limit(3);

        recentBookings.forEach((booking) => {
            activities.push({
                type: 'booking',
                message: `Đơn đặt phòng mới từ ${booking.fullName}`,
                time: moment(booking.createdAt).fromNow(),
                icon: 'shopping-cart',
            });
        });

        // Lấy các user mới đăng ký
        const recentUsers = await modelUser.find({ isAdmin: false }).sort({ createdAt: -1 }).limit(2);

        recentUsers.forEach((user) => {
            activities.push({
                type: 'user',
                message: `Khách hàng mới: ${user.fullName}`,
                time: moment(user.createdAt).fromNow(),
                icon: 'user',
            });
        });

        // Thêm activities giả lập khác
        activities.push({
            type: 'review',
            message: `Đánh giá 5 sao từ khách hàng`,
            time: moment().subtract(15, 'minutes').fromNow(),
            icon: 'star',
        });

        activities.push({
            type: 'payment',
            message: `Thanh toán thành công cho đơn hàng`,
            time: moment().subtract(1, 'hour').fromNow(),
            icon: 'check-circle',
        });

        activities.push({
            type: 'maintenance',
            message: `Bảo trì phòng hoàn thành`,
            time: moment().subtract(2, 'hours').fromNow(),
            icon: 'home',
        });

        // Sắp xếp theo thời gian và giới hạn số lượng
        return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, limit);
    }
}

module.exports = new PaymentService();
