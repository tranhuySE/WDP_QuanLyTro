import axiosInstance from "./axiosInstance";

const authAPI = {
    login: (data) => axiosInstance.post("/auth/login", data),
    forgotPassword: (email) => axiosInstance.post("/auth/forgot-password", { email }),
    resetPassword: (token, newPassword) => axiosInstance.post("/auth/reset-password", { token, newPassword }),
};

export default authAPI;
