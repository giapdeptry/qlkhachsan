import { request } from './request';
import { apiClient } from './axiosClient';

const apiRoomWatch = '/api/room-watch';

export const requestCreateRoomWatch = async (data) => {
    const res = await apiClient.post(`${apiRoomWatch}/create`, data);
    return res.data;
};

export const requestGetRoomWatch = async () => {
    const res = await apiClient.get(`${apiRoomWatch}/get`);
    return res.data;
};
