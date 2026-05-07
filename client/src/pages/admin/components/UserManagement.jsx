import { useEffect, useState } from 'react';
import { Table, Card, Button, Input, Space, Tag, Modal, Form, message, Select } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    // requestCreateUser,
    requestDeleteUserAdmin,
    requestGetAllUser,
    requestUpdateUserAdmin,
} from '../../../config/UserRequest';

function UserManagement() {
    // Mock data

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const res = await requestGetAllUser();
        setUsers(res.metadata);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // State quản lý modal sửa
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    // State quản lý modal thêm
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [addForm] = Form.useForm();

    // Mở modal sửa
    const handleEdit = (user) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setIsEditModalVisible(true);
    };

    // Lưu khi sửa
    const handleSaveEdit = async () => {
        form.validateFields().then(async (values) => {
            const data = {
                userId: editingUser._id,
                fullName: values.fullName,
                phone: values.phone,
                email: values.email,
                isAdmin: values.isAdmin,
            };
            await requestUpdateUserAdmin(editingUser._id, data);
            message.success('Cập nhật thông tin người dùng thành công');
            setIsEditModalVisible(false);
            fetchUsers();
        });
    };

    // Lưu khi thêm
    const handleSaveAdd = async () => {
        addForm.validateFields().then(async (values) => {
            const data = {
                fullName: values.name,
                phone: values.phone,
                email: values.email,
                password: values.password,
                isAdmin: values.role,
            };
            await requestUpdateUserAdmin(data._id, data);
            message.success('Thêm người dùng thành công');
            setIsAddModalVisible(false);
        });
    };

    const handleDelete = async (user) => {
        await requestDeleteUserAdmin(user._id);
        message.success('Xóa người dùng thành công');
        fetchUsers();
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            width: 60,
            render: (_, record, index) => <span>{index + 1}</span>,
        },
        { title: 'Tên người dùng', dataIndex: 'fullName', key: 'fullName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
        {
            title: 'Quyền',
            dataIndex: 'isAdmin',
            key: 'isAdmin',
            render: (isAdmin) => (
                <Tag color={isAdmin === true ? 'blue' : 'purple'}>{isAdmin === true ? 'Admin' : 'Người dùng'}</Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => handleDelete(record)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold">Quản lý người dùng</div>
            </div>

            {/* Table */}
            <Card bordered={false} style={{ borderRadius: 12 }}>
                <Table dataSource={users} columns={columns} rowKey="_id" pagination={{ pageSize: 10 }} />
            </Card>

            {/* Modal sửa */}
            <Modal
                title="Sửa thông tin người dùng"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                onOk={handleSaveEdit}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="fullName"
                        label="Tên người dùng"
                        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="isAdmin"
                        label="Quyền"
                        rules={[{ required: true, message: 'Vui lòng chọn quyền' }]}
                    >
                        <Select>
                            <Select.Option value={true}>Admin</Select.Option>
                            <Select.Option value={false}>Người dùng</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal thêm */}
            <Modal
                title="Thêm người dùng"
                open={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                onOk={handleSaveAdd}
                okText="Thêm"
                cancelText="Hủy"
            >
                <Form form={addForm} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên người dùng"
                        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="role" label="Quyền" rules={[{ required: true, message: 'Vui lòng chọn quyền' }]}>
                        <Select>
                            <Select.Option value={true}>Admin</Select.Option>
                            <Select.Option value={false}>Người dùng</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default UserManagement;
