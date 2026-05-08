import React, { useState } from 'react';
import { Calendar, Users, Baby, Search, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Banner() {
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);

    const images = [
        {
            url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            title: 'Khách sạn sang trọng',
            subtitle: 'Trải nghiệm đẳng cấp 5 sao',
        },
        {
            url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2049&q=80',
            title: 'Resort biển tuyệt đẹp',
            subtitle: 'Nghỉ dưỡng bên bờ biển xanh',
        },
        {
            url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            title: 'Villa riêng tư',
            subtitle: 'Không gian yên tĩnh, riêng biệt',
        },
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const navigate = useNavigate();

    const handleSearch = () => {
        if (!checkInDate || !checkOutDate) {
            toast.warning('Hãy chọn ngày đặt phòng');
            return;
        }

        navigate(`/search-room?checkIn=${checkInDate}&checkOut=${checkOutDate}&adults=${adults}&children=${children}`);
    };

    return (
        <div className="relative w-full h-[600px] overflow-hidden">
            {/* Background Slider */}
            <div className="relative h-full">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                    </div>
                ))}
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/80'
                        }`}
                    />
                ))}
            </div>

            {/* Hero Text */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-center text-white z-10">
                <h1 className="text-5xl font-bold mb-4 drop-shadow-lg animate-fade-in">{images[currentSlide].title}</h1>
                <p className="text-xl opacity-90 drop-shadow-md">{images[currentSlide].subtitle}</p>
                <div className="flex items-center justify-center mt-4 space-x-2 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} fill="currentColor" />
                    ))}
                </div>
            </div>

            {/* Search Form */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl">
                <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/20">
                    <div className="flex items-center mb-6">
                        <MapPin className="text-primary-600 mr-2" size={24} />
                        <h2 className="text-2xl font-bold text-gray-800">Tìm Phòng Khách Sạn</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-end">
                        {/* Check-in Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center">
                                <Calendar className="mr-1" size={16} />
                                Ngày Nhận Phòng
                            </label>
                            <input
                                type="date"
                                value={checkInDate}
                                onChange={(e) => setCheckInDate(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-primary-300"
                            />
                        </div>

                        {/* Check-out Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center">
                                <Calendar className="mr-1" size={16} />
                                Ngày Trả Phòng
                            </label>
                            <input
                                type="date"
                                value={checkOutDate}
                                onChange={(e) => setCheckOutDate(e.target.value)}
                                min={checkInDate}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-primary-300"
                            />
                        </div>

                        {/* Adults */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center">
                                <Users className="mr-1" size={16} />
                                Người Lớn
                            </label>
                            <select
                                value={adults}
                                onChange={(e) => setAdults(Number(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-primary-300 bg-white"
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1} người
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Children */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center">
                                <Baby className="mr-1" size={16} />
                                Trẻ Em
                            </label>
                            <select
                                value={children}
                                onChange={(e) => setChildren(Number(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-primary-300 bg-white"
                            >
                                {[...Array(6)].map((_, i) => (
                                    <option key={i} value={i}>
                                        {i} trẻ em
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Search Button */}
                        <div className="lg:col-span-1">
                            <button
                                onClick={handleSearch}
                                className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Search size={20} />
                                <span>Tìm kiếm</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
            `}</style>
        </div>
    );
}

export default Banner;
