import axiosInstance from './axiosInstance';

export const getContract = () => {
    return axiosInstance.get('/contracts');
};

export const createContract = (data) => {
    return axiosInstance.post('/create', data);
};

export const updateContract = (id, data) => {
    return axiosInstance.put(`/update/${id}`, data);
};
