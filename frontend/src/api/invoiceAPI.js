import axiosInstance from './axiosInstance';

export const getStats = () => {
    return axiosInstance.get('/invoices/stats');
};

export const getInvoices = (params) => {
    return axiosInstance.get('/invoices', { params });
};

export const createInvoice = (invoiceData) => {
    return axiosInstance.post('/invoices', invoiceData, {
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

export const getInvoicesByUserId = (userId) => {
    return axiosInstance.get(`/invoices/user/${userId}`);
};

export const createPayment = (invoiceId, userId) => {
    return axiosInstance.post('/invoices/create-payment', { invoiceId: invoiceId, userId: userId });
};

export const receivePayOSWebhook = (data) => {
    return axiosInstance.post('/invoices/payos-webhook', data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const checkPaymentStatus = (invoiceId, userId) => {
    return axiosInstance.get(`/invoices/${invoiceId}/${userId}/payment-status`);
};
