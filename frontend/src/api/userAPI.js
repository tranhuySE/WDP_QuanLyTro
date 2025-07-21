// src/api/userAPI.js
import axiosInstance from './axiosInstance';
import axios from "axios";

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

const changePassword = (data) => axiosInstance.put(`/users/change-password`, data);
const getListStaff = () => axios.get("http://localhost:9999/users/getListStaff")

const UserAPI = {
    getListStaff,editUserById,changePassword
}

export default UserAPI
