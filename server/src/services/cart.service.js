const modelCart = require('../models/cart.model');
const Room = require('../models/room.model');
const modelCoupon = require('../models/counpon.model');

const { BadRequestError } = require('../core/error.response');

const dayjs = require('dayjs');

class CartService {
    async createCart(userId, roomId, checkInDate, checkOutDate, numberOfAdults, numberOfChildren) {
        const room = await Room.findById(roomId);
        if (!room) {
            throw new BadRequestError('Room not found');
        }

        const checkIn = dayjs(checkInDate);
        const checkOut = dayjs(checkOutDate);
        const nightCount = checkOut.diff(checkIn, 'day');

        let price = room.pricePerNight * nightCount;
        if (room.discount) {
            price -= (room.pricePerNight * nightCount * room.discount) / 100;
        }

        let cart = await modelCart.findOne({ userId });

        if (cart) {
            // Kiểm tra xem phòng này đã có khoảng ngày trùng chưa
            const overlappingRoom = cart.rooms.find(
                (r) =>
                    r.roomId.toString() === roomId &&
                    dayjs(r.checkInDate).isBefore(checkOut) &&
                    dayjs(checkIn).isBefore(r.checkOutDate),
            );

            if (overlappingRoom) {
                // Nếu trùng ngày => có thể báo lỗi hoặc update lại khoảng ngày dài hơn
                throw new BadRequestError('Phòng này đã được đặt cho những ngày đã chọn trong giỏ hàng của bạn');
                // Hoặc bạn có thể merge:
                // overlappingRoom.checkInDate = dayjs.min(dayjs(overlappingRoom.checkInDate), checkIn);
                // overlappingRoom.checkOutDate = dayjs.max(dayjs(overlappingRoom.checkOutDate), checkOut);
                // overlappingRoom.numberOfAdults = numberOfAdults;
                // overlappingRoom.numberOfChildren = numberOfChildren;
                // overlappingRoom.price = newPrice;
            } else {
                // Nếu không trùng thì thêm phòng mới
                cart.rooms.push({
                    roomId,
                    checkInDate,
                    checkOutDate,
                    numberOfAdults,
                    numberOfChildren,
                    price,
                });
            }

            // Cập nhật lại tổng tiền
            cart.totalPrice = cart.rooms.reduce((sum, r) => sum + r.price, 0);

            await cart.save();
        } else {
            // Nếu chưa có giỏ hàng thì tạo mới
            cart = await modelCart.create({
                userId,
                rooms: [
                    {
                        roomId,
                        checkInDate,
                        checkOutDate,
                        numberOfAdults,
                        numberOfChildren,
                        price,
                    },
                ],
                totalPrice: price,
            });
        }

        return cart;
    }

    async getCart(userId) {
        const cart = await modelCart.findOne({ userId }).lean();
        if (!cart) {
            return { cart: null, coupon: [] };
        }

        const today = new Date();

        const coupon = await modelCoupon
            .find({
                startDate: { $lte: today },
                endDate: { $gte: today },
                minPrice: { $lte: cart.totalPrice },
                quantity: { $gt: 0 },
            })
            .lean();

        // Merge room data vào từng item trong cart.rooms
        const rooms = await Promise.all(
            cart.rooms.map(async (item) => {
                const dataRoom = await Room.findById(item.roomId).lean();
                return {
                    ...item,
                    room: dataRoom || null,
                };
            }),
        );

        return {
            cart: {
                ...cart,
                rooms, // gán lại rooms có kèm dữ liệu phòng
            },
            coupon,
        };
    }

    async updateCart(userId, dataUpdate) {
        // Lấy cart của user
        const cart = await modelCart.findOne({ userId });
        if (!cart) {
            throw new BadRequestError('Cart not found');
        }
        cart.set(dataUpdate);
        await cart.save();
        return cart;
    }

    async deleteCartRoom(userId, roomBookingId) {
        const cart = await modelCart.findOne({ userId });
        if (!cart) {
            throw new BadRequestError('Cart not found');
        }

        const room = cart.rooms.id(roomBookingId); // roomBookingId phải là _id trong rooms
        if (!room) {
            throw new BadRequestError('Room not found in cart');
        }

        room.deleteOne(); // mongoose v7+ (thay vì remove())
        cart.totalPrice = cart.rooms.reduce((sum, r) => sum + r.price, 0);
        await cart.save();

        return cart;
    }
}

module.exports = new CartService();
