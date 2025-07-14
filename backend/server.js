const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db.js");
const router = require("./routes/index.js");
// Thêm dòng này để import history router
const historyRouter = require("./routes/history.router.js");

// Thêm dòng này để import upload router
const uploadRouter = require("./routes/upload.router.js");
require("dotenv").config(); // Đảm bảo dòng này có để nạp file .env
const allowOrigins = ["http://localhost:3000"];
app.use(
  cors({
    origin: allowOrigins,
    credentials: true,
  })
);
app.get("/", async (req, res) => {
  try {
    res.send({ message: "Welcome to Boarding House Management System!" });
  } catch (error) {
    res.send({ error: error.message });
  }
});

// Cấu hình Cloudinary (đặt ở đây để dùng chung)
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(express.json());

// Sử dụng các router chính
app.use("/", router);

// Thêm dòng này để sử dụng upload router với tiền tố /api/upload
app.use("/api/upload", uploadRouter);
// Thêm dòng này để sử dụng history router với tiền tố /api/history
app.use("/api/history", historyRouter);

const PORT = process.env.PORT || 9999;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
