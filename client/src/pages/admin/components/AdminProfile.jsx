import { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Modal, Form, Input, message, Spin } from 'antd';
import CryptoJS from 'crypto-js';
import { requestAuth, requestUpdateUserAdmin } from '../../../config/UserRequest';

function AdminProfile() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const loadAdminInfo = async () => {
        try {
            setLoading(true);
            const authRes = await requestAuth();
            const bytes = CryptoJS.AES.decrypt(authRes.metadata, import.meta.env.VITE_SECRET_CRYPTO);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            const adminUser = JSON.parse(originalText);
            setUser(adminUser);
            form.setFieldsValue({
                fullName: adminUser.fullName || '',
                email: adminUser.email || '',
                phone: adminUser.phone || '',
                address: adminUser.address || '',
            });
        } catch (error) {
            message.error('Không thể tải thông tin admin. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdminInfo();
    }, []);

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (!user || !user._id) {
                message.error('Không tìm thấy thông tin admin');
                return;
            }

            const updateData = {
                userId: user._id,
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                address: values.address,
            };

            await requestUpdateUserAdmin(user._id, updateData);
            message.success('Cập nhật thông tin admin thành công');
            setIsModalVisible(false);
            loadAdminInfo();
        } catch (error) {
            message.error('Cập nhật thất bại. Vui lòng kiểm tra lại');
        }
    };

    return (
        <div className="space-y-6">
            <Card
                title="Thông tin Admin"
                bordered={false}
                style={{ borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                extra={
                    <Button type="primary" onClick={handleOpenModal} disabled={!user}>
                        Chỉnh sửa thông tin
                    </Button>
                }
            >
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <div className="mb-4">
                                <div className="text-sm text-slate-500">Họ và tên</div>
                                <div className="text-base font-semibold">{user?.fullName || 'Chưa có thông tin'}</div>
                            </div>
                            <div className="mb-4">
                                <div className="text-sm text-slate-500">Email</div>
                                <div className="text-base font-semibold">{user?.email || 'Chưa có thông tin'}</div>
                            </div>
                            <div className="mb-4">
                                <div className="text-sm text-slate-500">Số điện thoại</div>
                                <div className="text-base font-semibold">{user?.phone || 'Chưa có thông tin'}</div>
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <div className="mb-4">
                                <div className="text-sm text-slate-500">Địa chỉ</div>
                                <div className="text-base font-semibold">{user?.address || 'Chưa có thông tin'}</div>
                            </div>
                            <div className="mb-4">
                                <div className="text-sm text-slate-500">Vai trò</div>
                                <div className="text-base font-semibold">{user?.isAdmin ? 'Quản trị viên' : 'Người dùng'}</div>
                            </div>
                        </Col>
                    </Row>
                )}
            </Card>

            <Modal
                title="Chỉnh sửa thông tin Admin"
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={handleSave}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                    >
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại">
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ">
                        <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default AdminProfile;
