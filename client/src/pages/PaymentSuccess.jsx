import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { requestGetPaymentById } from '../config/PaymentRequest';
import { CheckCircle, Calendar, Users, CreditCard, MapPin, Phone, Mail, Clock } from 'lucide-react';

function PaymentSuccess() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaymentById = async () => {
            try {
                const res = await requestGetPaymentById(id);
                setPaymentData(res.metadata);
            } catch (error) {
                console.error('Error fetching payment:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPaymentById();
    }, [id]);

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getPaymentMethodText = (method) => {
        switch (method) {
            case 'vnpay':
                return 'VNPay';
            case 'cash':
                return 'Thanh toán tại khách sạn';
            default:
                return method;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ xác nhận';
            case 'confirmed':
                return 'Đã xác nhận';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!paymentData) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy thông tin đặt phòng</h2>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Về trang chủ
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Success Header */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-6 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt phòng thành công!</h1>
                    <p className="text-gray-600 mb-4">
                        Cảm ơn bạn đã đặt phòng. Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận.
                    </p>
                    <div
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                            paymentData.status,
                        )}`}
                    >
                        <Clock className="w-4 h-4 mr-2" />
                        {getStatusText(paymentData.status)}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Booking Details */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin đặt phòng</h2>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-5 h-5 text-blue-600 mr-3">🏨</div>
                                <div>
                                    <p className="text-sm text-gray-600">Số phòng đã đặt</p>
                                    <p className="font-semibold">{paymentData.rooms?.length || 0} phòng</p>
                                </div>
                            </div>

                            {paymentData.rooms && paymentData.rooms.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">Chi tiết phòng:</p>
                                    {paymentData.rooms.map((room, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                            <p className="font-semibold text-sm">{room.roomName}</p>
                                            <p className="text-xs text-gray-600">
                                                Phòng {room.roomNumber} • {room.roomType} • Tầng {room.floor}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center">
                                <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                                    <p className="font-semibold">{getPaymentMethodText(paymentData.paymentMethod)}</p>
                                </div>
                            </div>

                            {paymentData.nameCoupon && (
                                <div className="flex items-center">
                                    <div className="w-5 h-5 text-green-600 mr-3">🎫</div>
                                    <div>
                                        <p className="text-sm text-gray-600">Mã giảm giá</p>
                                        <p className="font-semibold text-green-600">{paymentData.nameCoupon}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin khách hàng</h2>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-5 h-5 text-blue-600 mr-3">👤</div>
                                <div>
                                    <p className="text-sm text-gray-600">Họ và tên</p>
                                    <p className="font-semibold">{paymentData.fullName}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Mail className="w-5 h-5 text-blue-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-semibold">{paymentData.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Phone className="w-5 h-5 text-blue-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">Số điện thoại</p>
                                    <p className="font-semibold">{paymentData.phone}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Tổng tiền:</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        {formatPrice(paymentData.totalPrice)}
                                    </span>
                                </div>
                                {paymentData.nameCoupon && (
                                    <div className="mt-2 text-sm text-green-600">
                                        <span>Đã áp dụng mã giảm giá: {paymentData.nameCoupon}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking ID */}
                <div className="bg-blue-50 rounded-xl p-6 mt-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Mã đặt phòng của bạn</p>
                        <p className="text-xl font-mono font-bold text-blue-600 bg-white px-4 py-2 rounded-lg inline-block">
                            {paymentData._id}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Vui lòng lưu mã này để tra cứu thông tin đặt phòng</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Về trang chủ
                    </button>
                    <button
                        onClick={() => navigate('/search-room')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Đặt phòng khác
                    </button>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-100 rounded-xl p-6 mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Cần hỗ trợ?</h3>
                    <div className="text-center text-gray-600">
                        <p>Liên hệ với chúng tôi:</p>
                        <p className="font-semibold mt-2">📞 Hotline: 1900-xxxx | 📧 Email: support@hotel.com</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default PaymentSuccess;
