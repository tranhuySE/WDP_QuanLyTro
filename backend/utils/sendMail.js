const nodemailer = require('nodemailer');
require('dotenv').config();

// Tạo transporter (người gửi)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,          // Thay bằng Gmail của bạn
    pass: process.env.EMAIL_PASS,       // Mật khẩu ứng dụng (16 ký tự)
  }
});

// Thông tin email
const mailOptions = (toEmail, subject, content) => {
  return {
    from: process.env.EMAIL_USER,
    to: toEmail,            // Email người nhận
    subject: subject,
    text: content,
  };
};

// Gửi email
const sendMail = async (toEmail, subject, content) => {
  try {
    const options = mailOptions(toEmail, subject, content);
    const info = await transporter.sendMail(options);
    console.log('✅ Đã gửi thành công:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.log('❌ Gửi mail thất bại:', error);
    throw error;
  }
};

module.exports = { sendMail };
