// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:9999', // base URL backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
