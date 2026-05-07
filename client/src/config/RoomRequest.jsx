import { request } from './request';
import { apiClient } from './axiosClient';

const apiRoom = '/api/rooms';

export const requestUploadImages = async (data) => {
    const res = await apiClient.post(`${apiRoom}/upload-images`, data);
    return res.data;
};

export const requestCreateRoom = async (data) => {
    const res = await apiClient.post(`${apiRoom}/create`, data);
    return res.data;
};

export const requestGetRooms = async () => {
    const res = await request.get(`${apiRoom}/all`);
    return res.data;
};

export const requestUpdateRoom = async (id, data) => {
    const res = await apiClient.put(`${apiRoom}/update/${id}`, data);
    return res.data;
};

export const requestDeleteRoom = async (id) => {
    const res = await apiClient.delete(`${apiRoom}/delete/${id}`);
    return res.data;
};

export const requestGetRoomById = async (id) => {
    const res = await request.get(`${apiRoom}/detail/${id}`);
    return res.data;
};

export const requestSearchRoom = async (data) => {
    const res = await request.get(`${apiRoom}/search`, { params: data });
    return res.data;
};
