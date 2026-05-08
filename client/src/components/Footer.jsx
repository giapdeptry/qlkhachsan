import { EnvironmentOutlined, PhoneOutlined, MailOutlined, InfoCircleOutlined } from '@ant-design/icons';

function Footer() {
    return (
        <footer className="pt-8 pb-0 border-t border-gray-200 relative">
            {/* World map background */}
            <div className="absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none select-none">
                <img
                    src="https://dulichthiennhien.vn/images/worldmap.png"
                    alt="map"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-stretch text-center md:text-left gap-8 md:gap-0">
                    {/* Company Info */}
                    <div className="md:w-1/3 flex flex-col items-center md:items-start mb-6 md:mb-0">
                        <h2 className="text-primary-700 font-bold text-lg md:text-xl uppercase leading-tight mb-2">
                            KHÁCH SẠN THIÊN NHIÊN
                            <br />
                            <span className="text-base font-normal normal-case">(NATURE HOTEL)</span>
                        </h2>
                        <p className="text-gray-600 text-sm mt-2">
                            Dịch vụ lưu trú cao cấp, tiện nghi hiện đại, vị trí trung tâm thành phố.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="md:w-1/3 flex flex-col items-center">
                        <h3 className="font-bold text-lg mb-2">Liên Hệ Đặt Phòng</h3>
                        <div className="flex flex-col items-center text-gray-700 text-base gap-1">
                            <span>
                                <EnvironmentOutlined className="mr-2" />
                                Mỹ Đình, Từ Liêm, Hà Nội
                            </span>
                            <span>
                                <PhoneOutlined className="mr-2" />
                                (+84) 24 7777 8888
                            </span>
                            <span>
                                <MailOutlined className="mr-2" />
                                booking@naturehotel.vn
                            </span>
                        </div>
                    </div>

                    {/* Info Column */}
                    <div className="md:w-1/3 flex flex-col items-center md:items-end">
                        <h3 className="font-bold text-lg mb-2">Thông Tin Cần Biết</h3>
                        <div className="flex flex-col items-center md:items-end text-gray-700 text-base gap-1">
                            <span>
                                <InfoCircleOutlined className="mr-2" />
                                Điều khoản đặt phòng
                            </span>
                            <span>
                                <InfoCircleOutlined className="mr-2" />
                                Chính sách hủy phòng & hoàn tiền
                            </span>
                            <div className="flex items-center gap-2 mt-2">
                                <img
                                    src="https://www.toponseek.com/wp-content/uploads/2024/07/dmca-la-gi.jpg"
                                    alt="dmca"
                                    className="h-7"
                                />
                                <img
                                    src="https://webmedia.com.vn/images/2021/09/logo-da-thong-bao-bo-cong-thuong-mau-xanh.png"
                                    alt="bct"
                                    className="h-7"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Google Map removed as requested */}

                {/* Middle legal info */}
                <div className="mt-6 text-center text-primary-900 text-sm leading-relaxed">
                    Khách sạn Thiên Nhiên được cấp phép kinh doanh lưu trú tại Hà Nội.
                    <br />
                    Mã số thuế: 0312345678 – Ngày cấp: 15/03/2015.
                    <br />
                    Địa chỉ đăng ký: 288 Đường Cộng Hoà, Phường Mỹ Đình 1, Quận Nam Từ Liêm, Hà Nội, Việt Nam.
                </div>
            </div>

            {/* Copyright bar */}
            <div className="bg-primary-800 text-white text-center py-2 mt-8 text-sm">
                © 2025. Bản quyền thuộc về KHÁCH SẠN THIÊN NHIÊN
            </div>
        </footer>
    );
}

export default Footer;
