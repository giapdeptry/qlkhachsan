import { useState, useEffect } from 'react';
import { Wifi, Tv, Wind, Users, Calendar, Check, MapPin, Building2, DoorOpen, Info, Star, User } from 'lucide-react';
import { DatePicker } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Header from '../components/Header';
import Footer from '../components/Footer';

const { RangePicker } = DatePicker;
import { requestGetRoomById } from '../config/RoomRequest';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { requestCreateCart } from '../config/CartRequest';
import { useStore } from '../hooks/useStore';
import { requestGetPreviewRoom } from '../config/PreviewRequest';
import { requestCreateRoomWatch } from '../config/RoomWatch';

function DetailRoom() {
    const [roomData, setRoomData] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams();

    const { fetchCart, dataUser } = useStore();

    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [numberOfAdults, setNumberOfAdults] = useState(1);
    const [numberOfChildren, setNumberOfChildren] = useState(0);
    const [previewRoom, setPreviewRoom] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);

    const [payment, setPayment] = useState([]);

    const sortedPreviewReviews = previewRoom
        .filter((review) => review && review.userId)
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const ratingReviews = previewRoom.filter((review) => review && review.rating);

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        if (!dates) {
            setCheckInDate('');
            setCheckOutDate('');
            return;
        }

        setCheckInDate(dates[0]?.format('YYYY-MM-DD') || '');
        setCheckOutDate(dates[1]?.format('YYYY-MM-DD') || '');
    };

    useEffect(() => {
        if (dataUser && dataUser._id) {
            requestCreateRoomWatch({ roomId: id }).catch((error) => {
                console.error('[DetailRoom] Error creating room watch:', error);
            });
        }
    }, [dataUser, id]);

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        const fetchRoomById = async () => {
            try {
                console.log('[DetailRoom] Fetching room with id:', id);
                const res = await requestGetRoomById(id);
                
                // Handle both cases: res.metadata could be { room, payment } or just room
                const metadata = res.metadata;
                const roomData = metadata.room || metadata;
                const paymentData = metadata.payment || [];
                
                if (!roomData) {
                    throw new Error('Room data is empty');
                }
                
                setRoomData(roomData);
                setPayment(paymentData);
                setLoading(false);
                console.log('[DetailRoom] Room loaded successfully:', roomData);
            } catch (error) {
                console.error('[DetailRoom] Error fetching room:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Không thể tải thông tin phòng';
                setError(errorMessage);
                setLoading(false);
                toast.error(errorMessage);
            }
        };
        
        const fetchPreviewRoom = async () => {
            try {
                const res = await requestGetPreviewRoom(id);
                setPreviewRoom(res.metadata);
            } catch (error) {
                console.error('[DetailRoom] Error fetching preview room:', error);
            }
        };
        
        fetchRoomById();
        fetchPreviewRoom();
    }, [id]);

    

    const formatPrice = (price, discount = 0) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price - (price * discount) / 100);

    const getAmenityIcon = (amenity) => {
        switch (amenity.toLowerCase()) {
            case 'wifi':
                return <Wifi className="w-5 h-5" />;
            case 'tv':
                return <Tv className="w-5 h-5" />;
            case 'điều hòa':
                return <Wind className="w-5 h-5" />;
            default:
                return <Check className="w-5 h-5" />;
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const calculateNights = () => {
        if (!checkInDate || !checkOutDate) return 0;
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        const diffTime = end - start;
        return diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
    };

    const totalPrice = calculateNights() * (roomData?.pricePerNight || 0);

    const blockedBookingRanges = payment
        .filter((booking) => booking.status !== 'cancelled')
        .map((booking) => ({
            start: dayjs(booking.checkInDate).startOf('day'),
            end: dayjs(booking.checkOutDate).startOf('day'),
        }));

    const disabledCheckInDate = (current) => {
        if (!current) return false;
        const today = dayjs().startOf('day');
        if (current.isBefore(today, 'day')) return true;
        return blockedBookingRanges.some(({ start, end }) =>
            current.isSame(start, 'day') || (current.isAfter(start, 'day') && current.isBefore(end, 'day')),
        );
    };

    const disabledCheckOutDate = (current) => {
        if (!current) return false;
        const today = dayjs().startOf('day');
        if (current.isBefore(today, 'day')) return true;
        if (checkInDate) {
            if (!current.isAfter(dayjs(checkInDate), 'day')) return true;
        }
        return blockedBookingRanges.some(({ start, end }) =>
            current.isSame(start, 'day') || (current.isAfter(start, 'day') && current.isBefore(end, 'day')),
        );
    };

    const disabledBookingDate = (current) => {
        if (!current) return false;
        const today = dayjs().startOf('day');
        if (current.isBefore(today, 'day')) return true;

        return blockedBookingRanges.some(({ start, end }) =>
            current.isSame(start, 'day') ||
            (current.isAfter(start, 'day') && current.isBefore(end, 'day')),
        );
    };

    // Check if selected dates conflict with existing bookings
    const checkDateConflict = () => {
        if (!checkInDate || !checkOutDate || !payment || payment.length === 0) return false;

        const selectedCheckIn = new Date(checkInDate);
        const selectedCheckOut = new Date(checkOutDate);

        return payment.some((booking) => {
            // Only check confirmed or pending bookings
            if (booking.status === 'cancelled') return false;

            const bookingCheckIn = new Date(booking.checkInDate);
            const bookingCheckOut = new Date(booking.checkOutDate);

            // Check if dates overlap
            // Overlap occurs if: selectedCheckIn < bookingCheckOut AND selectedCheckOut > bookingCheckIn
            return selectedCheckIn < bookingCheckOut && selectedCheckOut > bookingCheckIn;
        });
    };

    const handleCreateCart = async () => {
        if (!checkInDate || !checkOutDate) {
            toast.error('Hãy chọn ngày đặt phòng');
            return;
        }
        if (!numberOfAdults) {
            toast.error('Vui lòng chọn số người lớn');
            return;
        }
        if (checkInDate > checkOutDate) {
            toast.error('Ngày nhận phòng phải trước ngày trả phòng');
            return;
        }

        // Check for date conflicts
        if (checkDateConflict()) {
            toast.error('Ngày bạn chọn đã có người đặt. Vui lòng chọn ngày khác');
            return;
        }

        const data = {
            roomId: id,
            checkInDate,
            checkOutDate,
            numberOfAdults,
            numberOfChildren,
        };

        try {
            await requestCreateCart(data);
            await fetchCart();
            toast.success('✅ Đã thêm phòng vào giỏ hàng');
        } catch (error) {
            console.log(error);

            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error || !roomData) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Lỗi</h1>
                        <p className="text-gray-600 mb-6">
                            {error || 'Không thể tải thông tin phòng. Vui lòng thử lại sau.'}
                        </p>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                            <div className="relative h-96">
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/uploads/room/${
                                        roomData.images[currentImageIndex]
                                    }`}
                                    alt={roomData.roomName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                    {currentImageIndex + 1} / {roomData.images.length}
                                </div>
                            </div>
                            <div className="flex gap-2 p-4 overflow-x-auto">
                                {roomData.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                            currentImageIndex === index ? 'border-primary-500' : 'border-gray-200'
                                        }`}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}/uploads/room/${image}`}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hotel Info */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Thông tin khách sạn</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="flex items-center">
                                    <MapPin className="w-6 h-6 text-primary-600 mr-2" />
                                    <span className="text-gray-700">{roomData.address || 'Hà Nội'}</span>
                                </div>
                                <div className="flex items-center">
                                    <Building2 className="w-6 h-6 text-green-600 mr-2" />
                                    <span className="text-gray-700">Tầng: {roomData.floor}</span>
                                </div>
                                <div className="flex items-center">
                                    <DoorOpen className="w-6 h-6 text-primary-600 mr-2" />
                                    <span className="text-gray-700">Số phòng: {roomData.roomNumber}</span>
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Tiện nghi</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                {roomData.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-primary-600 mr-3">{getAmenityIcon(amenity)}</div>
                                        <span className="font-medium">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Mô tả</h2>
                            <div
                                className="prose max-w-none text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: roomData.description }}
                            />
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Đánh giá từ khách hàng</h2>
                                <div className="flex items-center">
                                    <div className="flex items-center mr-2">
                                        {renderStars(
                                            Math.round(
                                                previewRoom
                                                    .filter((review) => review && review.rating)
                                                    .reduce((sum, review) => sum + review.rating, 0) /
                                                    Math.max(previewRoom.filter((review) => review && review.rating).length, 1) || 0,
                                            ),
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {previewRoom.filter((review) => review && review.rating).length > 0
                                            ? `${(
                                                  previewRoom
                                                      .filter((review) => review && review.rating)
                                                      .reduce((sum, review) => sum + review.rating, 0) /
                                                  previewRoom.filter((review) => review && review.rating).length
                                              ).toFixed(1)} (${previewRoom.filter((review) => review && review.rating).length} đánh giá)`
                                            : 'Chưa có đánh giá'}
                                    </span>
                                </div>
                            </div>

                            {previewRoom.filter((review) => review && review.userId).length > 0 ? (
                                <div className="space-y-6">
                                    {sortedPreviewReviews.map((review) => (
                                        <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                            <div className="flex items-start space-x-4">
                                                {/* User Avatar */}
                                                <div className="flex-shrink-0">
                                                    {review.userId?.avatar ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_API_URL}/uploads/avatars/${
                                                                review.userId.avatar
                                                            }`}
                                                            alt={review.userId?.fullName || 'User'}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                                            <User className="w-6 h-6 text-primary-600" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Review Content */}
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">
                                                                {review.userId?.fullName || 'Người dùng ẩn danh'}
                                                            </h4>
                                                            <div className="flex items-center mt-1">
                                                                {renderStars(review.rating)}
                                                                <span className="ml-2 text-sm text-gray-500">
                                                                    {formatDate(review.createdAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed">{review.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Star className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đánh giá nào</h3>
                                    <p className="text-gray-500">
                                        Hãy là người đầu tiên đánh giá phòng này sau khi trải nghiệm!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                            <h1 className="text-2xl font-bold mb-2">{roomData.roomName}</h1>
                            <div className="flex items-baseline mb-4">
                                <span className="text-3xl font-bold text-primary-600">
                                    {formatPrice(roomData.pricePerNight, roomData.discount)}
                                </span>
                                <span className="ml-2 text-gray-600">/ đêm</span>
                            </div>

                            {/* Existing Bookings Info */}
                            {payment && payment.length > 0 && (
                                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <h3 className="text-sm font-medium text-yellow-800 mb-2">
                                        <Info className="w-4 h-4 inline mr-1" />
                                        Ngày đã được đặt:
                                    </h3>
                                    <div className="text-xs text-yellow-700 space-y-1">
                                        {payment
                                            .filter((booking) => booking.status !== 'cancelled')
                                            .map((booking, index) => (
                                                <div key={index}>
                                                    {new Date(booking.checkInDate).toLocaleDateString('vi-VN')} -{' '}
                                                    {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Booking Form */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nhận</label>
                                    <DatePicker
                                        value={checkInDate ? dayjs(checkInDate) : null}
                                        onChange={(date) => setCheckInDate(date ? date.format('YYYY-MM-DD') : '')}
                                        disabledDate={disabledCheckInDate}
                                        format="YYYY-MM-DD"
                                        className="w-full mb-3"
                                    />
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày trả</label>
                                    <DatePicker
                                        value={checkOutDate ? dayjs(checkOutDate) : null}
                                        onChange={(date) => setCheckOutDate(date ? date.format('YYYY-MM-DD') : '')}
                                        disabledDate={disabledCheckOutDate}
                                        format="YYYY-MM-DD"
                                        className="w-full"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Người lớn
                                        </label>
                                        <select
                                            value={numberOfAdults}
                                            onChange={(e) => setNumberOfAdults(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        >
                                            {[...Array(roomData.maxAdults)].map((_, i) => (
                                                <option key={i} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Trẻ em</label>
                                        <select
                                            value={numberOfChildren}
                                            onChange={(e) => setNumberOfChildren(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        >
                                            {[...Array(roomData.maxChildren + 1)].map((_, i) => (
                                                <option key={i} value={i}>
                                                    {i}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Date Conflict Warning */}
                            {checkInDate && checkOutDate && checkDateConflict() && (
                                <div className="bg-accent-50 border border-accent-200 rounded-lg p-3 mb-4">
                                    <div className="flex items-center text-accent-800 text-sm">
                                        <Info className="w-4 h-4 mr-2" />
                                        <span>Ngày bạn chọn đã có người đặt. Vui lòng chọn ngày khác.</span>
                                    </div>
                                </div>
                            )}

                            {/* Total Price */}
                            {calculateNights() > 0 && !checkDateConflict() && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="flex justify-between mb-2 text-sm text-gray-600">
                                        <span>Số đêm</span>
                                        <span>{calculateNights()} đêm</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold text-primary-600">
                                        <span>Tổng cộng</span>
                                        <span>{formatPrice(totalPrice, roomData.discount)}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                                disabled={!(checkInDate && checkOutDate) || checkDateConflict()}
                                onClick={handleCreateCart}
                            >
                                <ShoppingCartOutlined className="mr-2" />
                                {(() => {
                                    if (checkInDate && checkOutDate && checkDateConflict()) {
                                        return 'Ngày đã được đặt';
                                    }

                                    return 'Đặt phòng ngay';
                                })()}
                            </button>

                            <div className="mt-4 text-center text-sm text-gray-600">
                                <p>✅ Miễn phí hủy trong 24h</p>
                                <p>💳 Thanh toán tại khách sạn</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default DetailRoom;
