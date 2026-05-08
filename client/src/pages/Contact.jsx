import { useState } from 'react';
import { Form, Input, Button, Card, Row, Col, message, Select, Divider } from 'antd';
import {
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    SendOutlined,
    FacebookOutlined,
    InstagramOutlined,
    TwitterOutlined,
    YoutubeOutlined,
    LinkedinOutlined,
    GlobalOutlined,
    MessageOutlined,
    UserOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { requestCreateContact } from '../config/ContactRequest';

const { TextArea } = Input;
const { Option } = Select;

function Contact() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Simulate API call
            console.log(values);

            await requestCreateContact(values);
            message.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
            form.resetFields();
        } catch (error) {
            message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: <PhoneOutlined className="text-2xl text-primary-600" />,
            title: 'Điện Thoại',
            details: ['+84 24 7777 8888', '+84 24 8765 4321'],
            description: 'Hỗ trợ 24/7',
        },
        {
            icon: <MailOutlined className="text-2xl text-green-600" />,
            title: 'Email',
            details: ['info@hotel.com', 'booking@hotel.com'],
            description: 'Phản hồi trong 2 giờ',
        },
        {
            icon: <EnvironmentOutlined className="text-2xl text-red-600" />,
            title: 'Địa Chỉ',
            details: ['288 Đường Cộng Hoà, Phường Mỹ Đình 1', 'Quận Nam Từ Liêm, Hà Nội, Việt Nam'],
            description: 'Trung tâm Mỹ Đình',
        },
        {
            icon: <ClockCircleOutlined className="text-2xl text-primary-600" />,
            title: 'Giờ Làm Việc',
            details: ['Thứ 2 - Thứ 6: 8:00 - 18:00', 'Thứ 7 - CN: 9:00 - 17:00'],
            description: 'Lễ tân 24/7',
        },
    ];

    const socialMedia = [
        { icon: <FacebookOutlined />, name: 'Facebook', color: 'text-primary-600', url: '#' },
        { icon: <InstagramOutlined />, name: 'Instagram', color: 'text-accent-600', url: '#' },
        { icon: <TwitterOutlined />, name: 'Twitter', color: 'text-primary-400', url: '#' },
        { icon: <YoutubeOutlined />, name: 'YouTube', color: 'text-red-600', url: '#' },
        { icon: <LinkedinOutlined />, name: 'LinkedIn', color: 'text-primary-700', url: '#' },
    ];

    const departments = [
        {
            name: 'Đặt Phòng',
            phone: '+84 24 1234 5678',
            email: 'booking@hotel.com',
            description: 'Hỗ trợ đặt phòng và dịch vụ',
        },
        {
            name: 'Dịch Vụ Khách Hàng',
            phone: '+84 24 1234 5679',
            email: 'service@hotel.com',
            description: 'Hỗ trợ dịch vụ và phản hồi',
        },
        {
            name: 'Sự Kiện & Hội Nghị',
            phone: '+84 24 1234 5680',
            email: 'events@hotel.com',
            description: 'Tổ chức sự kiện và hội nghị',
        },
        {
            name: 'Tuyển Dụng',
            phone: '+84 24 1234 5681',
            email: 'hr@hotel.com',
            description: 'Thông tin tuyển dụng',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-sky-50">
            <header>
                <Header />
            </header>

            <main>
                {/* Hero Section */}
                <div className="relative h-80 bg-gradient-to-r from-blue-500 via-sky-600 to-blue-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="relative z-10 flex items-center justify-center h-full">
                        <div className="text-center text-white max-w-4xl mx-auto px-4">
                            <h1 className="text-4xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h1>
                            <p className="text-xl mb-8">
                                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc, mọi nơi
                            </p>
                            <div className="flex justify-center space-x-4">
                                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                    <MessageOutlined className="mr-2" />
                                    <span>Hỗ trợ 24/7</span>
                                </div>
                                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                    <GlobalOutlined className="mr-2" />
                                    <span>Đa ngôn ngữ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form & Info */}
                <div className="container mx-auto px-4 py-16">
                    <Row gutter={[32, 32]}>
                        {/* Contact Form */}
                        <Col xs={24} lg={14}>
                            <Card className="shadow-lg">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Gửi Tin Nhắn</h2>
                                    <p className="text-gray-600">
                                        Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn
                                    </p>
                                </div>

                                <Form form={form} layout="vertical" onFinish={onFinish} className="contact-form">
                                    <Row gutter={24}>
                                        <Col xs={24} sm={24}>
                                            <Form.Item
                                                name="fullName"
                                                label="Họ và tên"
                                                rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                                            >
                                                <Input
                                                    prefix={<UserOutlined />}
                                                    placeholder="Nhập họ và tên của bạn"
                                                    size="large"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col xs={24} sm={12}>
                                            <Form.Item
                                                name="email"
                                                label="Email"
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập email!' },
                                                    { type: 'email', message: 'Email không hợp lệ!' },
                                                ]}
                                            >
                                                <Input
                                                    prefix={<MailOutlined />}
                                                    placeholder="your@email.com"
                                                    size="large"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Form.Item
                                                name="phone"
                                                label="Số Điện Thoại"
                                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                            >
                                                <Input
                                                    prefix={<PhoneOutlined />}
                                                    placeholder="+84 xxx xxx xxx"
                                                    size="large"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        name="type"
                                        label="Chủ Đề"
                                        rules={[{ required: true, message: 'Vui lòng chọn chủ đề!' }]}
                                    >
                                        <Select placeholder="Chọn chủ đề bạn quan tâm" size="large">
                                            <Option value="Đặt phòng">Đặt phòng</Option>
                                            <Option value="Dịch vụ">Dịch vụ</Option>
                                            <Option value="Sự kiện">Sự kiện</Option>
                                            <Option value="Khiếu nại">Khiếu nại</Option>
                                            <Option value="Góp ý">Góp ý</Option>
                                            <Option value="Khác">Khác</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="message"
                                        label="Tin Nhắn"
                                        rules={[{ required: true, message: 'Vui lòng nhập tin nhắn!' }]}
                                    >
                                        <TextArea
                                            rows={6}
                                            placeholder="Nhập tin nhắn của bạn..."
                                            showCount
                                            maxLength={500}
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            size="large"
                                            className="w-full bg-gradient-to-r from-primary-600 to-tertiary-600 border-none"
                                            icon={<SendOutlined />}
                                        >
                                            Gửi Tin Nhắn
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>

                        {/* Contact Information */}
                        <Col xs={24} lg={10}>
                            <div className="space-y-6">
                                <Card className="shadow-lg">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Thông Tin Liên Hệ</h3>
                                    <div className="space-y-4">
                                        {contactInfo.map((info, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 mt-1">{info.icon}</div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 mb-1">{info.title}</h4>
                                                    {info.details.map((detail, idx) => (
                                                        <p key={idx} className="text-gray-600 text-sm">
                                                            {detail}
                                                        </p>
                                                    ))}
                                                    <p className="text-xs text-gray-500 mt-1">{info.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Departments */}
                <div className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Các Bộ Phận</h2>
                            <p className="text-xl text-gray-600">Liên hệ trực tiếp với bộ phận phù hợp</p>
                        </div>

                        <Row gutter={[24, 24]}>
                            {departments.map((dept, index) => (
                                <Col xs={24} sm={12} lg={6} key={index}>
                                    <Card className="h-full text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <div className="text-3xl text-primary-600 mb-3">
                                            <HomeOutlined />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">{dept.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3">{dept.description}</p>
                                        <div className="space-y-1">
                                            <p className="text-sm text-primary-600 font-semibold">{dept.phone}</p>
                                            <p className="text-sm text-gray-500">{dept.email}</p>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>

                {/* Map section removed as requested */}

                {/* FAQ Section */}
                <div className="bg-gradient-to-r from-primary-50 to-tertiary-50 py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Câu Hỏi Thường Gặp</h2>
                            <p className="text-xl text-gray-600">Những câu hỏi phổ biến từ khách hàng</p>
                        </div>

                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12}>
                                <Card className="shadow-lg">
                                    <h4 className="font-bold text-gray-800 mb-2">Làm thế nào để đặt phòng?</h4>
                                    <p className="text-gray-600 text-sm">
                                        Bạn có thể đặt phòng qua website, gọi điện thoại hoặc email. Đội ngũ của chúng
                                        tôi sẽ hỗ trợ bạn 24/7.
                                    </p>
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card className="shadow-lg">
                                    <h4 className="font-bold text-gray-800 mb-2">Thời gian check-in/check-out?</h4>
                                    <p className="text-gray-600 text-sm">
                                        Check-in: 14:00, Check-out: 12:00. Chúng tôi có thể linh hoạt theo yêu cầu của
                                        bạn.
                                    </p>
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card className="shadow-lg">
                                    <h4 className="font-bold text-gray-800 mb-2">Có dịch vụ đưa đón sân bay không?</h4>
                                    <p className="text-gray-600 text-sm">
                                        Có, chúng tôi cung cấp dịch vụ đưa đón sân bay với giá ưu đãi. Vui lòng đặt
                                        trước khi đến.
                                    </p>
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card className="shadow-lg">
                                    <h4 className="font-bold text-gray-800 mb-2">Chính sách hủy phòng?</h4>
                                    <p className="text-gray-600 text-sm">
                                        Hủy miễn phí trước 24h. Hủy trong vòng 24h sẽ tính phí 50% giá phòng.
                                    </p>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default Contact;
