import { request } from './request';
import { apiClient } from './axiosClient';

const apiPayment = '/api/payment';

export const requestCreatePayment = async (data) => {
    const res = await apiClient.post(`${apiPayment}/create`, data);
    return res.data;
};

export const requestGetPaymentById = async (id) => {
    const res = await apiClient.get(`${apiPayment}/success/${id}`);
    return res.data;
};

export const requestGetAllPayment = async () => {
    const res = await apiClient.get(`${apiPayment}/admin/payments`);
    return res.data;
};

export const requestUpdatePaymentStatus = async (id, status) => {
    const res = await apiClient.put(`${apiPayment}/admin/update-status/${id}`, { status });
    return res.data;
};

export const requestGetPaymentsUser = async () => {
    const res = await apiClient.get(`${apiPayment}/user/payments`);
    return res.data;
};

export const requestCancelPaymentUser = async (id) => {
    const res = await apiClient.put(`${apiPayment}/user/cancel/${id}`);
    return res.data;
};
