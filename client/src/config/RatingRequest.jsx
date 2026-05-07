import { apiClient } from './axiosClient';

const apiRating = '/api/ratings';

export const requestCreateRating = async (data) => {
    const res = await apiClient.post(`${apiRating}/create`, data);
    return res.data;
};

export const requestGetRatingsByRoomId = async (roomId) => {
    const res = await apiClient.get(`${apiRating}/room/${roomId}`);
    return res.data;
};

export const requestGetRoomStats = async (roomId) => {
    const res = await apiClient.get(`${apiRating}/stats/${roomId}`);
    return res.data;
};

export const requestUpdateRating = async (roomId, ratingId, data) => {
    const res = await apiClient.put(`${apiRating}/update/${roomId}/${ratingId}`, data);
    return res.data;
};

export const requestDeleteRating = async (roomId, ratingId) => {
    const res = await apiClient.delete(`${apiRating}/delete/${roomId}/${ratingId}`);
    return res.data;
};
