const express = require("express");
const multer = require("multer");
const { uploadImage } = require("../controllers/upload.controller");

const uploadRouter = express.Router();

// Cấu hình Multer để lưu file vào bộ nhớ tạm thời
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước file 10MB
});

// Định nghĩa route: POST /
// Middleware `upload.single('image')` sẽ xử lý file gửi lên với key là "image"
uploadRouter.post("/", upload.single("image"), uploadImage);

module.exports = uploadRouter;
