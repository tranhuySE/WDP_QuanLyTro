import axiosInstance from './axiosInstance';

export const getContract = () => {
    return axiosInstance.get('/contracts');
};

export const createContract = (data) => {
    return axiosInstance.post('/contracts/create', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateStatusContract = (id, formValues) => {
    return axiosInstance.put(`/contracts/update/${id}`, {
        status: formValues.status,
        terminationReason: formValues.terminationReason || '',
        terminatedAt: formValues.status === 'terminated' ? new Date() : null,
    });
};

export const getContractByUserIdFE = (id) => {
    return axiosInstance.get(`/contracts/detail/${id}`);
};
