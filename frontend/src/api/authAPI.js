import axiosInstance from "./axiosInstance";

const authAPI = {
    login: (data) => axiosInstance.post("/auth/login", data),
};

export default authAPI;
