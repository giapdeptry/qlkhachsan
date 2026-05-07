import { Input, Dropdown, Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import { useStore } from '../hooks/useStore';
import { requestLogout } from '../config/UserRequest';

import { toast } from 'react-toastify';

function Header() {
    const { dataUser, cart } = useStore();

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await requestLogout();
            toast.success('Đăng xuất thành công!');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const userMenu = (
        <Menu
            className="min-w-48 shadow-lg border-0 rounded-xl overflow-hidden"
            items={[
                dataUser?.isAdmin && {
                    key: '0',
                    label: (
                        <div className="flex items-center gap-3 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-200">
                            <Link to="/admin">
                                <span className="font-medium text-gray-700">Trang Admin</span>
                            </Link>
                        </div>
                    ),
                },
                {
                    key: '1',
                    label: (
                        <div className="flex items-center gap-3 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-200">
                            <Link to="/profile">
                                <span className="font-medium text-gray-700">Thông tin cá nhân</span>
                            </Link>
                        </div>
                    ),
                },
                {
                    key: '2',
                    label: (
                        <div
                            onClick={handleLogout}
                            className="flex items-center gap-3 py-2 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                            <span className="font-medium text-gray-700">Đăng xuất</span>
                        </div>
                    ),
                },
            ].filter(Boolean)}
        />
    );

    const navItems = [
        {
            label: `Thông tin đặt phòng ${cart?.rooms?.length > 0 ? `(${cart?.rooms?.length})` : ''}`,
            path: '/booking-info',
        },
        { label: 'Tiện Nghi', path: '/facilities' },
        { label: 'Liên Hệ', path: '/contact' },
        { label: 'Giới Thiệu', path: '/about' },
        { label: 'Bài viết', path: '/blog' },
    ];

    return (
        <header className="w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
            <div className="w-[90%] mx-auto">
                <div className="flex items-center justify-between py-4 px-6">
                    {/* Logo */}
                    <Link to="/">
                        <div className="flex items-center gap-8">
                            <div className="group cursor-pointer">
                                <div className="scale-150 text-2xl font-bold text-blue-600 group-hover:text-blue-500 transition-all duration-300">
                                    🏨SmartStay
                                </div>
                                <div className="text-xs text-gray-500 font-light tracking-wider">LUXURY EXPERIENCE</div>
                            </div>

                            {/* Desktop Navigation */}
                        </div>
                    </Link>

                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>

                    <div></div>
                    <div></div>

                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item, index) => (
                            <Link
                                to={item.path}
                                key={index}
                                className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 relative group"
                            >
                                {item.label}
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-3/4 transition-all duration-300"></div>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        {!dataUser._id ? (
                            <div className="hidden lg:flex items-center gap-3">
                                <Link to="/login">
                                    <button className="h-11 px-3 border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600 rounded-full font-medium text-sm transition-all duration-300 hover:shadow-md">
                                        Đăng nhập
                                    </button>
                                </Link>
                                <Link to="/register">
                                    <button
                                        type="button"
                                        className="h-10 text-white px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 rounded-full font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        Đăng ký
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
                                    <button className="h-11 px-4 border-2 border-gray-200 hover:border-blue-400 rounded-full flex items-center gap-3 hover:shadow-md transition-all duration-300 hover:scale-105 bg-white">
                                        <div className="flex items-center gap-3">
                                            {dataUser.avatar ? (
                                                <img
                                                    src={
                                                        `${import.meta.env.VITE_API_URL}/uploads/avatars/${
                                                            dataUser.avatar
                                                        }` ||
                                                        'https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png'
                                                    }
                                                    alt="Avatar"
                                                    className="w-7 h-7 rounded-full object-cover border-2 border-blue-200"
                                                />
                                            ) : (
                                                <div>
                                                    <img
                                                        className="w-7 h-7 rounded-full object-cover border-2 border-blue-200"
                                                        src="https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png"
                                                        alt=""
                                                    />
                                                </div>
                                            )}
                                            <span className="font-medium text-gray-700 hidden sm:inline">
                                                {dataUser.fullName}
                                            </span>
                                        </div>
                                    </button>
                                </Dropdown>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
