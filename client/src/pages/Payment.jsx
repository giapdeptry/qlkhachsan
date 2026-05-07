import { useEffect, useState } from 'react';
import { Card, Form, Input, DatePicker, InputNumber, Button, Radio, message, Spin, Divider, Tag } from 'antd';
import {
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    CreditCardOutlined,
    GiftOutlined,
} from '@ant-design/icons';
import Header from '../components/Header';
import dayjs from 'dayjs';
import { requestGetCart, requestUpdateCart } from '../config/CartRequest';
import { requestCreatePayment } from '../config/PaymentRequest';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

function Payment() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);
    const [nights, setNights] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [coupon, setCoupon] = useState(null);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const res = await requestGetCart();
            setCart(res.metadata.cart);
            setCoupon(res.metadata.coupon);
        } catch (error) {
            message.error('Không lấy được giỏ hàng');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Tính toán tổng tiền từ cart
    useEffect(() => {
        if (cart && cart.totalPrice) {
            const finalAmount = cart.totalPrice - discount;
            setTotalAmount(finalAmount);

            // Tính tổng số đêm từ tất cả rooms trong cart
            const totalNights =
                cart.rooms?.reduce((total, roomBooking) => {
                    const checkIn = dayjs(roomBooking.checkInDate);
                    const checkOut = dayjs(roomBooking.checkOutDate);
                    return total + checkOut.diff(checkIn, 'day');
                }, 0) || 0;
            setNights(totalNights);
        }
    }, [cart, discount]);

    const handleApplyDiscount = (code) => {
        const foundCoupon = coupon?.find((item) => item.nameCoupon === code);
        if (foundCoupon) {
            setSelectedCoupon(foundCoupon);

            if (cart && cart.totalPrice) {
                // giảm theo %
                const discountValue = (cart.totalPrice * foundCoupon.discount) / 100;
                setDiscount(discountValue);
                setTotalAmount(cart.totalPrice - discountValue);
            }

            message.success(`Áp dụng mã ${foundCoupon.nameCoupon} - Giảm ${foundCoupon.discount}%`);
        } else {
            setSelectedCoupon(null);
            setDiscount(0);

            if (cart && cart.totalPrice) {
                setTotalAmount(cart.totalPrice);
            }

            message.error('Mã giảm giá không hợp lệ');
        }
    };

    const formatPrice = (price, discount = 0) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price - (price * discount) / 100);

    const handlePayment = async (values) => {
        try {
            if (!values.fullName || !values.email || !values.phone || !values.paymentMethod) {
                message.error('Vui lòng điền đầy đủ thông tin');
                return;
            }

            setLoading(true);

            const paymentData = {
                paymentMethod: values.paymentMethod,
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                nameCoupon: selectedCoupon?.nameCoupon || null,
            };

            await requestUpdateCart(paymentData);

            if (values.paymentMethod === 'cash') {
                const res = await requestCreatePayment(paymentData);
                navigate(`/payment-success/${res.metadata._id}`);
            } else if (values.paymentMethod === 'momo') {
                const res = await requestCreatePayment(paymentData);
                window.open(res.metadata.payUrl, '_blank');
            } else if (values.paymentMethod === 'vnpay') {
                const res = await requestCreatePayment(paymentData);
                window.open(res.metadata, '_blank');
            }
            message.success('Đang xử lý thanh toán...');
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
                <div className="text-center">
                    <Spin size="large" />
                    <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (!cart || !cart.rooms || cart.rooms.length === 0) {
        return (
            <div>
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
                    <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                        <p className="text-gray-600 text-lg">Không có phòng nào trong giỏ hàng</p>
                        <Link to="/">
                            <Button type="primary" className="mt-4">
                                Quay lại trang chủ
                            </Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header />
            <div className="w-[90%] mx-auto px-4 py-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Thông tin thanh toán</h1>
                    <p className="text-sm text-gray-600">Vui lòng kiểm tra thông tin và hoàn tất thanh toán</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Card className="shadow-xl rounded-3xl border-0 sticky top-4">
                            <div className="p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-between">
                                    Danh sách phòng đã chọn
                                    <Tag color="blue" className="text-sm font-medium">
                                        {cart.rooms?.length || 0} phòng
                                    </Tag>
                                </h2>

                                {/* Scrollable room list */}
                                <div className="max-h-96 overflow-y-auto space-y-3 mb-4">
                                    {cart.rooms.map((roomBooking, index) => {
                                        const roomDetail = roomBooking.room;
                                        const nights = dayjs(roomBooking.checkOutDate).diff(
                                            dayjs(roomBooking.checkInDate),
                                            'day',
                                        );

                                        return (
                                            <div
                                                key={index}
                                                className="border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-start space-x-3">
                                                    {roomDetail && (
                                                        <img
                                                            alt={roomDetail.roomName}
                                                            src={`${import.meta.env.VITE_API_URL}/uploads/room/${
                                                                roomDetail.images[0]
                                                            }`}
                                                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                        />
                                                    )}

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h3 className="font-semibold text-sm text-gray-900 truncate">
                                                                    {roomDetail?.roomName || `Phòng ${index + 1}`}
                                                                </h3>
                                                                <p className="text-xs text-gray-600">
                                                                    Phòng {roomDetail?.roomNumber} • Tầng{' '}
                                                                    {roomDetail?.floor}
                                                                </p>
                                                            </div>
                                                            <Tag color="gold" className="text-xs ml-2">
                                                                {roomDetail?.roomType}
                                                            </Tag>
                                                        </div>

                                                        <div className="mt-2 space-y-1">
                                                            <div className="flex justify-between text-xs">
                                                                <span className="text-gray-600">
                                                                    {dayjs(roomBooking.checkInDate).format('DD/MM')} -{' '}
                                                                    {dayjs(roomBooking.checkOutDate).format('DD/MM')}
                                                                </span>
                                                                <span className="font-medium">{nights} đêm</span>
                                                            </div>
                                                            <div className="flex justify-between text-xs">
                                                                <span className="text-gray-600">
                                                                    {roomBooking.numberOfAdults}NL +{' '}
                                                                    {roomBooking.numberOfChildren}TE
                                                                </span>
                                                                <span className="font-bold text-red-600">
                                                                    {formatPrice(roomBooking.price)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {roomDetail && roomDetail.amenities && (
                                                            <div className="mt-2">
                                                                <div className="flex flex-wrap gap-1">
                                                                    {roomDetail.amenities
                                                                        .slice(0, 3)
                                                                        .map((amenity, idx) => (
                                                                            <span
                                                                                key={idx}
                                                                                className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
                                                                            >
                                                                                {amenity}
                                                                            </span>
                                                                        ))}
                                                                    {roomDetail.amenities.length > 3 && (
                                                                        <span className="text-xs text-gray-500">
                                                                            +{roomDetail.amenities.length - 3} khác
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Summary */}
                                <div className="border-t pt-4">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Tổng số đêm:</span>
                                            <span className="font-semibold text-blue-600">{nights} đêm</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-base font-bold text-gray-800">Tổng cộng:</span>
                                            <span className="text-lg font-bold text-blue-600">
                                                {formatPrice(cart.totalPrice)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            <div className="xl:col-span-2">
                                <Card className="shadow-xl rounded-3xl border-0">
                                    <div className="p-6">
                                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <UserOutlined className="text-blue-600" />
                                            Thông tin khách hàng
                                        </h2>

                                        <Form
                                            layout="vertical"
                                            form={form}
                                            onFinish={handlePayment}
                                            initialValues={{
                                                fullName: '',
                                                email: '',
                                                phone: '',
                                                paymentMethod: 'cash',
                                            }}
                                        >
                                            <Form.Item
                                                label={
                                                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                                                        <UserOutlined /> Họ và tên
                                                    </span>
                                                }
                                                name="fullName"
                                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                            >
                                                <Input
                                                    placeholder="Nguyễn Văn A"
                                                    className="rounded-xl py-2 px-3 border-2 focus:border-blue-400"
                                                />
                                            </Form.Item>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Form.Item
                                                    label={
                                                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                                                            <MailOutlined /> Email
                                                        </span>
                                                    }
                                                    name="email"
                                                    rules={[
                                                        { required: true, message: 'Vui lòng nhập email' },
                                                        { type: 'email', message: 'Email không hợp lệ' },
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="example@gmail.com"
                                                        className="rounded-xl py-2 px-3 border-2 focus:border-blue-400"
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label={
                                                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                                                            <PhoneOutlined /> Số điện thoại
                                                        </span>
                                                    }
                                                    name="phone"
                                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                                >
                                                    <Input
                                                        placeholder="0987654321"
                                                        className="rounded-xl py-2 px-3 border-2 focus:border-blue-400"
                                                    />
                                                </Form.Item>
                                            </div>

                                            <h4 className="text-base mb-2 text-red-500 font-bold">Mã giảm giá</h4>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {coupon?.map((item) => (
                                                    <span
                                                        key={item._id}
                                                        onClick={() => handleApplyDiscount(item.nameCoupon)}
                                                        className={`px-3 py-1 text-sm font-medium rounded-full border cursor-pointer transition 
                                                    ${
                                                        selectedCoupon?._id === item._id
                                                            ? 'bg-green-600 text-white border-green-600 shadow-md'
                                                            : 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                                                    }`}
                                                    >
                                                        {item.nameCoupon} - Giảm {item.discount}%
                                                    </span>
                                                ))}
                                            </div>

                                            <Form.Item
                                                label={
                                                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                                                        <CreditCardOutlined /> Phương thức thanh toán
                                                    </span>
                                                }
                                                name="paymentMethod"
                                                rules={[{ required: true, message: 'Chọn phương thức thanh toán' }]}
                                            >
                                                <Radio.Group className="w-full">
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <Radio value="cash" className="w-full">
                                                            <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
                                                                <img
                                                                    className="w-10 h-10 object-contain rounded-lg"
                                                                    src="https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png"
                                                                    alt=""
                                                                />
                                                                <div>
                                                                    <span className="font-medium text-gray-800">
                                                                        Thanh toán khi đến nơi
                                                                    </span>
                                                                    <p className="text-xs text-gray-600">
                                                                        Thanh toán bằng tiền mặt tại khách sạn
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Radio>

                                                        <Radio value="momo" className="w-full">
                                                            <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
                                                                <img
                                                                    className="w-10 h-10 object-contain rounded-lg"
                                                                    src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                                                                    alt="Momo"
                                                                />
                                                                <div>
                                                                    <span className="font-medium text-gray-800">
                                                                        Thanh toán qua MoMo
                                                                    </span>
                                                                    <p className="text-xs text-gray-600">
                                                                        Thanh toán nhanh chóng qua ví MoMo
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Radio>

                                                        <Radio value="vnpay" className="w-full">
                                                            <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
                                                                <img
                                                                    className="w-10 h-10 object-contain rounded-lg bg-blue-600 p-1"
                                                                    src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"
                                                                    alt="VNPay"
                                                                />
                                                                <div>
                                                                    <span className="font-medium text-gray-800">
                                                                        Thanh toán qua VNPay
                                                                    </span>
                                                                    <p className="text-xs text-gray-600">
                                                                        Thanh toán an toàn qua VNPay
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Radio>
                                                    </div>
                                                </Radio.Group>
                                            </Form.Item>

                                            <Form.Item className="mb-0">
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    block
                                                    size="large"
                                                    loading={loading}
                                                    className="rounded-xl py-3 h-auto bg-gradient-to-r from-blue-600 to-indigo-600 border-0 hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                                >
                                                    Xác nhận thanh toán{' '}
                                                    {totalAmount > 0 && `• ${formatPrice(totalAmount)}`}
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </div>
                                </Card>
                            </div>

                            <div className="xl:col-span-1">
                                <Card className="shadow-xl rounded-3xl border-0 sticky top-4">
                                    <div className="p-6">
                                        <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <CreditCardOutlined className="text-green-600" />
                                            Chi tiết thanh toán
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-gray-600">Số phòng đã chọn:</span>
                                                    <span className="font-semibold text-blue-600">
                                                        {cart.rooms?.length || 0} phòng
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Tổng số đêm:</span>
                                                    <span className="font-semibold text-blue-600">{nights} đêm</span>
                                                </div>
                                            </div>

                                            <Divider className="my-4" />

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Tạm tính:</span>
                                                    <span className="font-semibold">
                                                        {formatPrice(cart.totalPrice)}
                                                    </span>
                                                </div>

                                                {discount > 0 && (
                                                    <div className="flex justify-between items-center text-green-600">
                                                        <span>Giảm giá:</span>
                                                        <span className="font-semibold">-{formatPrice(discount)}</span>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center text-sm text-gray-500">
                                                    <span>Thuế & phí:</span>
                                                    <span>Đã bao gồm</span>
                                                </div>
                                            </div>

                                            <Divider className="my-4" />

                                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-base font-bold text-gray-800">
                                                        Tổng cộng:
                                                    </span>
                                                    <span className="text-lg font-bold text-green-600">
                                                        {formatPrice(totalAmount)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    Cho {cart.rooms?.length || 0} phòng, {nights} đêm nghỉ
                                                </p>
                                            </div>

                                            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                                                <h4 className="font-medium text-amber-800 mb-2 text-sm">Lưu ý:</h4>
                                                <ul className="text-xs text-amber-700 space-y-1">
                                                    <li>• Giá phòng có thể thay đổi theo mùa</li>
                                                    <li>• Hủy phòng miễn phí trước 24h</li>
                                                    <li>• Check-in: 14:00, Check-out: 12:00</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
