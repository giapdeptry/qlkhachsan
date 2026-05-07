import { useState } from 'react';
import { Card, Row, Col, Button, Modal, Carousel, Rate, Tag, Space } from 'antd';
import {
    WifiOutlined,
    CarOutlined,
    HeartOutlined,
    CoffeeOutlined,
    TrophyOutlined,
    TeamOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    StarOutlined,
    CameraOutlined,
    SoundOutlined,
    GiftOutlined,
    SafetyOutlined,
    ThunderboltOutlined,
    FireOutlined,
    BankOutlined,
    ShoppingOutlined,
    MedicineBoxOutlined,
    PhoneOutlined,
    GlobalOutlined,
    FileTextOutlined,
    ToolOutlined,
    CrownOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import Footer from '../components/Footer';
import Header from '../components/Header';

function Facilities() {
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const facilities = [
        {
            id: 1,
            title: 'Spa & Wellness',
            icon: <HeartOutlined className="text-4xl text-pink-500" />,
            description: 'Thư giãn hoàn hảo với các dịch vụ spa cao cấp',
            features: ['Massage trị liệu', 'Xông hơi', 'Tắm bùn', 'Chăm sóc da'],
            images: [
                'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
                'https://images.unsplash.com/photo-1596178060810-dc8b0b8d8c8c?w=800',
            ],
            rating: 4.8,
            hours: '06:00 - 22:00',
            details:
                'Không gian yên tĩnh với liệu pháp massage chuyên nghiệp, xông hơi truyền thống và các phương pháp chăm sóc sức khỏe hiện đại.',
        },
        {
            id: 2,
            title: 'Nhà Hàng',
            icon: <CoffeeOutlined className="text-4xl text-orange-500" />,
            description: 'Ẩm thực đa dạng từ quốc tế đến địa phương',
            features: ['Buffet sáng', 'Món Á - Âu', 'Hải sản tươi sống', 'Rượu vang cao cấp'],
            images: [
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
                'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
                'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800',
            ],
            rating: 4.6,
            hours: '06:00 - 23:00',
            details:
                'Đầu bếp tài ba với kinh nghiệm quốc tế, thực đơn đa dạng từ ẩm thực Á-Âu đến các món đặc sản địa phương được chế biến tinh tế.',
        },
        {
            id: 3,
            title: 'Hồ Bơi',
            icon: <TrophyOutlined className="text-4xl text-blue-500" />,
            description: 'Hồ bơi vô cực với view biển tuyệt đẹp',
            features: ['Hồ bơi vô cực', 'Jacuzzi', 'Bar hồ bơi', 'Ghế tắm nắng'],
            images: [
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
                'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
            ],
            rating: 4.9,
            hours: '05:00 - 23:00',
            details:
                'Hồ bơi vô cực với thiết kế hiện đại, view biển tuyệt đẹp cùng khu vực jacuzzi và bar hồ bơi phục vụ đồ uống tươi mát.',
        },
        {
            id: 4,
            title: 'Phòng Gym',
            icon: <TeamOutlined className="text-4xl text-green-500" />,
            description: 'Phòng tập hiện đại với thiết bị cao cấp',
            features: ['Thiết bị cardio', 'Tạ tự do', 'Yoga studio', 'PT cá nhân'],
            images: [
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
                'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
                'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
            ],
            rating: 4.7,
            hours: '24/7',
            details:
                'Phòng tập thể dục hiện đại với thiết bị cao cấp, không gian yoga riêng biệt và huấn luyện viên cá nhân chuyên nghiệp.',
        },
        {
            id: 5,
            title: 'Dịch Vụ Lễ Tân',
            icon: <EnvironmentOutlined className="text-4xl text-purple-500" />,
            description: 'Hỗ trợ 24/7 với đội ngũ chuyên nghiệp',
            features: ['Check-in/out', 'Đặt tour', 'Đặt xe', 'Hướng dẫn du lịch'],
            images: [
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
            ],
            rating: 4.8,
            hours: '24/7',
            details:
                'Đội ngũ lễ tân chuyên nghiệp với khả năng giao tiếp đa ngôn ngữ, sẵn sàng hỗ trợ mọi nhu cầu của khách hàng 24/7.',
        },
        {
            id: 6,
            title: 'Khu Vui Chơi Trẻ Em',
            icon: <GiftOutlined className="text-4xl text-yellow-500" />,
            description: 'Không gian vui chơi an toàn cho trẻ em',
            features: ['Khu vui chơi', 'Bể bóng', 'Trò chơi điện tử', 'Giám sát viên'],
            images: [
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
            ],
            rating: 4.5,
            hours: '08:00 - 21:00',
            details:
                'Không gian vui chơi an toàn và thú vị cho trẻ em với các hoạt động giáo dục, trò chơi và sự giám sát chuyên nghiệp.',
        },
    ];

    const additionalServices = [
        { icon: <WifiOutlined />, title: 'WiFi Miễn Phí', description: 'Kết nối internet tốc độ cao' },
        { icon: <CarOutlined />, title: 'Đỗ Xe', description: 'Bãi đỗ xe an toàn 24/7' },
        { icon: <ClockCircleOutlined />, title: 'Room Service', description: 'Dịch vụ phòng 24/7' },
        { icon: <CameraOutlined />, title: 'Chụp Ảnh', description: 'Dịch vụ chụp ảnh chuyên nghiệp' },
        { icon: <SoundOutlined />, title: 'Karaoke', description: 'Phòng karaoke hiện đại' },
        { icon: <SafetyOutlined />, title: 'Bảo Vệ', description: 'An ninh 24/7' },
        { icon: <ThunderboltOutlined />, title: 'Điện Nước', description: 'Điện nước ổn định' },
        { icon: <FireOutlined />, title: 'Hệ Thống PCCC', description: 'An toàn cháy nổ' },
        { icon: <BankOutlined />, title: 'ATM', description: 'Máy ATM tiện lợi' },
        { icon: <ShoppingOutlined />, title: 'Cửa Hàng', description: 'Mua sắm tại chỗ' },
        { icon: <MedicineBoxOutlined />, title: 'Y Tế', description: 'Dịch vụ y tế khẩn cấp' },
        { icon: <PhoneOutlined />, title: 'Tổng Đài', description: 'Hỗ trợ khách hàng' },
        { icon: <GlobalOutlined />, title: 'Đa Ngôn Ngữ', description: 'Hỗ trợ nhiều thứ tiếng' },
        { icon: <FileTextOutlined />, title: 'In Ấn', description: 'Dịch vụ in ấn, fax' },
        { icon: <ToolOutlined />, title: 'Sửa Chữa', description: 'Bảo trì thiết bị' },
        { icon: <CrownOutlined />, title: 'VIP Service', description: 'Dịch vụ VIP cao cấp' },
    ];

    const showModal = (facility) => {
        setSelectedFacility(facility);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedFacility(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <header>
                <Header />
            </header>

            <main className="">
                {/* Hero Section */}
                <div className="relative h-96 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="relative z-10 flex items-center justify-center h-full">
                        <div className="text-center text-white max-w-4xl mx-auto px-4">
                            <h1 className="text-5xl font-bold mb-4">Tiện Ích & Dịch Vụ Khách Sạn</h1>
                            <p className="text-xl mb-8">
                                Khám phá những tiện ích hiện đại và dịch vụ đẳng cấp mà chúng tôi mang đến cho quý khách
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Tag color="gold" className="px-4 py-2 text-lg">
                                    <StarOutlined /> 5 Sao
                                </Tag>
                                <Tag color="green" className="px-4 py-2 text-lg">
                                    <CheckCircleOutlined /> Chứng Nhận Quốc Tế
                                </Tag>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Introduction Section */}
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Trải Nghiệm Đẳng Cấp Tại Khách Sạn</h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            Tại khách sạn của chúng tôi, chúng tôi cam kết mang đến cho quý khách những trải nghiệm
                            tuyệt vời nhất với hệ thống tiện ích hiện đại và dịch vụ chuyên nghiệp. Từ spa thư giãn đến
                            nhà hàng ẩm thực cao cấp, từ hồ bơi vô cực đến phòng gym 24/7, mọi tiện ích đều được thiết
                            kế để đáp ứng nhu cầu và mong muốn của từng vị khách.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            <div className="text-center">
                                <div className="text-4xl text-blue-600 mb-3">
                                    <CheckCircleOutlined />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Chất Lượng Cao</h3>
                                <p className="text-gray-600">Tiêu chuẩn 5 sao quốc tế</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl text-green-600 mb-3">
                                    <ClockCircleOutlined />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Phục Vụ 24/7</h3>
                                <p className="text-gray-600">Hỗ trợ mọi lúc mọi nơi</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl text-purple-600 mb-3">
                                    <CrownOutlined />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Đẳng Cấp VIP</h3>
                                <p className="text-gray-600">Trải nghiệm cao cấp</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Facilities Section */}

                {/* Additional Services Section */}
                <div className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">Tiện Ích Bổ Sung</h2>
                            <p className="text-xl text-gray-600">Những tiện ích hiện đại và dịch vụ tiện lợi khác</p>
                        </div>

                        <Row gutter={[16, 16]}>
                            {additionalServices.map((service, index) => (
                                <Col xs={12} sm={8} md={6} lg={4} key={index}>
                                    <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-300">
                                        <div className="text-3xl text-blue-600 mb-3">{service.icon}</div>
                                        <h4 className="font-semibold text-gray-800 mb-1">{service.title}</h4>
                                        <p className="text-sm text-gray-600">{service.description}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>

                {/* Conclusion Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Cam Kết Chất Lượng Dịch Vụ</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                Với hơn 20 năm kinh nghiệm trong ngành khách sạn, chúng tôi tự hào mang đến cho quý
                                khách những trải nghiệm tuyệt vời nhất. Mỗi tiện ích, mỗi dịch vụ đều được thiết kế và
                                vận hành với tiêu chuẩn cao nhất, đảm bảo sự hài lòng tuyệt đối cho từng vị khách.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                                <div className="bg-white p-6 rounded-xl shadow-lg">
                                    <div className="text-center">
                                        <div className="text-4xl text-blue-600 mb-4">
                                            <StarOutlined />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-3">Đánh Giá Cao</h3>
                                        <p className="text-gray-600">
                                            Được khách hàng đánh giá 4.8/5 sao và nhận được nhiều giải thưởng uy tín
                                            trong ngành.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-lg">
                                    <div className="text-center">
                                        <div className="text-4xl text-green-600 mb-4">
                                            <CheckCircleOutlined />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-3">Đảm Bảo Chất Lượng</h3>
                                        <p className="text-gray-600">
                                            Tất cả tiện ích đều được kiểm tra và bảo trì thường xuyên để đảm bảo hoạt
                                            động tốt nhất.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal for Facility Details */}
                <Modal
                    title={selectedFacility?.title}
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="close" onClick={handleCancel}>
                            Đóng
                        </Button>,
                    ]}
                    width={800}
                    className="facility-modal"
                >
                    {selectedFacility && (
                        <div>
                            <Carousel autoplay className="mb-6">
                                {selectedFacility.images.map((image, index) => (
                                    <div key={index}>
                                        <img
                                            src={image}
                                            alt={selectedFacility.title}
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                    </div>
                                ))}
                            </Carousel>

                            <div className="mb-4">
                                <Rate disabled defaultValue={selectedFacility.rating} />
                                <span className="ml-2 text-gray-600">({selectedFacility.rating}/5)</span>
                            </div>

                            <p className="text-gray-700 mb-4">{selectedFacility.description}</p>

                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Dịch vụ bao gồm:</h4>
                                <Space wrap>
                                    {selectedFacility.features.map((feature, index) => (
                                        <Tag key={index} color="blue">
                                            {feature}
                                        </Tag>
                                    ))}
                                </Space>
                            </div>

                            <div className="text-sm">
                                <div className="mb-2">
                                    <strong>Giờ hoạt động:</strong> {selectedFacility.hours}
                                </div>
                                <div>
                                    <strong>Mô tả chi tiết:</strong> {selectedFacility.details}
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default Facilities;
