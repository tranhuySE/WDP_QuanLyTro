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

const mailOptions = (toEmail, subject, content) => {
  // Xác định content là HTML hay plain text
  const isHTML = content.includes('<') && content.includes('>');

  return {
    from: `"Hệ thống Quản lý Nhà trọ" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: subject,
    ...(isHTML
      ? { html: content, text: stripHtml(content) } // Gửi cả HTML và text fallback
      : { text: content }
    ),
    headers: {
      'X-Mailer': 'NodeMailer',
      'Priority': 'high'
    }
  };
};

// Hàm phụ trợ chuyển HTML sang text
const stripHtml = (html) => {
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/\n{3,}/g, '\n\n');
};

const sendMail = async (toEmail, subject, content) => {
  try {
    // Validate input
    if (!toEmail || !subject || !content) {
      throw new Error('Thiếu thông tin bắt buộc (toEmail, subject, content)');
    }

    const options = mailOptions(toEmail, subject, content);
    console.log('Attempting to send email with options:', {
      to: options.to,
      subject: options.subject
    });

    const info = await transporter.sendMail(options);

    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected
    });

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info) // Chỉ hoạt động với mail tester
    };
  } catch (error) {
    console.error('❌ Email sending failed:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    throw new Error(`Gửi email thất bại: ${error.message}`);
  }
};


module.exports = { sendMail };
