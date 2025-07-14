const express = require("express");
const {
  getAllRooms,
  getRoomById, // import controller mới
  addRoom,
  updateRoomById,
  deleteRoomById,
  getMyRoomInfo,
} = require("../controllers/room.controller");
const {
  validateRoom,
  validateId,
  handleValidationErrors,
} = require("../middlewares/validation.middleware");
const { verifyToken } = require("../middlewares/authMiddleware");

const roomRouter = express.Router();

// Route lấy phòng cá nhân (đặt trước route động)
roomRouter.get("/me/room", verifyToken, getMyRoomInfo);

// GET / - Lấy tất cả các phòng
roomRouter.get("/", getAllRooms);

// GET /:id - Lấy một phòng theo ID
roomRouter.get(
  "/:id",
  validateId, // Kiểm tra định dạng ID
  handleValidationErrors,
  getRoomById
);

// POST / - Thêm một phòng mới
roomRouter.post(
  "/",
  validateRoom, // Áp dụng quy tắc validation cho body
  handleValidationErrors, // Xử lý lỗi nếu có
  addRoom
);

// PUT /:id - Cập nhật một phòng theo ID
roomRouter.put(
  "/:id",
  validateId, // Kiểm tra định dạng ID
  validateRoom, // Áp dụng quy tắc validation cho body
  handleValidationErrors,
  updateRoomById
);

// DELETE /:id - Xóa một phòng theo ID
roomRouter.delete(
  "/:id",
  validateId, // Kiểm tra định dạng ID
  handleValidationErrors,
  deleteRoomById
);

module.exports = roomRouter;
