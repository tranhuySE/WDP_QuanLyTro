import axiosInstance from './axiosInstance';

export const getStats = () => {
    return axiosInstance.get('/invoices/stats');
};

export const getInvoices = (params) => {
    return axiosInstance.get('/invoices', { params });
};

export const createInvoice = (invoiceData, files = [], oldImages = [], deletedImages = []) => {
    const formData = new FormData();
    formData.append('invoiceData', JSON.stringify(invoiceData));
    formData.append('oldImages', JSON.stringify(oldImages));
    formData.append('deletedImages', JSON.stringify(deletedImages));

    files.forEach((file) => {
        formData.append('files', file);
    });

    return axiosInstance.post('/invoices', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateInvoice = (id, invoiceData, files = [], oldImages = [], deletedImages = []) => {
    const formData = new FormData();
    formData.append('invoiceData', JSON.stringify(invoiceData));
    formData.append('oldImages', JSON.stringify(oldImages));
    formData.append('deletedImages', JSON.stringify(deletedImages));

    files.forEach((file) => {
        formData.append('files', file);
    });

    return axiosInstance.put(`/invoices/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteInvoice = (id) => {
    return axiosInstance.delete(`/invoices/${id}`);
};
