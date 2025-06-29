import axiosInstance from './axiosInstance';

export const getStats = () => {
    return axiosInstance.get('/invoices/stats');
};
