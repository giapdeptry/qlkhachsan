import { useEffect, useState } from 'react';
import { Calendar, Search, Users, Star } from 'lucide-react';
import Header from '../components/Header';
import { requestGetRooms, requestSearchRoom } from '../config/RoomRequest';
import Footer from '../components/Footer';

import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';

const amenitiesOptions = [
    { value: 'Wifi', label: 'Wi-Fi Miễn Phí' },
    { value: 'Điều Hoà', label: 'Điều Hoà' },
    { value: 'Tivi', label: 'Smart TV' },
    { value: 'Spa', label: 'Dịch Vụ Spa' },
    { value: 'Máy Sưởi', label: 'Máy Sưởi' },
];

function SearchRoom() {
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);

    const [rooms, setRooms] = useState([]);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const adultsRoom = searchParams.get('adults');
    const childrenRoom = searchParams.get('children');

    // Function để xử lý tìm kiếm
    const handleSearch = async () => {
        // Kiểm tra validation
        if (!checkInDate || !checkOutDate) {
            alert('Hãy chọn ngày đặt phòng');
            return;
        }

        if (new Date(checkInDate) >= new Date(checkOutDate)) {
            alert('Ngày trả phòng phải sau ngày nhận phòng');
            return;
        }

        if (new Date(checkInDate) < new Date()) {
            alert('Ngày nhận phòng không thể trong quá khứ');
            return;
        }

        try {
            // Navigate với search params mới
            const newSearchParams = new URLSearchParams({
                checkIn: checkInDate,
                checkOut: checkOutDate,
                adults: adults.toString(),
                children: children.toString(),
            });

            navigate(`/search-room?${newSearchParams.toString()}`);
        } catch (error) {
            console.error('Lỗi tìm kiếm:', error);
            alert('Có lỗi xảy ra khi tìm kiếm phòng');
        }
    };

    // Cập nhật state khi có URL params
    useEffect(() => {
        if (checkIn) setCheckInDate(checkIn);
        if (checkOut) setCheckOutDate(checkOut);
        if (adultsRoom) setAdults(parseInt(adultsRoom));
        if (childrenRoom) setChildren(parseInt(childrenRoom));
    }, [checkIn, checkOut, adultsRoom, childrenRoom]);

    useEffect(() => {
        // Chỉ tìm kiếm khi có đủ thông tin từ URL params
        if (checkIn && checkOut && adultsRoom && childrenRoom) {
            const searchRooms = async () => {
                try {
                    const data = {
                        checkIn,
                        checkOut,
                        adults: adultsRoom,
                        children: childrenRoom,
                    };
                    const res = await requestSearchRoom(data);
                    setRooms(res.metadata);
                } catch (error) {
                    console.error('Lỗi tìm kiếm phòng:', error);
                    setRooms([]);
                }
            };
            searchRooms();
        } else {
            // Nếu không có thông tin tìm kiếm, hiển thị tất cả phòng
            const fetchRooms = async () => {
                try {
                    const res = await requestGetRooms();
                    setRooms(res.metadata);
                } catch (error) {
                    console.error('Lỗi lấy danh sách phòng:', error);
                    setRooms([]);
                }
            };
            fetchRooms();
        }
    }, [checkIn, checkOut, adultsRoom, childrenRoom]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header>
                <Header />
            </header>

            <div className="w-[90%] mx-auto mt-8 grid grid-cols-12 gap-8 px-4 mb-6">
                {/* Enhanced Sidebar */}
                <div className="col-span-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 sticky top-4">
                        <div className="p-6">
                            <div className="flex items-center mb-6">
                                <Search className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-lg font-bold text-gray-800">Tìm Kiếm Phòng Hoàn Hảo</h2>
                            </div>

                            {/* Enhanced Date Selection */}
                            <div className="mb-6">
                                <div className="flex items-center mb-4">
                                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                                    <h3 className="font-medium text-sm text-gray-700">Thời Gian Lưu Trú</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={checkInDate}
                                            onChange={(e) => setCheckInDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-3 py-2 text-sm rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                                            placeholder="Ngày nhận phòng"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={checkOutDate}
                                            onChange={(e) => setCheckOutDate(e.target.value)}
                                            min={checkInDate || new Date().toISOString().split('T')[0]}
                                            className="w-full px-3 py-2 text-sm rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                                            placeholder="Ngày trả phòng"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Guest Selection */}
                            <div className="mb-6">
                                <div className="flex items-center mb-4">
                                    <Users className="w-5 h-5 text-purple-600 mr-2" />
                                    <h3 className="font-medium text-sm text-gray-700">Số Lượng Khách</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                                        <label className="text-xs font-medium text-gray-600 mb-2 block">
                                            Người lớn
                                        </label>
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold text-base">{adults}</span>
                                            <button
                                                onClick={() => setAdults(adults + 1)}
                                                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                                        <label className="text-xs font-medium text-gray-600 mb-2 block">Trẻ em</label>
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => setChildren(Math.max(0, children - 1))}
                                                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold text-base">{children}</span>
                                            <button
                                                onClick={() => setChildren(children + 1)}
                                                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="mb-6">
                                <button
                                    onClick={handleSearch}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                                >
                                    <Search className="w-5 h-5 mr-2" />
                                    Tìm Kiếm Phòng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Rooms List */}
                <div className="col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Phòng Có Sẵn ({rooms.length})</h2>
                            {checkIn && checkOut && adultsRoom && childrenRoom && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <span>
                                        Từ {new Date(checkIn).toLocaleDateString('vi-VN')} đến{' '}
                                        {new Date(checkOut).toLocaleDateString('vi-VN')}
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span>
                                        {adultsRoom} người lớn, {childrenRoom} trẻ em
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Sắp xếp theo:</span>
                            <select className="px-2 py-1 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500">
                                <option>Giá từ thấp đến cao</option>
                                <option>Đánh giá cao nhất</option>
                                <option>Phổ biến nhất</option>
                            </select>
                        </div>
                    </div>

                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 group hover:scale-[1.02]"
                        >
                            <div className="grid grid-cols-12">
                                {/* Enhanced Image Section */}
                                <div className="col-span-5 relative">
                                    <div className="relative h-80 overflow-hidden">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}/uploads/room/${room.images[0]}`}
                                            alt={room.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                                        {/* Badges */}
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            {room.discount && (
                                                <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold">
                                                    -{room.discount}%
                                                </span>
                                            )}
                                        </div>

                                        {/* Gallery Indicator */}
                                        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center">
                                            <span className="mr-1">📷</span>
                                            {room.images.length} ảnh
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Info Section */}
                                <div className="col-span-7 p-6 flex flex-col justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{room.roomName}</h3>
                                            {/* <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                                                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                                <span className="font-bold text-xs">{room.rating}</span>
                                                <span className="text-gray-500 text-xs ml-1">
                                                    ({room.reviewsCount})
                                                </span>
                                            </div> */}
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center text-gray-600">
                                                <Users className="w-4 h-4 mr-2 text-purple-600" />
                                                <span className="text-xs">
                                                    {room.maxAdults} người lớn • {room.maxChildren} trẻ em
                                                </span>
                                            </div>
                                        </div>

                                        {/* Amenities */}
                                        <div className="mb-4">
                                            <p className="text-xs text-gray-600 font-medium mb-2">Dịch vụ đặc biệt:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {room.amenities.map((amenity, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-lg text-xs font-medium border border-purple-200"
                                                    >
                                                        {amenitiesOptions.find((a) => a.value === amenity)?.icon}{' '}
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Price and Actions */}
                                    <div className="border-t pt-4 mt-4">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    {room.originalPrice > room.pricePerNight && (
                                                        <span className="text-lg text-gray-400 line-through">
                                                            {room.originalPrice.toLocaleString()} VND
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-baseline space-x-1">
                                                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                        {room.pricePerNight.toLocaleString()}
                                                    </span>
                                                    <span className="text-gray-600">VND</span>
                                                    <span className="text-sm text-gray-500">/ đêm</span>
                                                </div>
                                            </div>

                                            <div className="flex space-x-3">
                                                <Link to={`/detail-room/${room._id}`}>
                                                    <button className="px-3 py-2 text-sm border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium">
                                                        Chi Tiết
                                                    </button>
                                                </Link>
                                                <Link to={`/detail-room/${room._id}`}>
                                                    <button className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 font-medium shadow-lg hover:shadow-xl">
                                                        Đặt Ngay
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default SearchRoom;
