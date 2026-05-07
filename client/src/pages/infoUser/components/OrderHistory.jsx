import { useState, useEffect } from 'react';
import {
    Table,
    Tag,
    Button,
    Modal,
    Descriptions,
    Spin,
    Empty,
    Card,
    Tabs,
    Steps,
    message,
    Row,
    Col,
    Image,
    Typography,
    Rate,
    Form,
    Input,
    Select,
    Space,
} from 'antd';
import {
    ShoppingOutlined,
    EyeOutlined,
    FileDoneOutlined,
    FieldTimeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    CalendarOutlined,
    CreditCardOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    StarOutlined,
    SortAscendingOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { requestGetPaymentsUser, requestCancelPaymentUser } from '../../../config/PaymentRequest';
import { requestCreatePreview } from '../../../config/PreviewRequest';

const { Text } = Typography;

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewOrder, setViewOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [selectedRoomForReview, setSelectedRoomForReview] = useState(null);
    const [reviewForm] = Form.useForm();
    const [sortBy, setSortBy] = useState('createdAt_desc'); // Default sort by date descending
    
    const fetchOrders = async () => {
        const res = await requestGetPaymentsUser();
        setOrders(res.metadata);
        setLoading(false);
    };
    // Simulated data fetching
    useEffect(() => {
        fetchOrders();
    }, []);

    const handleViewOrder = (order) => {
        setViewOrder(order);
        setModalVisible(true);
    };

    const getStatusTag = (status) => {
        let color, text, icon;

        switch (status) {
            case 'pending':
                color = 'orange';
                text = 'Chờ xác nhận';
                icon = <FieldTimeOutlined />;
                break;
            case 'confirmed':
                color = 'blue';
                text = 'Đã xác nhận';
                icon = <FileDoneOutlined />;
                break;
            case 'completed':
                color = 'green';
                text = 'Hoàn thành';
                icon = <CheckCircleOutlined />;
                break;
            case 'cancelled':
                color = 'red';
                text = 'Đã hủy';
                icon = <CloseCircleOutlined />;
                break;
            default:
                color = 'default';
                text = 'Không xác định';
                icon = <FieldTimeOutlined />;
        }

        return (
            <Tag color={color} icon={icon}>
                {text}
            </Tag>
        );
    };

    const getPaymentMethodText = (type) => {
        switch (type) {
            case 'cash':
                return 'Thanh toán tại khách sạn';
            case 'momo':
                return 'Ví MoMo';
            case 'vnpay':
                return 'VNPay';
            default:
                return 'Không xác định';
        }
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getOrderStatusStep = (status) => {
        switch (status) {
            case 'pending':
                return 0;
            case 'confirmed':
                return 1;
            case 'completed':
                return 2;
            case 'cancelled':
                return 3;
            default:
                return 0;
        }
    };

    const handleCancelOrder = async (id) => {
        try {
            // TODO: Implement cancel order API call
            await requestCancelPaymentUser(id);
            message.success('Đã hủy đặt phòng');
            fetchOrders();
        } catch (error) {
            message.error('Đã có lỗi xảy ra');
        }
    };

    const handleOpenReviewModal = (order) => {
        setViewOrder(order);
        setReviewModalVisible(true);
    };

    const handleRoomSelection = (roomBooking) => {
        setSelectedRoomForReview(roomBooking);
        reviewForm.resetFields();
    };

    const handleReviewSubmit = async (values) => {
        try {
            // TODO: Implement review submission API call
            const data = {
                roomId: selectedRoomForReview.room._id,
                rating: values.rating,
                content: values.content,
            };
            await requestCreatePreview(data);

            message.success('Đánh giá của bạn đã được gửi thành công!');
            setReviewModalVisible(false);
            setSelectedRoomForReview(null);
            reviewForm.resetFields();
        } catch (error) {
            message.error('Có lỗi xảy ra khi gửi đánh giá');
        }
    };

    const getSortedOrders = (ordersToSort) => {
        if (!ordersToSort || ordersToSort.length === 0) return [];
        
        const sorted = [...ordersToSort];
        
        switch (sortBy) {
            case 'createdAt_asc':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'createdAt_desc':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'totalPrice_asc':
                return sorted.sort((a, b) => a.totalPrice - b.totalPrice);
            case 'totalPrice_desc':
                return sorted.sort((a, b) => b.totalPrice - a.totalPrice);
            case 'status':
                const statusOrder = { pending: 1, confirmed: 2, completed: 3, cancelled: 4 };
                return sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
            default:
                return sorted;
        }
    };

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: '_id',
            key: '_id',
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => (
                <div className="flex items-center">
                    <FieldTimeOutlined className="mr-1 text-gray-400" />
                    <span>{moment(text).format('DD/MM/YYYY')}</span>
                </div>
            ),
        },
        {
            title: 'Phòng',
            dataIndex: 'rooms',
            key: 'rooms',
            render: (rooms) => {
                const firstRoom = rooms?.[0];
                return (
                    <div>
                        <div className="text-sm font-medium">{firstRoom?.room?.roomName || 'N/A'}</div>
                        <div className="text-xs text-gray-500">Phòng {firstRoom?.room?.roomNumber || 'N/A'}</div>
                        {rooms?.length > 1 && (
                            <div className="text-xs text-blue-500">+{rooms.length - 1} phòng khác</div>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Ngày nhận/trả',
            key: 'dates',
            render: (_, record) => {
                const firstRoom = record.rooms?.[0];
                return (
                    <div>
                        <div className="text-xs">
                            <CalendarOutlined className="mr-1" />
                            {formatDate(firstRoom?.checkInDate)}
                        </div>
                        <div className="text-xs text-gray-500">đến {formatDate(firstRoom?.checkOutDate)}</div>
                    </div>
                );
            },
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => <span className="font-bold text-red-600">{formatPrice(price)}</span>,
        },
        {
            title: 'Thanh toán',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (method) => (
                <Tag icon={<CreditCardOutlined />} color="blue" className="text-xs">
                    {getPaymentMethodText(method)}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <Button type="primary" icon={<EyeOutlined />} size="small" onClick={() => handleViewOrder(record)}>
                        Chi tiết
                    </Button>
                    {record.status === 'pending' && (
                        <Button
                            type="primary"
                            danger
                            icon={<CloseCircleOutlined />}
                            size="small"
                            onClick={() => handleCancelOrder(record._id)}
                        >
                            Huỷ đơn
                        </Button>
                    )}
                    {record.status === 'completed' && (
                        <Button
                            type="primary"
                            icon={<StarOutlined />}
                            size="small"
                            onClick={() => handleOpenReviewModal(record)}
                        >
                            Đánh giá
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const filteredOrders = activeTab === 'all' 
        ? getSortedOrders(orders) 
        : getSortedOrders(orders.filter((order) => order.status === activeTab));

    const tabItems = [
        {
            key: 'all',
            label: 'Tất cả',
        },
        {
            key: 'pending',
            label: (
                <div className="flex items-center">
                    <FieldTimeOutlined className="mr-1" />
                    <span>Chờ xác nhận</span>
                </div>
            ),
        },
        {
            key: 'confirmed',
            label: (
                <div className="flex items-center">
                    <FileDoneOutlined className="mr-1" />
                    <span>Đã xác nhận</span>
                </div>
            ),
        },
        {
            key: 'completed',
            label: (
                <div className="flex items-center">
                    <CheckCircleOutlined className="mr-1" />
                    <span>Hoàn thành</span>
                </div>
            ),
        },
        {
            key: 'cancelled',
            label: (
                <div className="flex items-center">
                    <CloseCircleOutlined className="mr-1" />
                    <span>Đã hủy</span>
                </div>
            ),
        },
    ];

    return (
        <Card className="shadow-md">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingOutlined className="text-xl text-blue-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Đặt phòng của tôi</h2>
                    <p className="text-gray-500 text-sm">Theo dõi đặt phòng và lịch sử khách sạn của bạn</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} className="flex-1" type="card" />
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <SortAscendingOutlined /> Sắp xếp:
                    </span>
                    <Select
                        value={sortBy}
                        onChange={setSortBy}
                        style={{ width: 200 }}
                        options={[
                            { label: 'Mới nhất trước', value: 'createdAt_desc' },
                            { label: 'Cũ nhất trước', value: 'createdAt_asc' },
                            { label: 'Giá tăng dần', value: 'totalPrice_asc' },
                            { label: 'Giá giảm dần', value: 'totalPrice_desc' },
                            { label: 'Theo trạng thái', value: 'status' },
                        ]}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Spin size="large" />
                </div>
            ) : filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={filteredOrders}
                        rowKey="_id"
                        pagination={{
                            pageSize: 5,
                            showTotal: (total) => `Tổng ${total} đặt phòng`,
                            showSizeChanger: true,
                            pageSizeOptions: ['5', '10', '15'],
                        }}
                        className="custom-order-table"
                    />
                </div>
            ) : (
                <Empty
                    description={
                        <div>
                            <p className="text-lg font-medium">Bạn chưa có đặt phòng nào</p>
                            <p className="text-gray-500">Hãy đặt phòng ngay để trải nghiệm dịch vụ của chúng tôi</p>
                        </div>
                    }
                    image={Empty.PRESENTED_IMAGE_DEFAULT}
                    className="py-12"
                >
                    <Link to="/">
                        <Button type="primary" className="mt-4 bg-blue-500">
                            Đặt phòng ngay
                        </Button>
                    </Link>
                </Empty>
            )}

            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <ShoppingOutlined className="text-blue-500" />
                        <span>Chi tiết đặt phòng</span>
                        <Tag
                            className="ml-2"
                            color={
                                viewOrder?.status === 'completed'
                                    ? 'green'
                                    : viewOrder?.status === 'cancelled'
                                    ? 'red'
                                    : viewOrder?.status === 'confirmed'
                                    ? 'blue'
                                    : 'orange'
                            }
                        >
                            {viewOrder?.status === 'completed' && 'Hoàn thành'}
                            {viewOrder?.status === 'cancelled' && 'Đã hủy'}
                            {viewOrder?.status === 'confirmed' && 'Đã xác nhận'}
                            {viewOrder?.status === 'pending' && 'Chờ xác nhận'}
                        </Tag>
                    </div>
                }
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setModalVisible(false)}>
                        Đóng
                    </Button>,
                ]}
                width={800}
                className="order-detail-modal"
            >
                {viewOrder && (
                    <div className="space-y-6">
                        {viewOrder.status !== 'cancelled' && (
                            <Card className="bg-gray-50 border-0 mb-6">
                                <Steps
                                    current={getOrderStatusStep(viewOrder.status)}
                                    status={viewOrder.status === 'cancelled' ? 'error' : 'process'}
                                    items={[
                                        {
                                            title: 'Đặt phòng',
                                            description: 'Đã đặt phòng',
                                        },
                                        {
                                            title: 'Xác nhận',
                                            description: viewOrder.status === 'pending' ? 'Đang chờ' : 'Đã xác nhận',
                                        },
                                        {
                                            title: 'Hoàn thành',
                                            description:
                                                viewOrder.status === 'completed' ? 'Đã hoàn thành' : 'Đang chờ',
                                        },
                                    ]}
                                />
                            </Card>
                        )}

                        <Card title="Thông tin đặt phòng" bordered={false} className="shadow-sm">
                            <Descriptions column={{ xs: 1, sm: 2 }}>
                                <Descriptions.Item label="Mã đặt phòng">
                                    <span className="font-medium">{viewOrder._id}</span>
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày đặt">
                                    {moment(viewOrder.createdAt).format('DD/MM/YYYY')}
                                </Descriptions.Item>
                                <Descriptions.Item label="Trạng thái">
                                    {getStatusTag(viewOrder.status)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Phương thức thanh toán">
                                    <Tag icon={<CreditCardOutlined />} color="blue">
                                        {getPaymentMethodText(viewOrder.paymentMethod)}
                                    </Tag>
                                </Descriptions.Item>
                                {viewOrder.nameCoupon && (
                                    <Descriptions.Item label="Mã giảm giá">
                                        <Tag color="green">{viewOrder.nameCoupon}</Tag>
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        </Card>

                        <Card title="Thông tin khách hàng" bordered={false} className="shadow-sm">
                            <Descriptions column={{ xs: 1, sm: 2 }}>
                                <Descriptions.Item label="Họ tên">{viewOrder.fullName}</Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại">{viewOrder.phone}</Descriptions.Item>
                                <Descriptions.Item label="Email">{viewOrder.email}</Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card
                            title={`Phòng đã đặt (${viewOrder.rooms?.length || 0} phòng)`}
                            bordered={false}
                            className="shadow-sm"
                        >
                            <div className="space-y-4">
                                {viewOrder.rooms?.map((roomBooking, index) => (
                                    <div key={index} className="flex border-b pb-4">
                                        <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            {roomBooking.room?.images?.[0] && (
                                                <Image
                                                    width={80}
                                                    height={80}
                                                    src={`${import.meta.env.VITE_API_URL}/uploads/room/${
                                                        roomBooking.room.images[0]
                                                    }`}
                                                    alt={roomBooking.room.roomName}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 ml-4 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-medium">{roomBooking.room?.roomName}</h4>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    <div>Phòng số: {roomBooking.room?.roomNumber}</div>
                                                    <div>
                                                        Nhận phòng: {formatDate(roomBooking.checkInDate)} - Trả phòng:{' '}
                                                        {formatDate(roomBooking.checkOutDate)}
                                                    </div>
                                                    <div>
                                                        Khách: {roomBooking.numberOfAdults} người lớn
                                                        {roomBooking.numberOfChildren > 0 &&
                                                            `, ${roomBooking.numberOfChildren} trẻ em`}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="font-bold text-red-600">
                                                {formatPrice(roomBooking.price)}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-between pt-4 text-lg">
                                    <span className="font-medium">Tổng cộng:</span>
                                    <span className="font-bold text-red-600">{formatPrice(viewOrder.totalPrice)}</span>
                                </div>
                            </div>
                        </Card>

                        {viewOrder.status === 'cancelled' && (
                            <Card title="Lý do hủy" bordered={false} className="shadow-sm border-red-100">
                                <div className="text-red-500">
                                    <p>Đặt phòng đã bị hủy do người dùng yêu cầu</p>
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </Modal>

            {/* Modal Đánh Giá Phòng */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <StarOutlined className="text-yellow-500" />
                        <span>Đánh giá phòng</span>
                    </div>
                }
                open={reviewModalVisible}
                onCancel={() => {
                    setReviewModalVisible(false);
                    setSelectedRoomForReview(null);
                    reviewForm.resetFields();
                }}
                footer={null}
                width={700}
                className="review-modal"
            >
                {viewOrder && (
                    <div>
                        {!selectedRoomForReview ? (
                            <div className="mb-6">
                                <h3 className="font-medium text-lg mb-4">Chọn phòng để đánh giá:</h3>
                                <div className="space-y-3 max-h-80 overflow-auto p-2">
                                    {viewOrder.rooms?.map((roomBooking, index) => (
                                        <Card
                                            key={index}
                                            hoverable
                                            className="border border-gray-200"
                                            onClick={() => handleRoomSelection(roomBooking)}
                                        >
                                            <div className="flex items-center">
                                                {roomBooking.room?.images?.[0] && (
                                                    <Image
                                                        width={80}
                                                        height={80}
                                                        src={`${import.meta.env.VITE_API_URL}/uploads/room/${
                                                            roomBooking.room.images[0]
                                                        }`}
                                                        alt={roomBooking.room.roomName}
                                                        className="w-20 h-20 object-cover rounded-md"
                                                    />
                                                )}
                                                <div className="ml-4">
                                                    <h4 className="font-medium">{roomBooking.room?.roomName}</h4>
                                                    <div className="text-gray-500">
                                                        Phòng số: {roomBooking.room?.roomNumber}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        {formatDate(roomBooking.checkInDate)} -{' '}
                                                        {formatDate(roomBooking.checkOutDate)}
                                                    </div>
                                                    <div className="text-blue-600 mt-2 text-sm">
                                                        Nhấp để đánh giá phòng này
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-6 pb-6 border-b">
                                    <div className="flex items-center gap-4">
                                        {selectedRoomForReview.room?.images?.[0] && (
                                            <Image
                                                width={100}
                                                height={100}
                                                src={`${import.meta.env.VITE_API_URL}/uploads/room/${
                                                    selectedRoomForReview.room.images[0]
                                                }`}
                                                alt={selectedRoomForReview.room.roomName}
                                                className="w-24 h-24 object-cover rounded-md"
                                            />
                                        )}
                                        <div>
                                            <h3 className="text-lg font-medium mb-1">
                                                {selectedRoomForReview.room?.roomName}
                                            </h3>
                                            <p className="text-gray-500">
                                                Phòng số: {selectedRoomForReview.room?.roomNumber}
                                            </p>
                                            <p className="text-gray-500">Mã đặt phòng: {viewOrder._id}</p>
                                        </div>
                                    </div>
                                    <Button type="link" onClick={() => setSelectedRoomForReview(null)} className="mt-2">
                                        Chọn phòng khác
                                    </Button>
                                </div>

                                <Form
                                    form={reviewForm}
                                    layout="vertical"
                                    onFinish={handleReviewSubmit}
                                    initialValues={{
                                        rating: 5,
                                    }}
                                >
                                    <Form.Item
                                        name="rating"
                                        label={<span className="text-base font-medium">Đánh giá của bạn</span>}
                                        rules={[{ required: true, message: 'Vui lòng đánh giá phòng!' }]}
                                    >
                                        <Rate
                                            className="text-2xl"
                                            character={<StarOutlined />}
                                            allowHalf
                                            style={{ color: '#fadb14' }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="content"
                                        label={<span className="text-base font-medium">Nhận xét của bạn</span>}
                                        rules={[
                                            { required: true, message: 'Vui lòng viết nhận xét về phòng!' },
                                            { min: 10, message: 'Nhận xét phải có ít nhất 10 ký tự!' },
                                        ]}
                                    >
                                        <Input.TextArea
                                            placeholder="Chia sẻ trải nghiệm của bạn với phòng này..."
                                            rows={4}
                                            showCount
                                            maxLength={500}
                                        />
                                    </Form.Item>

                                    <Form.Item className="mt-8">
                                        <Row gutter={12} justify="end">
                                            <Col>
                                                <Button
                                                    onClick={() => {
                                                        setReviewModalVisible(false);
                                                        setSelectedRoomForReview(null);
                                                        reviewForm.resetFields();
                                                    }}
                                                >
                                                    Hủy
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button type="primary" htmlType="submit">
                                                    Gửi đánh giá
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Form>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            <style jsx="true">{`
                .custom-order-table .ant-table-thead > tr > th {
                    background-color: #f5f5f5;
                    font-weight: 600;
                }
            `}</style>
        </Card>
    );
}

export default OrderHistory;
