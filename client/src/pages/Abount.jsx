import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Avatar, Tag, Space } from 'antd';
import {
    TrophyOutlined,
    TeamOutlined,
    HeartOutlined,
    StarOutlined,
    CheckCircleOutlined,
    GlobalOutlined,
    CrownOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    SafetyOutlined,
    BankOutlined,
    GiftOutlined,
    ThunderboltOutlined,
    FireOutlined,
} from '@ant-design/icons';
import Footer from '../components/Footer';
import Header from '../components/Header';

function About() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('history');

    

    const leadershipTeam = [
        {
            name: 'Nguyễn Văn An',
            position: 'Tổng Giám Đốc',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
            experience: '20 năm kinh nghiệm',
            description: 'Chuyên gia trong lĩnh vực quản lý khách sạn với bằng MBA từ Harvard Business School.',
        },
        {
            name: 'Trần Thị Bình',
            position: 'Giám Đốc Điều Hành',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300',
            experience: '15 năm kinh nghiệm',
            description: 'Chuyên về phát triển chiến lược và quản lý chất lượng dịch vụ.',
        },
        {
            name: 'Lê Minh Cường',
            position: 'Giám Đốc Marketing',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
            experience: '12 năm kinh nghiệm',
            description: 'Chuyên gia marketing số và phát triển thương hiệu trong ngành du lịch.',
        },
        {
            name: 'Phạm Thị Dung',
            position: 'Giám Đốc Tài Chính',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
            experience: '18 năm kinh nghiệm',
            description: 'Chuyên gia tài chính với chứng chỉ CPA và kinh nghiệm quản lý tài chính doanh nghiệp.',
        },
    ];

    const awards = [
        {
            title: 'Khách Sạn Tốt Nhất Châu Á',
            year: '2023',
            organization: 'World Travel Awards',
            icon: <TrophyOutlined className="text-yellow-500" />,
        },
        {
            title: 'Dịch Vụ Khách Hàng Xuất Sắc',
            year: '2022',
            organization: 'TripAdvisor',
            icon: <StarOutlined className="text-primary-500" />,
        },
        {
            title: 'Khách Sạn Thân Thiện Môi Trường',
            year: '2023',
            organization: 'Green Hotels Association',
            icon: <HeartOutlined className="text-green-500" />,
        },
        {
            title: 'Giải Thưởng Đổi Mới',
            year: '2022',
            organization: 'Hospitality Innovation Awards',
            icon: <ThunderboltOutlined className="text-primary-500" />,
        },
    ];

    const values = [
        {
            icon: <HeartOutlined className="text-3xl text-red-500" />,
            title: 'Tận Tâm Phục Vụ',
            description: 'Đặt khách hàng làm trung tâm, cam kết mang đến trải nghiệm tuyệt vời nhất.',
        },
        {
            icon: <CheckCircleOutlined className="text-3xl text-green-500" />,
            title: 'Chất Lượng Cao',
            description: 'Duy trì tiêu chuẩn 5 sao quốc tế trong mọi dịch vụ và tiện ích.',
        },
        {
            icon: <TeamOutlined className="text-3xl text-primary-500" />,
            title: 'Làm Việc Nhóm',
            description: 'Xây dựng môi trường làm việc hợp tác, sáng tạo và phát triển.',
        },
        {
            icon: <GlobalOutlined className="text-3xl text-primary-500" />,
            title: 'Hội Nhập Quốc Tế',
            description: 'Áp dụng tiêu chuẩn quốc tế và đa dạng hóa dịch vụ.',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-sky-50">
            <header>
                <Header />
            </header>

            <main>
                {/* Hero Section */}
                <div className="relative h-96 bg-gradient-to-r from-blue-500 via-sky-600 to-blue-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="relative z-10 flex items-center justify-center h-full">
                        <div className="text-center text-white max-w-4xl mx-auto px-4">
                            <h1 className="text-5xl font-bold mb-4">Về Chúng Tôi</h1>
                            <p className="text-xl mb-8">
                                Hành trình 20 năm xây dựng và phát triển chuỗi khách sạn đẳng cấp quốc tế
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Tag color="gold" className="px-4 py-2 text-lg">
                                    <StarOutlined /> 5 Sao Quốc Tế
                                </Tag>
                                <Tag color="green" className="px-4 py-2 text-lg">
                                    <CheckCircleOutlined /> Chứng Nhận Uy Tín
                                </Tag>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Company Stats removed */}

                {/* Mission & Vision */}
                <div className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">Sứ Mệnh & Tầm Nhìn</h2>
                            <p className="text-xl text-gray-600">
                                Định hướng phát triển và giá trị cốt lõi của chúng tôi
                            </p>
                        </div>

                        <Row gutter={[32, 32]}>
                            <Col xs={24} lg={12}>
                                <Card className="h-full shadow-lg">
                                    <div className="text-center">
                                        <div className="text-6xl text-primary-600 mb-4">
                                            <CrownOutlined />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Sứ Mệnh</h3>
                                        <p className="text-lg text-gray-600 leading-relaxed">
                                            Mang đến những trải nghiệm nghỉ dưỡng tuyệt vời và đáng nhớ cho mọi khách
                                            hàng, đồng thời góp phần thúc đẩy sự phát triển bền vững của ngành du lịch
                                            Việt Nam và khu vực Đông Nam Á.
                                        </p>
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card className="h-full shadow-lg">
                                    <div className="text-center">
                                        <div className="text-6xl text-primary-600 mb-4">
                                            <GlobalOutlined />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Tầm Nhìn</h3>
                                        <p className="text-lg text-gray-600 leading-relaxed">
                                            Trở thành chuỗi khách sạn hàng đầu khu vực Đông Nam Á, được công nhận về
                                            chất lượng dịch vụ xuất sắc, tính bền vững và sự đổi mới trong ngành khách
                                            sạn quốc tế.
                                        </p>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* Core Values */}
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Giá Trị Cốt Lõi</h2>
                        <p className="text-xl text-gray-600">Những nguyên tắc định hướng mọi hoạt động của chúng tôi</p>
                    </div>

                    <Row gutter={[24, 24]}>
                        {values.map((value, index) => (
                            <Col xs={24} sm={12} lg={6} key={index}>
                                <Card className="h-full text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="mb-4">{value.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Company Timeline removed */}

                {/* Leadership Team */}
                <div className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">Ban Lãnh Đạo</h2>
                            <p className="text-xl text-gray-600">Đội ngũ lãnh đạo giàu kinh nghiệm và tài năng</p>
                        </div>

                        <Row gutter={[24, 24]}>
                            {leadershipTeam.map((member, index) => (
                                <Col xs={24} sm={12} lg={6} key={index}>
                                    <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <div className="text-center">
                                            <Avatar size={120} src={member.image} className="mb-4" />
                                            <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                                            <p className="text-primary-600 font-semibold mb-2">{member.position}</p>
                                            <Tag color="blue" className="mb-3">
                                                {member.experience}
                                            </Tag>
                                            <p className="text-gray-600 text-sm">{member.description}</p>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>

                {/* Awards & Achievements */}
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Giải Thưởng & Thành Tựu</h2>
                        <p className="text-xl text-gray-600">Những công nhận và giải thưởng uy tín</p>
                    </div>

                    <Row gutter={[24, 24]}>
                        {awards.map((award, index) => (
                            <Col xs={24} sm={12} lg={6} key={index}>
                                <Card className="h-full text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="text-4xl mb-4">{award.icon}</div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{award.title}</h3>
                                    <p className="text-primary-600 font-semibold mb-1">{award.organization}</p>
                                    <Tag color="gold">{award.year}</Tag>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-blue-500 via-sky-600 to-blue-600 py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Trải Nghiệm Dịch Vụ Đẳng Cấp</h2>
                        <p className="text-xl text-white mb-8">
                            Hãy để chúng tôi mang đến cho bạn những trải nghiệm tuyệt vời nhất
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => navigate('/search-room')}
                                className="bg-white text-primary-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                            >
                                Khám Phá Khách Sạn
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-primary-600 transition-colors"
                            >
                                Liên Hệ Với Chúng Tôi
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default About;
