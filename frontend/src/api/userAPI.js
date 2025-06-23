// src/api/userAPI.js
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