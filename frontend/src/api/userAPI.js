// src/api/userAPI.js
import axios from "axios";
import axiosInstance from './axiosInstance';

export const getAllUsers = () => {
    return axiosInstance.get('/users');
};

export const getUserById = (id) => {
    return axiosInstance.get(`/users/${id}`);
};

export const deleteUserById = (id) => {
    return axiosInstance.delete(`/users/${id}`);
};
const editUserById = (id, data) => axiosInstance.put(`/users/${id}`, data);

export const updateUserById = (id, userData) => {
    return axiosInstance.put(`/users/${id}`, userData);
}

export const editUserInfo = (id, data) => {
    return axiosInstance.put(`/users/edit/${id}`, data)
}

export const verifyTenant = (userId, { username, password }) => {
    return axiosInstance.put(`/users/verify-tenant/${userId}`, { username, password });
};

export const createUserByAdmin = (userData) => {
    return axiosInstance.post('/users/admin', userData);
}

const changePassword = (data) => axiosInstance.put(`/users/change-password`, data);
const getListStaff = () => axios.get("http://localhost:9999/users/getListStaff")

const UserAPI = {
    getListStaff, editUserById, changePassword
}

export default UserAPI
