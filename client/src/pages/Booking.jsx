import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, MapPin, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Context from '../store/Context';

function Booking() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { bookingData } = useContext(Context);
    const [room, setRoom] = useState(null);
    const [guestInfo, setGuestInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        specialRequests: '',
    });

    useEffect(() => {
        let bookingInfo = bookingData;

        if (!bookingInfo) {
            try {
                const storedBooking = localStorage.getItem('bookingData');
                bookingInfo = storedBooking ? JSON.parse(storedBooking) : null;
            } catch (error) {
                console.error('Lỗi khi đọc bookingData từ localStorage:', error);
                bookingInfo = null;
            }
        }

        if (bookingInfo && bookingInfo.roomId === id) {
            setRoom(bookingInfo);
        } else {
            // Nếu không có booking data, quay lại trang tìm kiếm
            navigate('/search-room');
        }
    }, [bookingData, id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGuestInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateNights = () => {
        if (room?.checkInDate && room?.checkOutDate) {
            const checkIn = new Date(room.checkInDate);
            const checkOut = new Date(room.checkOutDate);
            return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        }
        return 0;
    };

    const nights = calculateNights();
    const totalPrice = room ? room.pricePerNight * nights : 0;

    const handleConfirmBooking = async () => {
        // Validate guest info
        if (!guestInfo.fullName || !guestInfo.email || !guestInfo.phone) {
            alert('Vui lòng điền đầy đủ thông tin khách');
            return;
        }

        // Here you would typically send the booking data to your backend
        console.log('Booking Data:', {
            ...room,
            ...guestInfo,
            nights,
            totalPrice,
        });

        // Redirect to payment page
        navigate('/payment');
    };

    if (!room) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-sky-50">
                <Header />
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-600">Đang tải thông tin đặt phòng...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-cyan-100 to-teal-50">
            <Header />

            <div className="w-[90%] mx-auto mt-8 mb-8 px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-primary-600 hover:text-primary-800 mb-6 font-medium transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Quay Lại
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Room Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Room Information Card */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                            {/* Room Image */}
                            <div className="relative h-96 overflow-hidden">
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/uploads/room/${room.images[0]}`}
                                    alt={room.roomName}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Room Info */}
                            <div className="p-8">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{room.roomName}</h2>
                                    <div className="flex items-center text-gray-600">
                                        <Users className="w-5 h-5 mr-2 text-primary-600" />
                                        <span className="text-sm">
                                            Tối đa {room.maxAdults} người lớn • {room.maxChildren} trẻ em
                                        </span>
                                    </div>
                                </div>

                                {/* Amenities */}
                                {room.amenities && room.amenities.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Tiện Nghi</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {room.amenities.map((amenity, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-2 bg-gradient-to-r from-accent-50 to-accent-100 text-accent-700 rounded-lg text-sm font-medium border border-accent-200"
                                                >
                                                    ✓ {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Booking Details */}
                                <div className="border-t pt-6 mt-6 grid grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-primary-50 to-tertiary-50 rounded-2xl p-4">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 text-primary-600 mr-2" />
                                            <span className="text-xs font-semibold text-gray-600">Ngày Nhận Phòng</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800">
                                            {new Date(room.checkInDate).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
                                        <div className="flex items-center mb-2">
                                            <Calendar className="w-4 h-4 text-green-600 mr-2" />
                                            <span className="text-xs font-semibold text-gray-600">Ngày Trả Phòng</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800">
                                            {new Date(room.checkOutDate).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-4">
                                        <div className="flex items-center mb-2">
                                            <Users className="w-4 h-4 text-primary-600 mr-2" />
                                            <span className="text-xs font-semibold text-gray-600">Khách</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800">
                                            {room.adults} người lớn, {room.children} trẻ em
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-4">
                                        <div className="flex items-center mb-2">
                                            <DollarSign className="w-4 h-4 text-orange-600 mr-2" />
                                            <span className="text-xs font-semibold text-gray-600">Số Đêm</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800">{nights} đêm</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guest Information Form */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Thông Tin Khách Hàng</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Họ Tên *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={guestInfo.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Nhập họ tên của bạn"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300 text-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={guestInfo.email}
                                        onChange={handleInputChange}
                                        placeholder="Nhập email của bạn"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300 text-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Số Điện Thoại *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={guestInfo.phone}
                                        onChange={handleInputChange}
                                        placeholder="Nhập số điện thoại"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300 text-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Yêu Cầu Đặc Biệt (Tùy Chọn)
                                    </label>
                                    <textarea
                                        name="specialRequests"
                                        value={guestInfo.specialRequests}
                                        onChange={handleInputChange}
                                        placeholder="Nhập yêu cầu đặc biệt của bạn (ví dụ: tầng cao, gần cửa sổ...)"
                                        rows="4"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300 text-gray-800"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Price Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 sticky top-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Tóm Tắt Giá</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Giá phòng/đêm</span>
                                    <span className="font-semibold text-gray-800">
                                        {room.pricePerNight.toLocaleString()} VND
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Số đêm</span>
                                    <span className="font-semibold text-gray-800">{nights}</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between items-center">
                                    <span className="font-bold text-gray-800">Tổng Cộng</span>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-tertiary-600 bg-clip-text text-transparent">
                                        {totalPrice.toLocaleString()} VND
                                    </span>
                                </div>
                            </div>

                            {/* Booking Conditions */}
                            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-4 mb-6 border border-primary-200">
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2 font-bold">✓</span>
                                        <span>Hủy miễn phí trước 24h nhận phòng</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2 font-bold">✓</span>
                                        <span>Thanh toán khi nhận phòng</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2 font-bold">✓</span>
                                        <span>Không tính phí ẩn</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Confirm Button */}
                            <button
                                onClick={handleConfirmBooking}
                                className="w-full bg-gradient-to-r from-primary-600 to-tertiary-600 hover:from-primary-700 hover:to-tertiary-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                Xác Nhận Đặt Phòng
                            </button>

                            {/* Info Text */}
                            <p className="text-xs text-gray-500 text-center mt-4">
                                Bằng cách nhấp vào "Xác Nhận Đặt Phòng", bạn đồng ý với <br />
                                <a href="#" className="text-primary-600 hover:underline">điều khoản & điều kiện</a> của chúng tôi
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Booking;
