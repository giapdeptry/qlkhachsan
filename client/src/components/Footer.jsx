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
                        <h2 className="text-green-700 font-bold text-lg md:text-xl uppercase leading-tight mb-2">
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
                                123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
                            </span>
                            <span>
                                <PhoneOutlined className="mr-2" />
                                (+84) 909 888 777
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

                {/* Google Map Section */}
                <div className="mt-8 mb-6">
                    <h3 className="font-bold text-lg mb-3 text-center text-green-700">Chi Nhánh Quận 7</h3>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-full md:w-2/3 rounded-lg overflow-hidden shadow-lg border border-gray-200">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9551039697257!2d106.70969107589484!3d10.732614489407024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f9f78095295%3A0x8204231adcba8db3!2zMTUgTmd1eeG7hW4gTMawxqFuZyBC4bqxbmcsIFTDom4gUGjDuiwgUXXhuq1uIDcsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1692443232044!5m2!1svi!2s"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Maps"
                                className="w-full"
                            />
                        </div>
                        <div className="w-full md:w-1/3 p-5 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col gap-3">
                            <h4 className="font-bold text-green-700 text-lg pb-2 border-b border-gray-100">
                                Khách Sạn Quận 7
                            </h4>
                            <div className="flex items-start text-gray-700">
                                <EnvironmentOutlined className="mr-3 text-red-500 text-lg mt-1" />
                                <span>15 Nguyễn Lương Bằng, Tân Phú, Quận 7, Hồ Chí Minh</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <PhoneOutlined className="mr-3 text-green-600 text-lg" />
                                <span>(+84-28) 7308 6779</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <MailOutlined className="mr-3 text-blue-500 text-lg" />
                                <span>q7@naturehotel.vn</span>
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-100">
                                <p className="text-sm text-gray-500">Giờ nhận phòng: 14:00 - 23:00</p>
                                <p className="text-sm text-gray-500">Giờ trả phòng: trước 12:00</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle legal info */}
                <div className="mt-6 text-center text-green-900 text-sm leading-relaxed">
                    Khách sạn Thiên Nhiên được cấp phép kinh doanh lưu trú tại TP.HCM.
                    <br />
                    Mã số thuế: 0312345678 – Ngày cấp: 15/03/2015.
                    <br />
                    Địa chỉ đăng ký: 123 Nguyễn Huệ, Quận 1, Thành phố Hồ Chí Minh, Việt Nam.
                </div>
            </div>

            {/* Copyright bar */}
            <div className="bg-green-800 text-white text-center py-2 mt-8 text-sm">
                © 2025. Bản quyền thuộc về KHÁCH SẠN THIÊN NHIÊN
            </div>
        </footer>
    );
}

export default Footer;
