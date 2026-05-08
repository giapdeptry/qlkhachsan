import { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Modal,
    Form,
    DatePicker,
    InputNumber,
    message,
    Popconfirm,
    Empty,
    Tag,
    Divider,
    Row,
    Col,
    Typography,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    UserOutlined,
    ShoppingCartOutlined,
    CreditCardOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { requestGetCart, requestUpdateCartRoom, requestDeleteCartRoom, requestUpdateCart } from '../config/CartRequest';

const { Title, Text } = Typography;

function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await requestGetCart();
            setCart(res.metadata);
        } catch (error) {
            message.error('Lỗi khi tải giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);

    const formatDate = (dateString) => {
        return dayjs(dateString).format('DD/MM/YYYY');
    };

    const handleEditRoom = (room, index) => {
        setEditingRoom(room);
        setEditingIndex(index);
        form.setFieldsValue({
            checkInDate: dayjs(room.checkInDate),
            checkOutDate: dayjs(room.checkOutDate),
            numberOfAdults: room.numberOfAdults,
            numberOfChildren: room.numberOfChildren,
        });
        setEditModalVisible(true);
        fetchCart();
    };

    const handleUpdateRoom = async (values) => {
        try {
            const data = {
                checkInDate: values.checkInDate.format('YYYY-MM-DD'),
                checkOutDate: values.checkOutDate.format('YYYY-MM-DD'),
                numberOfAdults: values.numberOfAdults,
                numberOfChildren: values.numberOfChildren,
            };
            await requestUpdateCart(editingRoom._id, data);
            await fetchCart();
            message.success('Cập nhật phòng thành công!');
            setEditModalVisible(false);
            fetchCart();
        } catch (error) {
            message.error('Lỗi khi cập nhật phòng');
        }
    };

    const handleDeleteRoom = async (room) => {
        try {
            await requestDeleteCartRoom(room._id);
            message.success('Xóa phòng thành công!');
            fetchCart();
        } catch (error) {
            message.error('Lỗi khi xóa phòng');
        }
    };

    const calculateNights = (checkIn, checkOut) => {
        return dayjs(checkOut).diff(dayjs(checkIn), 'day');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!cart || !cart?.cart?.rooms || cart.cart.rooms.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="w-[90%] mx-auto px-4 py-8">
                    <Card className="text-center">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Giỏ hàng của bạn đang trống">
                            <Button
                                type="primary"
                                onClick={() => navigate('/search-room')}
                                icon={<ShoppingCartOutlined />}
                            >
                                Tìm phòng ngay
                            </Button>
                        </Empty>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="w-[90%] mx-auto px-4 py-8">
                <div className="mb-6">
                    <Title level={2}>
                        <ShoppingCartOutlined className="mr-2" />
                        Giỏ hàng của bạn
                    </Title>
                    <Text type="secondary">Bạn có {cart.cart.rooms.length} phòng trong giỏ hàng</Text>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <div className="space-y-4">
                            {cart.cart.rooms.map((room, index) => {
                                const nights = calculateNights(room.checkInDate, room.checkOutDate);

                                return (
                                    <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="md:w-48 flex-shrink-0">
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}/uploads/room/${
                                                        room.room.images[0]
                                                    }`}
                                                    alt={room.room.roomName}
                                                    className="w-full h-48 md:h-32 object-cover rounded-lg"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <Title level={4} className="mb-1">
                                                            {room.room.roomName}
                                                        </Title>
                                                        <Text type="secondary">
                                                            Phòng {room.room.roomNumber} • Tầng {room.room.floor} •{' '}
                                                            {room.room.roomType}
                                                        </Text>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            type="text"
                                                            icon={<EditOutlined />}
                                                            onClick={() => handleEditRoom(room, index)}
                                                            className="text-primary-600 hover:text-primary-800"
                                                        />
                                                        <Popconfirm
                                                            title="Xóa phòng khỏi giỏ hàng?"
                                                            description="Bạn có chắc chắn muốn xóa phòng này?"
                                                            onConfirm={() => handleDeleteRoom(room)}
                                                            okText="Xóa"
                                                            cancelText="Hủy"
                                                        >
                                                            <Button
                                                                type="text"
                                                                icon={<DeleteOutlined />}
                                                                className="text-red-600 hover:text-red-800"
                                                            />
                                                        </Popconfirm>
                                                    </div>
                                                </div>

                                                <Row gutter={[16, 8]} className="mb-3">
                                                    <Col xs={12} sm={6}>
                                                        <div>
                                                            <CalendarOutlined className="text-primary-600 mr-1" />
                                                            <Text type="secondary" className="text-xs">
                                                                Nhận phòng
                                                            </Text>
                                                            <div className="font-medium text-sm">
                                                                {formatDate(room.checkInDate)}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={6}>
                                                        <div>
                                                            <CalendarOutlined className="text-primary-600 mr-1" />
                                                            <Text type="secondary" className="text-xs">
                                                                Trả phòng
                                                            </Text>
                                                            <div className="font-medium text-sm">
                                                                {formatDate(room.checkOutDate)}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={6}>
                                                        <div>
                                                            <UserOutlined className="text-green-600 mr-1" />
                                                            <Text type="secondary" className="text-xs">
                                                                Khách
                                                            </Text>
                                                            <div className="font-medium text-sm">
                                                                {room.numberOfAdults}NL + {room.numberOfChildren}TE
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} sm={6}>
                                                        <div>
                                                            <Text type="secondary" className="text-xs">
                                                                Số đêm
                                                            </Text>
                                                            <div className="font-medium text-sm">{nights} đêm</div>
                                                        </div>
                                                    </Col>
                                                </Row>

                                                <div className="mb-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {room.room.amenities.slice(0, 4).map((amenity, idx) => (
                                                            <Tag key={idx} color="blue" className="text-xs">
                                                                {amenity}
                                                            </Tag>
                                                        ))}
                                                        {room.room.amenities.length > 4 && (
                                                            <Tag className="text-xs">
                                                                +{room.room.amenities.length - 4} khác
                                                            </Tag>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <Text type="secondary" className="text-sm">
                                                            {formatPrice(room.room.pricePerNight)}/đêm × {nights} đêm
                                                        </Text>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xl font-bold text-red-600">
                                                            {formatPrice(room.price)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card className="shadow-md sticky ">
                            <Title level={4} className="mb-4">
                                <CreditCardOutlined className="mr-2" />
                                Tóm tắt đơn hàng
                            </Title>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between">
                                    <Text>Số phòng:</Text>
                                    <Text strong>{cart.cart.rooms.length} phòng</Text>
                                </div>
                                <div className="flex justify-between">
                                    <Text>Tổng số đêm:</Text>
                                    <Text strong>
                                        {cart.cart.rooms.reduce(
                                            (total, room) =>
                                                total + calculateNights(room.checkInDate, room.checkOutDate),
                                            0,
                                        )}{' '}
                                        đêm
                                    </Text>
                                </div>
                                <Divider className="my-3" />
                                <div className="flex justify-between items-center">
                                    <Text strong className="text-lg">
                                        Tổng cộng:
                                    </Text>
                                    <Text strong className="text-xl text-primary-600">
                                        {formatPrice(cart.cart.totalPrice)}
                                    </Text>
                                </div>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={() => navigate('/payment')}
                                className="h-12 text-lg font-medium"
                            >
                                Tiến hành thanh toán
                            </Button>

                            <div className="mt-4 text-center text-xs text-gray-500">
                                <div>✅ Miễn phí hủy trong 24h</div>
                                <div>🔒 Thanh toán an toàn</div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Edit Modal */}
            <Modal
                title="Chỉnh sửa thông tin phòng"
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                width={600}
            >
                {editingRoom && (
                    <div>
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <Title level={5} className="mb-2">
                                {editingRoom.room.roomName}
                            </Title>
                            <Text type="secondary">
                                Phòng {editingRoom.room.roomNumber} • Tầng {editingRoom.room.floor}
                            </Text>
                        </div>

                        <Form form={form} layout="vertical" onFinish={handleUpdateRoom}>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Ngày nhận phòng"
                                        name="checkInDate"
                                        rules={[{ required: true, message: 'Chọn ngày nhận phòng' }]}
                                    >
                                        <DatePicker
                                            className="w-full"
                                            format="DD/MM/YYYY"
                                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Ngày trả phòng"
                                        name="checkOutDate"
                                        rules={[{ required: true, message: 'Chọn ngày trả phòng' }]}
                                    >
                                        <DatePicker
                                            className="w-full"
                                            format="DD/MM/YYYY"
                                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Số người lớn"
                                        name="numberOfAdults"
                                        rules={[{ required: true, message: 'Nhập số người lớn' }]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            min={1}
                                            max={editingRoom.room.maxAdults}
                                            className="w-full"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Số trẻ em" name="numberOfChildren">
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            min={0}
                                            max={editingRoom.room.maxChildren}
                                            className="w-full"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div className="flex justify-end space-x-2 mt-6">
                                <Button onClick={() => setEditModalVisible(false)}>Hủy</Button>
                                <Button type="primary" htmlType="submit">
                                    Cập nhật
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}
            </Modal>

            <Footer />
        </div>
    );
}

export default Cart;
