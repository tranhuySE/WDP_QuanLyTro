import axiosInstance from "./axiosInstance"; // Giả sử bạn có file này để cấu hình base URL và headers

// Nếu chưa có axiosInstance, bạn có thể dùng tạm cách này:
// import axios from 'axios';
// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:9999', // Thay bằng URL backend của bạn
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

export const getAllRooms = () => {
  return axiosInstance.get("/rooms");
};

export const getRoomById = (id) => {
  return axiosInstance.get(`/rooms/${id}`);
};

export const createRoom = (roomData) => {
  return axiosInstance.post("/rooms", roomData);
};

export const updateRoomById = (id, roomData) => {
  return axiosInstance.put(`/rooms/${id}`, roomData);
};

export const deleteRoomById = (id) => {
  return axiosInstance.delete(`/rooms/${id}`);
};
