import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Upload, message, Space, Card, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {
    requestCreateRoom,
    requestDeleteRoom,
    requestGetRooms,
    requestUpdateRoom,
    requestUploadImages,
} from '../../../config/RoomRequest';

const { Option } = Select;

const RoomManager = () => {
    const [dataRooms, setDataRooms] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [form] = Form.useForm();

    const fetchRooms = async () => {
        const res = await requestGetRooms();
        setDataRooms(Array.isArray(res.metadata) ? res.metadata : []);
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const showModal = (room = null) => {
        setEditingRoom(room);
        if (room) {
            form.setFieldsValue({
                ...room,
                amenities: room.amenities || [],
                images: (room.images || []).map((img, index) => ({
                    uid: String(index),
                    name: img,
                    status: 'done',
                    url: `${import.meta.env.VITE_API_URL}/uploads/room/${img}`,
                })),
            });
        } else {
            form.resetFields();
        }

        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingRoom(null);
    };

    const handleSubmit = async (values) => {
        let imageUrls = [];

        // values.images bây giờ chính là fileList từ Upload
        if (values.images && values.images.length > 0) {
            const formData = new FormData();

            for (let file of values.images) {
                if (file.originFileObj) {
                    // Ảnh mới upload
                    formData.append('images', file.originFileObj);
                } else if (file.url) {
                    // Ảnh cũ đã có trên server
                    imageUrls.push(file.name);
                }
            }

            // Upload ảnh mới nếu có
            if (formData.has('images')) {
                const res = await requestUploadImages(formData);
                imageUrls = [...imageUrls, ...res.metadata];
            }
        }

        const roomData = {
            ...values,
            images: imageUrls,
        };

        try {
            if (editingRoom) {
                // gọi API cập nhật phòng
                await requestUpdateRoom(editingRoom._id, roomData); // <- cần có API update trong BE
                message.success('Cập nhật phòng thành công');
            } else {
                // thêm phòng mới
                const newRoom = {
                    _id: Date.now().toString(),
                    ...roomData,
                };
                await requestCreateRoom(newRoom);
                message.success('Thêm phòng thành công');
            }

            setIsModalVisible(false);
            setEditingRoom(null);
            fetchRooms();
            form.resetFields();
        } catch (error) {
            console.error(error);
            message.error('Có lỗi xảy ra');
        }
    };

    const handleDelete = (roomId) => {
        Modal.confirm({
            title: 'Xác nhận xoá',
            content: 'Bạn có chắc chắn muốn xoá phòng này?',
            onOk: async () => {
                await requestDeleteRoom(roomId);
                fetchRooms();
                message.success('Xoá phòng thành công');
            },
        });
    };

    const statusColors = {
        available: 'green',
        booked: 'orange',
        occupied: 'red',
        cleaning: 'blue',
        maintenance: 'gray',
    };

    const columns = [
        {
            title: 'Ảnh phòng',
            dataIndex: 'images',
            key: 'images',
            render: (images) => (
                <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/room/${images[0]}`}
                    alt="Ảnh phòng"
                    width={100}
                    height={100}
                />
            ),
        },
        {
            title: 'Số phòng',
            dataIndex: 'roomNumber',
            key: 'roomNumber',
        },
        {
            title: 'Loại phòng',
            dataIndex: 'roomType',
            key: 'roomType',
        },
        {
            title: 'Giá/đêm',
            dataIndex: 'pricePerNight',
            key: 'pricePerNight',
            render: (price) => `${price.toLocaleString()} VND`,
        },
        {
            title: 'Tầng',
            dataIndex: 'floor',
            key: 'floor',
        },
        {
            title: 'Sức chứa',
            key: 'capacity',
            render: (_, record) => (
                <span>
                    {record.adults} người lớn, {record.children} trẻ em
                </span>
            ),
        },

        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => showModal(record)}>
                        Sửa
                    </Button>
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)}>
                        Xoá
                    </Button>
                </Space>
            ),
        },
    ];

    const uploadProps = {
        beforeUpload: () => false,
        listType: 'picture',
        multiple: true,
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý Phòng</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Thêm Phòng Mới
                </Button>
            </div>

            <Card>
                {dataRooms && dataRooms.length > 0 ? (
                    <Table size="large" dataSource={Array.isArray(dataRooms) ? dataRooms : []} columns={columns} />
                ) : (
                    <div>Không có dữ liệu phòng</div>
                )}
            </Card>

            <Modal
                title={editingRoom ? 'Chỉnh sửa Thông tin Phòng' : 'Thêm Phòng Mới'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={1000}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        maxAdults: 2,
                        maxChildren: 0,
                        status: 'available',
                        amenities: [],
                    }}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label="Tên phòng"
                            name="roomName"
                            rules={[{ required: true, message: 'Vui lòng nhập số phòng' }]}
                        >
                            <Input placeholder="Ví dụ: Phòng Deluxe, Phòng VIP" />
                        </Form.Item>
                        <Form.Item
                            label="Số phòng"
                            name="roomNumber"
                            rules={[{ required: true, message: 'Vui lòng nhập số phòng' }]}
                        >
                            <Input placeholder="Ví dụ: 101, A202" />
                        </Form.Item>

                        <Form.Item
                            label="Loại phòng"
                            name="roomType"
                            rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
                        >
                            <Select placeholder="Chọn loại phòng">
                                <Option value="Standard">Standard</Option>
                                <Option value="Deluxe">Deluxe</Option>
                                <Option value="VIP">VIP</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Giá mỗi đêm (VND)"
                            name="pricePerNight"
                            rules={[{ required: true, message: 'Vui lòng nhập giá phòng' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Giảm giá (%)"
                            name="discount"
                            rules={[{ required: true, message: 'Vui lòng nhập % giảm giá' }]}
                        >
                            <InputNumber
                                min={0}
                                className="w-full"
                                placeholder="Nhập giảm giá"
                                max={100}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item label="Tầng" name="floor">
                            <InputNumber min={0} className="w-full" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item label="Số người lớn tối đa" name="maxAdults">
                            <InputNumber min={1} className="w-full" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item label="Số trẻ em tối đa" name="maxChildren">
                            <InputNumber min={0} className="w-full" style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <Form.Item label="Tiện nghi" name="amenities">
                        <Select mode="multiple" placeholder="Chọn tiện nghi">
                            <Option value="WiFi">WiFi</Option>
                            <Option value="TV">TV</Option>
                            <Option value="Mini Bar">Mini Bar</Option>
                            <Option value="Điều hòa">Điều hòa</Option>
                            <Option value="Bồn tắm">Bồn tắm</Option>
                            <Option value="Ban công">Ban công</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Hình ảnh"
                        name="images"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e && e.fileList} // chuyển đổi sự kiện thành fileList
                    >
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <ReactQuill theme="snow" style={{ height: 300 }} />
                    </Form.Item>
                    <div className="mt-15">
                        <Form.Item className="text-right mb-0">
                            <Space>
                                <Button onClick={handleCancel}>Huỷ</Button>
                                <Button type="primary" htmlType="submit">
                                    {editingRoom ? 'Cập nhật' : 'Thêm mới'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default RoomManager;
