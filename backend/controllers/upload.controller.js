const cloudinary = require("cloudinary").v2;

const uploadImage = async (req, res) => {
  try {
    // 1. Kiểm tra xem có file được gửi lên không
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn một file ảnh." });
    }

    // 2. Tải file lên Cloudinary từ buffer (dữ liệu file trong bộ nhớ)
    //    Chúng ta không cần lưu file tạm trên server.
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" }, // Tự động nhận diện loại file (ảnh, video)
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // 3. Trả về URL an toàn của ảnh cho client
    res.status(200).json({
      message: "Tải ảnh lên thành công!",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi tải ảnh lên." });
  }
};

module.exports = {
  uploadImage,
};
