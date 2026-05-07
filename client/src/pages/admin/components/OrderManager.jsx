import { useState, useEffect, useRef } from 'react';
import { requestGetAllPayment, requestUpdatePaymentStatus } from '../../../config/PaymentRequest';
import {
    Table,
    Card,
    Input,
    Select,
    Tag,
    Button,
    Modal,
    Descriptions,
    Avatar,
    Space,
    Row,
    Col,
    Typography,
    Image,
    Badge,
    Divider,
    message,
    Tooltip,
    Statistic,
} from 'antd';
import {
    EyeOutlined,
    EditOutlined,
    UserOutlined,
    SearchOutlined,
    FilterOutlined,
    CalendarOutlined,
    PhoneOutlined,
    MailOutlined,
    CreditCardOutlined,
    DollarOutlined,
    ShoppingOutlined,
    FilePdfOutlined,
    PrinterOutlined,
    DownloadOutlined,
    SortAscendingOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

function OrderManager() {
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt_desc');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
    const invoiceRef = useRef(null);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const res = await requestGetAllPayment();
            setPayments(res.metadata);
            setFilteredPayments(res.metadata);
        } catch (error) {
            message.error('Lỗi khi tải dữ liệu đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const run = async () => {
            // debug loop
            console.log('[OrderManager] mount/fetchPayments');
            try {
                setLoading(true);
                const res = await requestGetAllPayment();
                if (!isMounted) return;
                setPayments(res.metadata);
                setFilteredPayments(res.metadata);
            } catch (error) {
                if (!isMounted) return;
                message.error('Lỗi khi tải dữ liệu đơn hàng');
                console.error('[OrderManager] fetchPayments error:', error);
            } finally {
                if (!isMounted) return;
                setLoading(false);
            }
        };

        run();

        return () => {
            isMounted = false;
        };
    }, []);


    // Filter payments
    useEffect(() => {
        let filtered = payments.filter((payment) => {
            const matchesSearch =
                payment.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.phone.includes(searchTerm) ||
                payment.rooms?.some((room) => room.room?.roomName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                payment.nameCoupon?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment._id.includes(searchTerm);

            const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        // Apply sorting
        filtered = getSortedPayments(filtered);
        setFilteredPayments(filtered);
    }, [payments, searchTerm, statusFilter, sortBy]);

    const getSortedPayments = (paymentsToSort) => {
        if (!paymentsToSort || paymentsToSort.length === 0) return [];
        
        const sorted = [...paymentsToSort];
        
        switch (sortBy) {
            case 'createdAt_asc':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'createdAt_desc':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'totalPrice_asc':
                return sorted.sort((a, b) => a.totalPrice - b.totalPrice);
            case 'totalPrice_desc':
                return sorted.sort((a, b) => b.totalPrice - a.totalPrice);
            case 'fullName':
                return sorted.sort((a, b) => a.fullName.localeCompare(b.fullName, 'vi'));
            case 'status':
                const statusOrder = { pending: 1, confirmed: 2, completed: 3, cancelled: 4 };
                return sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
            default:
                return sorted;
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

    const getStatusConfig = (status) => {
        const configs = {
            pending: { color: 'warning', text: 'Chờ xác nhận' },
            confirmed: { color: 'success', text: 'Đã xác nhận' },
            cancelled: { color: 'error', text: 'Đã hủy' },
            completed: { color: 'processing', text: 'Hoàn thành' },
        };
        return configs[status] || { color: 'default', text: status };
    };

    const getPaymentMethodText = (method) => {
        const methods = {
            vnpay: 'VNPay',
            cash: 'Thanh toán tại khách sạn',
            momo: 'MoMo',
        };
        return methods[method] || method;
    };

    const handleViewDetail = (payment) => {
        setSelectedPayment(payment);
        setDetailModalVisible(true);
    };

    const handlePrintInvoice = () => {
        const invoiceContent = invoiceRef.current;
        if (invoiceContent) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Hóa đơn - ${selectedPayment?.fullName}</title>
                        <style>
                            body { 
                                font-family: Arial, sans-serif; 
                                margin: 20px; 
                                color: #333;
                            }
                            .invoice-header {
                                text-align: center;
                                margin-bottom: 30px;
                                border-bottom: 2px solid #1890ff;
                                padding-bottom: 20px;
                            }
                            .invoice-title {
                                font-size: 28px;
                                font-weight: bold;
                                color: #1890ff;
                                margin-bottom: 10px;
                            }
                            .invoice-subtitle {
                                font-size: 16px;
                                color: #666;
                            }
                            .invoice-info {
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 30px;
                            }
                            .customer-info, .hotel-info {
                                width: 45%;
                            }
                            .info-section {
                                background: #f8f9fa;
                                padding: 15px;
                                border-radius: 8px;
                                margin-bottom: 15px;
                            }
                            .info-title {
                                font-weight: bold;
                                color: #1890ff;
                                margin-bottom: 10px;
                                font-size: 16px;
                            }
                            .info-row {
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 5px;
                            }
                            .room-details {
                                margin: 20px 0;
                            }
                            .room-item {
                                background: #f8f9fa;
                                padding: 15px;
                                margin-bottom: 10px;
                                border-radius: 8px;
                                border-left: 4px solid #1890ff;
                            }
                            .room-name {
                                font-weight: bold;
                                color: #1890ff;
                                margin-bottom: 10px;
                            }
                            .room-info {
                                display: grid;
                                grid-template-columns: 1fr 1fr;
                                gap: 10px;
                                font-size: 14px;
                            }
                            .total-section {
                                background: #e6f7ff;
                                padding: 20px;
                                border-radius: 8px;
                                margin-top: 20px;
                                text-align: right;
                            }
                            .total-amount {
                                font-size: 24px;
                                font-weight: bold;
                                color: #1890ff;
                            }
                            .invoice-footer {
                                text-align: center;
                                margin-top: 30px;
                                padding-top: 20px;
                                border-top: 1px solid #ddd;
                                color: #666;
                            }
                            @media print {
                                body { margin: 0; }
                                .no-print { display: none; }
                            }
                        </style>
                    </head>
                    <body>
                        ${invoiceContent.innerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
    };

    const handleDownloadInvoice = () => {
        const invoiceContent = invoiceRef.current;
        if (invoiceContent) {
            const htmlContent = `
                <html>
                    <head>
                        <title>Hóa đơn - ${selectedPayment?.fullName}</title>
                        <style>
                            body { 
                                font-family: Arial, sans-serif; 
                                margin: 20px; 
                                color: #333;
                            }
                            .invoice-header {
                                text-align: center;
                                margin-bottom: 30px;
                                border-bottom: 2px solid #1890ff;
                                padding-bottom: 20px;
                            }
                            .invoice-title {
                                font-size: 28px;
                                font-weight: bold;
                                color: #1890ff;
                                margin-bottom: 10px;
                            }
                            .invoice-subtitle {
                                font-size: 16px;
                                color: #666;
                            }
                            .invoice-info {
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 30px;
                            }
                            .customer-info, .hotel-info {
                                width: 45%;
                            }
                            .info-section {
                                background: #f8f9fa;
                                padding: 15px;
                                border-radius: 8px;
                                margin-bottom: 15px;
                            }
                            .info-title {
                                font-weight: bold;
                                color: #1890ff;
                                margin-bottom: 10px;
                                font-size: 16px;
                            }
                            .info-row {
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 5px;
                            }
                            .room-details {
                                margin: 20px 0;
                            }
                            .room-item {
                                background: #f8f9fa;
                                padding: 15px;
                                margin-bottom: 10px;
                                border-radius: 8px;
                                border-left: 4px solid #1890ff;
                            }
                            .room-name {
                                font-weight: bold;
                                color: #1890ff;
                                margin-bottom: 10px;
                            }
                            .room-info {
                                display: grid;
                                grid-template-columns: 1fr 1fr;
                                gap: 10px;
                                font-size: 14px;
                            }
                            .total-section {
                                background: #e6f7ff;
                                padding: 20px;
                                border-radius: 8px;
                                margin-top: 20px;
                                text-align: right;
                            }
                            .total-amount {
                                font-size: 24px;
                                font-weight: bold;
                                color: #1890ff;
                            }
                            .invoice-footer {
                                text-align: center;
                                margin-top: 30px;
                                padding-top: 20px;
                                border-top: 1px solid #ddd;
                                color: #666;
                            }
                        </style>
                    </head>
                    <body>
                        ${invoiceContent.innerHTML}
                    </body>
                </html>
            `;

            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `HoaDon_${selectedPayment?.fullName}_${new Date().toISOString().split('T')[0]}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    const handleShowInvoice = (payment) => {
        setSelectedPayment(payment);
        setInvoiceModalVisible(true);
    };

    // Logic để kiểm tra có thể chuyển đến trạng thái mới không
    const canChangeToStatus = (currentStatus, targetStatus) => {
        // Định nghĩa thứ tự trạng thái (không được quay ngược)
        const statusOrder = {
            pending: 0,
            confirmed: 1,
            completed: 2,
            cancelled: 3,
        };

        // Trường hợp đặc biệt: có thể hủy từ bất kỳ trạng thái nào (trừ completed)
        if (targetStatus === 'cancelled') {
            return currentStatus !== 'completed' && currentStatus !== 'cancelled';
        }

        // Trường hợp đặc biệt: không thể thay đổi từ cancelled hoặc completed
        if (currentStatus === 'cancelled' || currentStatus === 'completed') {
            return false;
        }

        // Chỉ có thể chuyển tiến hoặc giữ nguyên
        return statusOrder[targetStatus] >= statusOrder[currentStatus];
    };

    const handleStatusChange = async (paymentId, newStatus) => {
        try {
            // Update local state (thay bằng API call thực tế sau)
            await requestUpdatePaymentStatus(paymentId, newStatus);
            fetchPayments();
            message.success('Cập nhật trạng thái thành công!');
        } catch (error) {
            message.error('Lỗi khi cập nhật trạng thái');
        }
    };

    // Statistics
    const stats = {
        total: payments.length,
        pending: payments.filter((p) => p.status === 'pending').length,
        confirmed: payments.filter((p) => p.status === 'confirmed').length,
        completed: payments.filter((p) => p.status === 'completed').length,
        cancelled: payments.filter((p) => p.status === 'cancelled').length,
        totalRevenue: payments.reduce((sum, p) => sum + (p.status !== 'cancelled' ? p.totalPrice : 0), 0),
    };

    const columns = [
        {
            title: 'Khách hàng',
            key: 'customer',
            width: 250,
            render: (_, record) => (
                <div className="flex items-center space-x-3">
                    <Avatar size={32} icon={<UserOutlined />} className="bg-blue-500" />
                    <div>
                        <div className="text-sm font-medium text-gray-900">{record.fullName}</div>
                        <div className="text-xs text-gray-500">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Phòng',
            key: 'room',
            width: 200,
            render: (_, record) => {
                const firstRoom = record.rooms?.[0];
                return (
                    <div>
                        <div className="text-sm font-medium">{firstRoom?.room?.roomName || 'N/A'}</div>
                        <div className="text-xs text-gray-500">Phòng {firstRoom?.room?.roomNumber || 'N/A'}</div>
                        {record.rooms?.length > 1 && (
                            <div className="text-xs text-blue-500">+{record.rooms.length - 1} phòng khác</div>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Ngày',
            key: 'dates',
            width: 180,
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
            title: 'Thanh toán',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            width: 150,
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
            width: 120,
            render: (status) => {
                const config = getStatusConfig(status);
                return (
                    <Tag color={config.color} className="text-xs">
                        {config.text}
                    </Tag>
                );
            },
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 120,
            render: (price) => (
                <Text strong className="text-blue-600 text-sm">
                    {formatPrice(price)}
                </Text>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space direction="horizontal" size="small" style={{ width: '100%' }}>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                        block
                    >
                        Xem chi tiết
                    </Button>

                    <Select
                        size="small"
                        value={record.status}
                        onChange={(value) => handleStatusChange(record._id, value)}
                        style={{ width: '100%' }}
                        suffixIcon={<EditOutlined />}
                    >
                        <Option value="pending" disabled={!canChangeToStatus(record.status, 'pending')}>
                            Chờ xác nhận
                        </Option>
                        <Option value="confirmed" disabled={!canChangeToStatus(record.status, 'confirmed')}>
                            Đã xác nhận
                        </Option>
                        <Option value="completed" disabled={!canChangeToStatus(record.status, 'completed')}>
                            Hoàn thành
                        </Option>
                        <Option value="cancelled" disabled={!canChangeToStatus(record.status, 'cancelled')}>
                            Đã hủy
                        </Option>
                    </Select>
                    {record.status === 'completed' && (
                        <Button
                            type="primary"
                            size="small"
                            icon={<FilePdfOutlined />}
                            onClick={() => handleShowInvoice(record)}
                        >
                            Xuất hóa đơn
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className=" mx-auto">
                <Title level={3} className="text-lg">
                    <ShoppingOutlined className="mr-2" />
                    Quản lý đơn hàng
                </Title>

                {/* Statistics Cards */}
                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={24} sm={12} md={8} lg={4}>
                        <Card className="text-center">
                            <Statistic
                                title="Tổng đơn hàng"
                                value={stats.total}
                                prefix={<ShoppingOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4}>
                        <Card className="text-center">
                            <Statistic title="Chờ xác nhận" value={stats.pending} valueStyle={{ color: '#faad14' }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4}>
                        <Card className="text-center">
                            <Statistic title="Đã xác nhận" value={stats.confirmed} valueStyle={{ color: '#52c41a' }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4}>
                        <Card className="text-center">
                            <Statistic title="Hoàn thành" value={stats.completed} valueStyle={{ color: '#1890ff' }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4}>
                        <Card className="text-center">
                            <Statistic title="Đã hủy" value={stats.cancelled} valueStyle={{ color: '#ff4d4f' }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4}>
                        <Card className="text-center">
                            <Statistic
                                title="Doanh thu"
                                value={stats.totalRevenue}
                                formatter={(value) => formatPrice(value)}
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Filters */}
                <Card className="mb-6">
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={12} md={8}>
                            <Input
                                placeholder="Tìm kiếm theo tên, email, SĐT, phòng, mã giảm giá, ID..."
                                prefix={<SearchOutlined />}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                allowClear
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Select
                                placeholder="Lọc theo trạng thái"
                                value={statusFilter}
                                onChange={setStatusFilter}
                                style={{ width: '100%' }}
                                suffixIcon={<FilterOutlined />}
                            >
                                <Option value="all">Tất cả trạng thái</Option>
                                <Option value="pending">Chờ xác nhận</Option>
                                <Option value="confirmed">Đã xác nhận</Option>
                                <Option value="completed">Hoàn thành</Option>
                                <Option value="cancelled">Đã hủy</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Select
                                placeholder="Sắp xếp"
                                value={sortBy}
                                onChange={setSortBy}
                                style={{ width: '100%' }}
                                suffixIcon={<SortAscendingOutlined />}
                            >
                                <Option value="createdAt_desc">Mới nhất trước</Option>
                                <Option value="createdAt_asc">Cũ nhất trước</Option>
                                <Option value="totalPrice_desc">Giá cao nhất</Option>
                                <Option value="totalPrice_asc">Giá thấp nhất</Option>
                                <Option value="fullName">Tên khách hàng (A-Z)</Option>
                                <Option value="status">Theo trạng thái</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={24} md={10}>
                            <Text type="secondary" className="text-sm">
                                Hiển thị {filteredPayments.length} / {payments.length} đơn hàng
                            </Text>
                        </Col>
                    </Row>
                </Card>

                {/* Table */}
                <Card>
                    <Table
                        columns={columns}
                        dataSource={filteredPayments}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            total: filteredPayments.length,
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
                        }}
                        scroll={{ x: 1200 }}
                        className="overflow-hidden"
                    />
                </Card>

                {/* Detail Modal */}
                <Modal
                    title="Chi tiết đơn hàng"
                    open={detailModalVisible}
                    onCancel={() => setDetailModalVisible(false)}
                    footer={null}
                    width={800}
                >
                    {selectedPayment && (
                        <div>
                            <Row gutter={[24, 24]}>
                                <Col xs={24} md={12}>
                                    <Title level={5} className="text-base">
                                        Thông tin khách hàng
                                    </Title>
                                    <Descriptions column={1} bordered size="small">
                                        <Descriptions.Item
                                            label={
                                                <>
                                                    <UserOutlined /> Họ tên
                                                </>
                                            }
                                        >
                                            {selectedPayment.fullName}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label={
                                                <>
                                                    <MailOutlined /> Email
                                                </>
                                            }
                                        >
                                            {selectedPayment.email}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label={
                                                <>
                                                    <PhoneOutlined /> SĐT
                                                </>
                                            }
                                        >
                                            {selectedPayment.phone}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Title level={5} className="text-base">
                                        Thông tin đặt phòng
                                    </Title>
                                    <Descriptions column={1} bordered size="small">
                                        <Descriptions.Item label="Số phòng">
                                            {selectedPayment.rooms?.length || 0} phòng
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Tổng khách">
                                            {selectedPayment.rooms?.reduce(
                                                (total, room) => total + (room.numberOfAdults || 0),
                                                0,
                                            )}{' '}
                                            người lớn
                                            {selectedPayment.rooms?.reduce(
                                                (total, room) => total + (room.numberOfChildren || 0),
                                                0,
                                            ) > 0 &&
                                                `, ${selectedPayment.rooms?.reduce(
                                                    (total, room) => total + (room.numberOfChildren || 0),
                                                    0,
                                                )} trẻ em`}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                            </Row>

                            <Divider />

                            <Title level={5} className="text-base">
                                Thông tin phòng ({selectedPayment.rooms?.length || 0} phòng)
                            </Title>
                            <div className="space-y-3">
                                {selectedPayment.rooms?.map((roomBooking, index) => (
                                    <Card key={index} size="small" className="bg-gray-50">
                                        <Row gutter={16} align="middle">
                                            <Col>
                                                {roomBooking.room?.images?.[0] && (
                                                    <Image
                                                        width={80}
                                                        height={80}
                                                        src={`${import.meta.env.VITE_API_URL}/uploads/room/${
                                                            roomBooking.room.images[0]
                                                        }`}
                                                        alt={roomBooking.room.roomName}
                                                        className="rounded-lg object-cover"
                                                    />
                                                )}
                                            </Col>
                                            <Col flex="1">
                                                <Title level={5} className="mb-1 text-sm">
                                                    {roomBooking.room?.roomName}
                                                </Title>
                                                <Text type="secondary" className="block text-xs">
                                                    Phòng số: {roomBooking.room?.roomNumber}
                                                </Text>
                                                <Text type="secondary" className="block text-xs">
                                                    Giá: {formatPrice(roomBooking.room?.pricePerNight)}/đêm
                                                </Text>
                                                <Text type="secondary" className="block text-xs">
                                                    Nhận phòng: {formatDate(roomBooking.checkInDate)} - Trả phòng:{' '}
                                                    {formatDate(roomBooking.checkOutDate)}
                                                </Text>
                                                <Text type="secondary" className="block text-xs">
                                                    Khách: {roomBooking.numberOfAdults} người lớn
                                                    {roomBooking.numberOfChildren > 0 &&
                                                        `, ${roomBooking.numberOfChildren} trẻ em`}
                                                </Text>
                                                <Text type="secondary" className="block text-xs">
                                                    Thành tiền: {formatPrice(roomBooking.price)}
                                                </Text>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                            </div>

                            <Divider />

                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Space direction="vertical" size="small">
                                        <Text>
                                            <CreditCardOutlined className="mr-2" />
                                            Phương thức: {getPaymentMethodText(selectedPayment.paymentMethod)}
                                        </Text>
                                        {selectedPayment.nameCoupon && (
                                            <Text>
                                                Mã giảm giá: <Tag color="green">{selectedPayment.nameCoupon}</Tag>
                                            </Text>
                                        )}
                                        <Text>
                                            Trạng thái:{' '}
                                            <Tag color={getStatusConfig(selectedPayment.status).color}>
                                                {getStatusConfig(selectedPayment.status).text}
                                            </Tag>
                                        </Text>
                                    </Space>
                                </Col>
                                <Col>
                                    <Title level={4} className="text-blue-600 mb-0 text-lg">
                                        {formatPrice(selectedPayment.totalPrice)}
                                    </Title>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal>

                {/* Invoice Modal */}
                <Modal
                    title="Hóa đơn"
                    open={invoiceModalVisible}
                    onCancel={() => setInvoiceModalVisible(false)}
                    footer={[
                        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrintInvoice}>
                            In hóa đơn
                        </Button>,
                        <Button key="download" icon={<DownloadOutlined />} onClick={handleDownloadInvoice}>
                            Tải xuống
                        </Button>,
                        <Button key="close" onClick={() => setInvoiceModalVisible(false)}>
                            Đóng
                        </Button>,
                    ]}
                    width={800}
                    className="invoice-modal"
                >
                    {selectedPayment && (
                        <div ref={invoiceRef} className="invoice-content">
                            {/* Invoice Header */}
                            <div className="invoice-header">
                                <div className="invoice-title">🏨 KHÁCH SẠN LUXURY</div>
                                <div className="invoice-subtitle">HÓA ĐƠN THANH TOÁN</div>
                                <div className="invoice-subtitle">Mã đơn: {selectedPayment._id}</div>
                            </div>

                            {/* Invoice Info */}
                            <div className="invoice-info">
                                <div className="customer-info">
                                    <div className="info-section">
                                        <div className="info-title">📋 THÔNG TIN KHÁCH HÀNG</div>
                                        <div className="info-row">
                                            <span>Họ tên:</span>
                                            <span>
                                                <strong>{selectedPayment.fullName}</strong>
                                            </span>
                                        </div>
                                        <div className="info-row">
                                            <span>Email:</span>
                                            <span>{selectedPayment.email}</span>
                                        </div>
                                        <div className="info-row">
                                            <span>Số điện thoại:</span>
                                            <span>{selectedPayment.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="hotel-info">
                                    <div className="info-section">
                                        <div className="info-title">🏨 THÔNG TIN KHÁCH SẠN</div>
                                        <div className="info-row">
                                            <span>Tên khách sạn:</span>
                                            <span>
                                                <strong>Luxury Hotel</strong>
                                            </span>
                                        </div>
                                        <div className="info-row">
                                            <span>Địa chỉ:</span>
                                            <span>123 Đường ABC, Quận 1, TP.HCM</span>
                                        </div>
                                        <div className="info-row">
                                            <span>Số điện thoại:</span>
                                            <span>+84 24 1234 5678</span>
                                        </div>
                                        <div className="info-row">
                                            <span>Email:</span>
                                            <span>info@luxuryhotel.com</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="info-section">
                                <div className="info-title">💳 THÔNG TIN THANH TOÁN</div>
                                <div className="info-row">
                                    <span>Phương thức thanh toán:</span>
                                    <span>
                                        <strong>{getPaymentMethodText(selectedPayment.paymentMethod)}</strong>
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span>Trạng thái:</span>
                                    <span>
                                        <Tag color={getStatusConfig(selectedPayment.status).color}>
                                            {getStatusConfig(selectedPayment.status).text}
                                        </Tag>
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span>Ngày thanh toán:</span>
                                    <span>{formatDate(selectedPayment.createdAt)}</span>
                                </div>
                                {selectedPayment.nameCoupon && (
                                    <div className="info-row">
                                        <span>Mã giảm giá:</span>
                                        <span>
                                            <Tag color="green">{selectedPayment.nameCoupon}</Tag>
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Room Details */}
                            <div className="room-details">
                                <div className="info-title">🛏️ CHI TIẾT PHÒNG NGHỈ</div>
                                {selectedPayment.rooms?.map((roomBooking, index) => (
                                    <div key={index} className="room-item">
                                        <div className="room-name">
                                            Phòng {index + 1}: {roomBooking.room?.roomName}
                                        </div>
                                        <div className="room-info">
                                            <div>
                                                <strong>Phòng số:</strong> {roomBooking.room?.roomNumber}
                                            </div>
                                            <div>
                                                <strong>Giá/đêm:</strong> {formatPrice(roomBooking.room?.pricePerNight)}
                                            </div>
                                            <div>
                                                <strong>Nhận phòng:</strong> {formatDate(roomBooking.checkInDate)}
                                            </div>
                                            <div>
                                                <strong>Trả phòng:</strong> {formatDate(roomBooking.checkOutDate)}
                                            </div>
                                            <div>
                                                <strong>Số đêm:</strong>{' '}
                                                {Math.ceil(
                                                    (new Date(roomBooking.checkOutDate) -
                                                        new Date(roomBooking.checkInDate)) /
                                                        (1000 * 60 * 60 * 24),
                                                )}{' '}
                                                đêm
                                            </div>
                                            <div>
                                                <strong>Số khách:</strong> {roomBooking.numberOfAdults} người lớn
                                                {roomBooking.numberOfChildren > 0 &&
                                                    `, ${roomBooking.numberOfChildren} trẻ em`}
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '10px', textAlign: 'right' }}>
                                            <strong>Thành tiền: {formatPrice(roomBooking.price)}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total Section */}
                            <div className="total-section">
                                <div style={{ marginBottom: '10px' }}>
                                    <span style={{ fontSize: '18px' }}>Tổng cộng:</span>
                                    <span className="total-amount">{formatPrice(selectedPayment.totalPrice)}</span>
                                </div>
                                <div style={{ fontSize: '14px', color: '#666' }}>(Đã bao gồm thuế VAT)</div>
                            </div>

                            {/* Invoice Footer */}
                            <div className="invoice-footer">
                                <div style={{ marginBottom: '10px' }}>
                                    <strong>Cảm ơn quý khách đã sử dụng dịch vụ!</strong>
                                </div>
                                <div style={{ fontSize: '14px' }}>
                                    Hóa đơn được tạo tự động vào {new Date().toLocaleString('vi-VN')}
                                </div>
                                <div style={{ fontSize: '12px', marginTop: '10px' }}>
                                    Hotline: +84 24 1234 5678 | Email: info@luxuryhotel.com
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
}

export default OrderManager;
