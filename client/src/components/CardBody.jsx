import React from 'react';
import { Card, Tag, Divider, Badge } from 'antd';
import {
    UserOutlined,
    UserAddOutlined,
    WifiOutlined,
    VideoCameraOutlined,
    CoffeeOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const RoomCardBody = ({ room }) => {
    // Sample room data for demo

    const roomData = room;

    // Amenity icon mapping
    const getAmenityIcon = (amenity) => {
        const icons = {
            WiFi: <WifiOutlined />,
            TV: <VideoCameraOutlined />,
            'Mini Bar': <CoffeeOutlined />,
        };
        return icons[amenity] || null;
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <Card
            className="w-full max-w-sm mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300"
            cover={
                <div className="relative h-48 overflow-hidden">
                    <Link to={`/detail-room/${roomData._id}`}>
                        <img
                            alt={`Room ${roomData.roomNumber}`}
                            src={
                                `${import.meta.env.VITE_API_URL}/uploads/room/${roomData.images?.[0]}` ||
                                'https://via.placeholder.com/400x300'
                            }
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </Link>

                    <div className="absolute top-2 right-2">
                        <Tag color="blue" className="border-0 bg-blue-500 text-white">
                            <EnvironmentOutlined className="mr-1" />
                            Tầng {roomData.floor}
                        </Tag>
                    </div>
                </div>
            }
        >
            <div className="space-y-3">
                {/* Room Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Phòng {roomData.roomName}</h3>
                        <p className="text-sm text-gray-500">{roomData.roomType}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{formatPrice(roomData.pricePerNight)}</p>
                        <p className="text-xs text-gray-500">/ đêm</p>
                    </div>
                </div>

                {/* Capacity */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <UserOutlined className="text-gray-600" />
                        <span className="text-sm text-gray-600">{roomData.maxAdults} người lớn</span>
                    </div>
                    {roomData.maxChildren > 0 && (
                        <div className="flex items-center gap-1">
                            <UserAddOutlined className="text-gray-600" />
                            <span className="text-sm text-gray-600">{roomData.maxChildren} trẻ em</span>
                        </div>
                    )}
                </div>

                <Divider className="my-2" />

                {/* Description */}
                <p
                    className="text-sm text-gray-600 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: roomData.description }}
                />
                {/* Amenities */}
                {roomData.amenities && roomData.amenities.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Tiện nghi:</p>
                        <div className="flex flex-wrap gap-1">
                            {roomData.amenities.map((amenity, index) => (
                                <Tag key={index} className="text-xs" icon={getAmenityIcon(amenity)}>
                                    {amenity}
                                </Tag>
                            ))}
                            {roomData.amenities.length > 10 && (
                                <Tag className="text-xs">+{roomData.amenities.length - 1} khác</Tag>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default RoomCardBody;
