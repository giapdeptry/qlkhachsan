import { useState, useEffect } from 'react';
import { requestGetDashboard, requestGetChartData } from '../../../config/DashboardRequest';
import {
    Card,
    Row,
    Col,
    Statistic,
    Select,
    Progress,
    List,
    Avatar,
    Badge,
    Timeline,
    Tag,
    Space,
    Typography,
    Divider,
    Button,
} from 'antd';
import {
    DollarOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    HomeOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    StarOutlined,
    MessageOutlined,
    CheckCircleOutlined,
    ArrowUpOutlined,
    ReloadOutlined,
    BarChartOutlined,
    LineChartOutlined,
} from '@ant-design/icons';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Area,
    AreaChart,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const { Title, Text } = Typography;
const { Option } = Select;

function Dashboard() {
    const [timeFilter, setTimeFilter] = useState('month');
    const [loading, setLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        revenue: { current: 0, previous: 0, growth: 0 },
        bookings: { current: 0, previous: 0, growth: 0 },
        customers: { current: 0, previous: 0, growth: 0 },
        occupancy: { current: 0, previous: 0, growth: 0 },
        rooms: { total: 0, available: 0, occupied: 0 },
        averageRating: 0,
        totalReviews: 0,
    });
    const [chartData, setChartData] = useState({
        revenueData: [],
        occupancyData: [],
        roomTypeData: [],
    });
    const [recentActivities, setRecentActivities] = useState([]);

    // Chart data - sẽ thay thế bằng API thực tế
    const revenueData = [
        { month: 'T1', revenue: 85000000, bookings: 120 },
        { month: 'T2', revenue: 92000000, bookings: 135 },
        { month: 'T3', revenue: 98000000, bookings: 142 },
        { month: 'T4', revenue: 105000000, bookings: 158 },
        { month: 'T5', revenue: 112000000, bookings: 165 },
        { month: 'T6', revenue: 125000000, bookings: 180 },
        { month: 'T7', revenue: 118000000, bookings: 172 },
        { month: 'T8', revenue: 132000000, bookings: 185 },
        { month: 'T9', revenue: 125000000, bookings: 178 },
        { month: 'T10', revenue: 138000000, bookings: 195 },
        { month: 'T11', revenue: 142000000, bookings: 205 },
        { month: 'T12', revenue: 125000000, bookings: 180 },
    ];

    const weeklyData = [
        { day: 'T2', revenue: 18000000, occupancy: 85 },
        { day: 'T3', revenue: 22000000, occupancy: 92 },
        { day: 'T4', revenue: 25000000, occupancy: 88 },
        { day: 'T5', revenue: 28000000, occupancy: 95 },
        { day: 'T6', revenue: 32000000, occupancy: 98 },
        { day: 'T7', revenue: 35000000, occupancy: 96 },
        { day: 'CN', revenue: 19000000, occupancy: 82 },
    ];

    const roomTypeData = [
        { name: 'Deluxe Suite', value: 35, color: '#8884d8' },
        { name: 'Executive Room', value: 28, color: '#82ca9d' },
        { name: 'Standard Room', value: 42, color: '#ffc658' },
        { name: 'Presidential Suite', value: 15, color: '#ff7300' },
    ];

    const occupancyTrendData = [
        { month: 'T1', occupancy: 78 },
        { month: 'T2', occupancy: 82 },
        { month: 'T3', occupancy: 85 },
        { month: 'T4', occupancy: 88 },
        { month: 'T5', occupancy: 90 },
        { month: 'T6', occupancy: 87 },
        { month: 'T7', occupancy: 85 },
        { month: 'T8', occupancy: 92 },
        { month: 'T9', occupancy: 89 },
        { month: 'T10', occupancy: 93 },
        { month: 'T11', occupancy: 95 },
        { month: 'T12', occupancy: 87 },
    ];

    const recentBookings = [
        {
            id: '1',
            customer: 'Nguyễn Văn A',
            room: 'Deluxe Suite 301',
            checkIn: '2024-01-15',
            amount: 2500000,
            status: 'confirmed',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        },
        {
            id: '2',
            customer: 'Trần Thị B',
            room: 'Executive Room 205',
            checkIn: '2024-01-14',
            amount: 1800000,
            status: 'pending',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        },
        {
            id: '3',
            customer: 'Lê Minh C',
            room: 'Presidential Suite 401',
            checkIn: '2024-01-13',
            amount: 4500000,
            status: 'completed',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        },
        {
            id: '4',
            customer: 'Phạm Thị D',
            room: 'Standard Room 102',
            checkIn: '2024-01-12',
            amount: 1200000,
            status: 'cancelled',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        },
    ];

    // Mock data for activities (sẽ được thay thế bằng API)
    const mockActivities = [
        {
            type: 'booking',
            message: 'Đơn đặt phòng mới từ Nguyễn Văn A',
            time: '5 phút trước',
            icon: <ShoppingCartOutlined className="text-green-500" />,
        },
        {
            type: 'review',
            message: 'Đánh giá 5 sao từ khách hàng Trần Thị B',
            time: '15 phút trước',
            icon: <StarOutlined className="text-yellow-500" />,
        },
        {
            type: 'contact',
            message: 'Tin nhắn liên hệ mới từ Lê Minh C',
            time: '30 phút trước',
            icon: <MessageOutlined className="text-blue-500" />,
        },
        {
            type: 'payment',
            message: 'Thanh toán thành công cho đơn hàng #12345',
            time: '1 giờ trước',
            icon: <CheckCircleOutlined className="text-green-500" />,
        },
        {
            type: 'maintenance',
            message: 'Bảo trì phòng 301 hoàn thành',
            time: '2 giờ trước',
            icon: <HomeOutlined className="text-orange-500" />,
        },
    ];

    const getStatusColor = (status) => {
        const colors = {
            confirmed: 'green',
            pending: 'orange',
            completed: 'blue',
            cancelled: 'red',
        };
        return colors[status] || 'default';
    };

    const getStatusText = (status) => {
        const texts = {
            confirmed: 'Đã xác nhận',
            pending: 'Chờ xác nhận',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy',
        };
        return texts[status] || status;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium">{`${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.name === 'revenue' ? formatCurrency(entry.value) : entry.value}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const handleTimeFilterChange = (value) => {
        setTimeFilter(value);
        fetchDashboardData(value);
    };

    const fetchDashboardData = async (filter = timeFilter) => {
        setLoading(true);
        try {
            // Lấy dữ liệu dashboard chính
            const dashboardResponse = await requestGetDashboard(filter);
            setDashboardData(dashboardResponse.metadata);
            setRecentActivities(dashboardResponse.metadata.recentActivities || []);

            // Lấy dữ liệu biểu đồ
            const [revenueChart, occupancyChart, roomTypeChart] = await Promise.all([
                requestGetChartData('revenue', filter),
                requestGetChartData('occupancy', filter),
                requestGetChartData('roomType', filter),
            ]);

            setChartData({
                revenueData: revenueChart.metadata,
                occupancyData: occupancyChart.metadata,
                roomTypeData: roomTypeChart.metadata,
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Fallback to mock data nếu API lỗi
            setDashboardData({
                revenue: { current: 125000000, previous: 98000000, growth: 27.6 },
                bookings: { current: 342, previous: 298, growth: 14.8 },
                customers: { current: 1247, previous: 1089, growth: 14.5 },
                occupancy: { current: 87.5, previous: 82.3, growth: 5.2 },
                rooms: { total: 150, available: 45, occupied: 105 },
                averageRating: 4.8,
                totalReviews: 1247,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <Title level={2} className="mb-2">
                            📊 Dashboard Quản Lý
                        </Title>
                        <Text type="secondary">Tổng quan hoạt động khách sạn và thống kê chi tiết</Text>
                    </div>
                    <Space>
                        <Button icon={<ReloadOutlined />} onClick={() => fetchDashboardData()} loading={loading}>
                            Làm mới
                        </Button>
                        <Select value={timeFilter} onChange={handleTimeFilterChange} style={{ width: 120 }}>
                            <Option value="day">Hôm nay</Option>
                            <Option value="week">Tuần này</Option>
                            <Option value="month">Tháng này</Option>
                            <Option value="year">Năm nay</Option>
                        </Select>
                    </Space>
                </div>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[24, 24]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <Statistic
                            title="Doanh Thu"
                            value={dashboardData.revenue.current}
                            formatter={(value) => formatCurrency(value)}
                            prefix={<DollarOutlined className="text-green-500" />}
                            suffix={
                                <div className="flex items-center">
                                    <ArrowUpOutlined className="text-green-500 mr-1" />
                                    <span className="text-green-500 text-sm">+{dashboardData.revenue.growth}%</span>
                                </div>
                            }
                            valueStyle={{ color: '#52c41a', fontSize: '1.5rem' }}
                        />
                        <div className="mt-2">
                            <Text type="secondary" className="text-xs">
                                So với {timeFilter === 'month' ? 'tháng trước' : 'kỳ trước'}
                            </Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <Statistic
                            title="Đặt Phòng"
                            value={dashboardData.bookings.current}
                            prefix={<ShoppingCartOutlined className="text-blue-500" />}
                            suffix={
                                <div className="flex items-center">
                                    <ArrowUpOutlined className="text-green-500 mr-1" />
                                    <span className="text-green-500 text-sm">+{dashboardData.bookings.growth}%</span>
                                </div>
                            }
                            valueStyle={{ color: '#1890ff', fontSize: '1.5rem' }}
                        />
                        <div className="mt-2">
                            <Text type="secondary" className="text-xs">
                                Đơn đặt phòng mới
                            </Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <Statistic
                            title="Khách Hàng"
                            value={dashboardData.customers.current}
                            prefix={<UserOutlined className="text-purple-500" />}
                            suffix={
                                <div className="flex items-center">
                                    <ArrowUpOutlined className="text-green-500 mr-1" />
                                    <span className="text-green-500 text-sm">+{dashboardData.customers.growth}%</span>
                                </div>
                            }
                            valueStyle={{ color: '#722ed1', fontSize: '1.5rem' }}
                        />
                        <div className="mt-2">
                            <Text type="secondary" className="text-xs">
                                Khách hàng mới
                            </Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <Statistic
                            title="Tỷ Lệ Lấp Đầy"
                            value={dashboardData.occupancy.current}
                            suffix="%"
                            prefix={<HomeOutlined className="text-orange-500" />}
                            valueStyle={{ color: '#fa8c16', fontSize: '1.5rem' }}
                        />
                        <div className="mt-2">
                            <div className="flex items-center">
                                <ArrowUpOutlined className="text-green-500 mr-1" />
                                <span className="text-green-500 text-sm">+{dashboardData.occupancy.growth}%</span>
                            </div>
                            <Progress
                                percent={dashboardData.occupancy.current}
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                                size="small"
                                showInfo={false}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Revenue Chart */}
            <Row gutter={[24, 24]} className="mb-6">
                <Col xs={24}>
                    <Card
                        title={
                            <div className="flex items-center">
                                <BarChartOutlined className="mr-2 text-blue-500" />
                                📊 Biểu Đồ Doanh Thu & Đặt Phòng
                            </div>
                        }
                        className="shadow-lg"
                    >
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData.revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="period" stroke="#666" fontSize={12} />
                                <YAxis yAxisId="left" stroke="#666" fontSize={12} />
                                <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    yAxisId="left"
                                    dataKey="revenue"
                                    fill="#1890ff"
                                    name="Doanh thu"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    yAxisId="right"
                                    dataKey="bookings"
                                    fill="#52c41a"
                                    name="Đặt phòng"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Charts and Additional Stats */}
            <Row gutter={[24, 24]} className="mb-6">
                <Col xs={24} lg={8}>
                    <Card title="📈 Thống Kê Phòng" className="shadow-lg">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">{dashboardData.rooms.total}</div>
                                    <div className="text-gray-600">Tổng phòng</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">
                                        {dashboardData.rooms.occupied}
                                    </div>
                                    <div className="text-gray-600">Đang sử dụng</div>
                                </div>
                            </Col>
                        </Row>
                        <Divider />
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span>Phòng trống</span>
                                <Badge count={dashboardData.rooms.available} color="green" />
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Phòng đang sử dụng</span>
                                <Badge count={dashboardData.rooms.occupied} color="blue" />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="📊 Tỷ Lệ Lấp Đầy Theo Thời Gian" className="shadow-lg">
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart
                                data={chartData.occupancyData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#fa8c16" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#fa8c16" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#666" fontSize={10} />
                                <YAxis stroke="#666" fontSize={10} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white p-2 border border-gray-200 rounded shadow">
                                                    <p className="font-medium">{`${label}`}</p>
                                                    <p style={{ color: '#fa8c16' }}>
                                                        {`Tỷ lệ lấp đầy: ${payload[0].value}%`}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="occupancy"
                                    stroke="#fa8c16"
                                    fillOpacity={1}
                                    fill="url(#colorOccupancy)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="🏨 Phân Bổ Loại Phòng" className="shadow-lg">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={chartData.roomTypeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartData.roomTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Rating and Trend Charts */}
            <Row gutter={[24, 24]} className="mb-6">
                <Col xs={24} lg={12}>
                    <Card title="⭐ Đánh Giá Khách Hàng" className="shadow-lg">
                        <div className="text-center mb-4">
                            <div className="flex items-center justify-center mb-2">
                                <StarOutlined className="text-yellow-500 text-2xl mr-2" />
                                <span className="text-3xl font-bold text-yellow-500">
                                    {dashboardData.averageRating}
                                </span>
                                <span className="text-gray-500 ml-1">/5</span>
                            </div>
                            <Text type="secondary">Từ {dashboardData.totalReviews.toLocaleString()} đánh giá</Text>
                        </div>
                        <Divider />
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center">
                                    <span className="w-4 text-center">{rating}</span>
                                    <StarOutlined className="text-yellow-500 mx-2" />
                                    <Progress
                                        percent={Math.random() * 100}
                                        strokeColor="#faad14"
                                        size="small"
                                        showInfo={false}
                                        className="flex-1"
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="📈 Xu Hướng Doanh Thu" className="shadow-lg">
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData.revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="period" stroke="#666" fontSize={12} />
                                <YAxis stroke="#666" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#1890ff"
                                    strokeWidth={3}
                                    dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Dashboard;
