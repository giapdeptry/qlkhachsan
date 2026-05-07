import { request } from './request';
import { apiClient } from './axiosClient';

const apiPreview = '/api/preview';

export const requestCreatePreview = async (data) => {
    const res = await apiClient.post(`${apiPreview}/create`, data);
    return res.data;
};

export const requestGetPreviewRoom = async (id) => {
    const res = await request.get(`${apiPreview}/room/${id}`);
    return res.data;
};
