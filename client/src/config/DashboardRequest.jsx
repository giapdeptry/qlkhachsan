import { request } from './request';
import { apiClient } from './axiosClient';

const apiDashboard = '/api/dashboard';

export const requestGetDashboard = async (timeFilter = 'month') => {
    const res = await apiClient.get(`${apiDashboard}?timeFilter=${timeFilter}`);
    return res.data;
};

export const requestGetChartData = async (type, timeFilter = 'month') => {
    const res = await apiClient.get(`${apiDashboard}/charts?type=${type}&timeFilter=${timeFilter}`);
    return res.data;
};
