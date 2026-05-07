import { useState, useEffect } from 'react';
import { Layout, theme, ConfigProvider, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
// import Header from './components/Header';
import RoomManager from './components/RoomManager';
import CouponManagement from './components/CounponManager';
import UserManagement from './components/UserManagement';
import OrderManager from './components/OrderManager';
import ContactManager from './components/ContactManager';
import BlogAdmin from './components/BlogAdmin';
import DashBroad from './components/DashBroad';
import { requestLogout } from '../../config/UserRequest';
import { toast } from 'react-toastify';
import { useStore } from '../../hooks/useStore';

const { Content } = Layout;
const { useToken } = theme;

function Admin() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { token } = useToken();
    const { setDataUser } = useStore();

    // Default route is dashboard
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = async () => {
        try {
            await requestLogout();
            setDataUser({});
            toast.success('Đăng xuất thành công!');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng xuất thất bại');
        }
    };

    // Add custom styles to the document

    // Render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashBroad />;
            case 'users':
                return <UserManagement />;
            case 'orders':
                return <OrderManager />;
            case 'coupons':
                return <CouponManagement />;
            case 'contacts':
                return <ContactManager />;
            case 'blog':
                return <BlogAdmin />;
            case 'rooms':
                return <RoomManager />;
            default:
                return <RoomManager />;
        }
    };

    return (
        <ConfigProvider>
            <Layout className="min-h-screen">
                <Sidebar collapsed={collapsed} token={token} activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

                <Layout style={{ background: '#f5f7fa' }}>
                    {/* <Header collapsed={collapsed} setCollapsed={setCollapsed} token={token} /> */}

                    <Content
                        className="p-6 overflow-y-auto scrollbar-thin"
                        style={{
                            minHeight: 'calc(100vh - 72px)',
                            maxHeight: 'calc(100vh - 72px)',
                            overflow: 'auto',
                        }}
                    >
                        <div className="flex justify-end mb-4">
                            <Button onClick={() => navigate('/')} type="default">
                                Quay về trang người dùng
                            </Button>
                        </div>
                        <div className="max-w-screen-2xl mx-auto">{renderContent()}</div>
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}

export default Admin;
