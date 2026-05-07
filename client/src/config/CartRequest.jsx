import { request } from './request';
import { apiClient } from './axiosClient';

const apiCart = '/api/cart';

export const requestCreateCart = async (data) => {
    const res = await apiClient.post(`${apiCart}/create`, data);
    return res.data;
};

export const requestGetCart = async () => {
    const res = await apiClient.get(`${apiCart}/get`);
    return res.data;
};

export const requestUpdateCartRoom = async (roomIndex, data) => {
    const res = await apiClient.put(`${apiCart}/update/${roomIndex}`, data);
    return res.data;
};

export const requestDeleteCartRoom = async (roomIndex) => {
    const res = await apiClient.delete(`${apiCart}/delete/${roomIndex}`);
    return res.data;
};

export const requestUpdateCart = async (data) => {
    const res = await apiClient.post(`${apiCart}/update`, data);
    return res.data;
};
