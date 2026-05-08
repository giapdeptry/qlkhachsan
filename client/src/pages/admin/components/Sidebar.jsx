import React from 'react';

import { Layout, Menu, Avatar, Tooltip } from 'antd';
import {
    AppstoreOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    TagOutlined,
    LogoutOutlined,
    LaptopOutlined,
    MessageOutlined,
    DashboardOutlined,
    GiftOutlined,
    FileOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

function Sidebar({ collapsed, activeTab, setActiveTab, handleLogout }) {
    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Thống kê',
            color: '#4F46E5',
        },
        {
            key: 'rooms',
            icon: <AppstoreOutlined />,
            label: 'Quản lý phòng',
            color: '#059669',
        },
        {
            key: 'orders',
            icon: <ShoppingCartOutlined />,
            label: 'Quản lý đơn hàng',
            color: '#EA580C',
        },
        {
            key: 'users',
            icon: <UserOutlined />,
            label: 'Quản lý người dùng',
            color: '#0891B2',
        },
        {
            key: 'coupons',
            icon: <GiftOutlined />,
            label: 'Quản lý mã giảm giá',
            color: '#B91C1C',
        },
        {
            key: 'contacts',
            icon: <MessageOutlined />,
            label: 'Quản lý liên hệ',
            color: '#9333EA',
        },
        {
            key: 'blog',
            icon: <FileOutlined />,
            label: 'Quản lý bài viết',
            color: '#9333EA',
        },
    ];

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className="h-screen overflow-hidden"
            width={280}
            style={{
                background: 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 100%)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                position: 'relative',
                zIndex: 1000,
            }}
        >
            {/* Header/Logo Section */}
            <div
                className="h-24 flex items-center justify-center relative"
                style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    margin: '0 16px 24px',
                    marginTop: '16px',
                    borderRadius: '16px',
                }}
            >
                <div className="flex items-center text-white">
                    {!collapsed ? (
                        <div className="flex items-center gap-3">
                            <div>
                                <div className="text-xl font-bold tracking-wide">Quản Trị Admin</div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                            <LaptopOutlined className="text-2xl" />
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="px-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                <Menu
                    mode="inline"
                    selectedKeys={[activeTab]}
                    onClick={(e) => setActiveTab(e.key)}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.95)'
                    }}
                    theme="dark"
                    className="custom-menu"
                >
                    {menuItems.map((item) => (
                        <Menu.Item
                            key={item.key}
                            style={{
                                height: '52px',
                                borderRadius: '12px',
                                margin: '8px 0',
                                background: activeTab === item.key ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                                border:
                                    activeTab === item.key
                                        ? '1px solid rgba(255, 255, 255, 0.12)'
                                        : '1px solid transparent',
                                backdropFilter: activeTab === item.key ? 'blur(6px)' : 'none',
                                transition: 'all 0.3s ease',
                            }}
                            className="menu-item-custom"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="p-2 rounded-lg flex items-center justify-center"
                                    style={{
                                        background: activeTab === item.key ? item.color : 'rgba(255, 255, 255, 0.06)',
                                        width: '36px',
                                        height: '36px',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {React.cloneElement(item.icon, {
                                        className: 'text-white',
                                        style: { fontSize: '16px' },
                                    })}
                                </div>
                                {!collapsed && (
                                    <span className="text-white font-medium" style={{ fontSize: '14px' }}>
                                        {item.label}
                                    </span>
                                )}
                            </div>
                        </Menu.Item>
                    ))}
                </Menu>
            </div>

            {/* Logout Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <Tooltip title={collapsed ? 'Đăng xuất' : ''} placement="right">
                    <div
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
                        style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            backdropFilter: 'blur(6px)',
                        }}
                        onClick={handleLogout}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div
                            className="p-2 rounded-lg flex items-center justify-center"
                            style={{
                                background: '#EF4444',
                                width: '32px',
                                height: '32px',
                            }}
                        >
                            <LogoutOutlined className="text-white" style={{ fontSize: '14px' }} />
                        </div>
                        {!collapsed && <span className="text-white font-medium text-sm">Đăng xuất</span>}
                    </div>
                </Tooltip>
            </div>

            <style jsx>{`
                .custom-menu .ant-menu-item {
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                }

                .custom-menu .ant-menu-item:hover {
                    background: rgba(255, 255, 255, 0.15) !important;
                    transform: translateX(4px);
                }

                .custom-menu .ant-menu-item-selected {
                    background: rgba(255, 255, 255, 0.2) !important;
                    transform: translateX(8px);
                }

                .custom-menu .ant-menu-item::after {
                    display: none;
                }

                ::-webkit-scrollbar {
                    width: 4px;
                }

                ::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                }

                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 2px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </Sider>
    );
}

export default Sidebar;
