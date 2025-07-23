import axiosInstance from './axiosInstance';
import { deleteInvoice } from './invoiceAPI';

export const getAllHouseService = () => {
    return axiosInstance.get('/house-services');
};

export const createHouseService = (data) => {
    return axiosInstance.post('/house-services', data);
};

export const updateHouseService = (id, data) => {
    return axiosInstance.put(`/house-services/${id}`, data);
};

export const deleteHouseService = (id) => {
    return axiosInstance.delete(`/house-services/${id}`);
};
