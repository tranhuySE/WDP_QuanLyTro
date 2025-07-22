import axiosInstance from "./axiosInstance"; // Giả sử bạn có file này để cấu hình base URL và headers

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
export const getMyRoomInfo = () => {
  return axiosInstance.get("/rooms/me/room");
};

export const getAvailableRooms = () => {
  return axiosInstance.get('/rooms/available');
};
