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

export const updateUserById = (id, userData) => {
    return axiosInstance.put(`/users/${id}`, userData);
}

const getListStaff = () => axios.get("http://localhost:9999/users/getListStaff")

const UserAPI = {
    getListStaff
}

export default UserAPI
