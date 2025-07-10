const { sendMail } = require("../utils/sendMail");

class EmailService {
  // Template email quên mật khẩu
  static async sendForgotPasswordEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    const subject = "Đặt lại mật khẩu - Hệ thống quản lý trọ";
    const content = `
      Xin chào ${user.fullname},
      
      Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.
      
      Vui lòng click vào link bên dưới để đặt lại mật khẩu:
      ${resetUrl}
      
      Link này sẽ hết hạn sau 10 phút.
      
      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
      
      Trân trọng,
      Hệ thống quản lý trọ
    `;

    try {
      const result = await sendMail(user.email, subject, content);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Send forgot password email error:', error);
      throw new Error('Không thể gửi email đặt lại mật khẩu');
    }
  }

  // Template email thông báo đặt lại mật khẩu thành công
  static async sendPasswordResetSuccessEmail(user) {
    const subject = "Mật khẩu đã được đặt lại thành công - Hệ thống quản lý trọ";
    const content = `
      Xin chào ${user.fullname},
      
      Mật khẩu của bạn đã được đặt lại thành công.
      
      Nếu bạn không thực hiện hành động này, vui lòng liên hệ ngay với chúng tôi.
      
      Trân trọng,
      Hệ thống quản lý trọ
    `;

    try {
      const result = await sendMail(user.email, subject, content);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Send password reset success email error:', error);
      // Không throw error vì đây chỉ là email thông báo
      return { success: false, error: error.message };
    }
  }

  // Template email chào mừng (có thể sử dụng cho đăng ký)
  static async sendWelcomeEmail(user) {
    const subject = "Chào mừng bạn đến với Hệ thống quản lý trọ";
    const content = `
      Xin chào ${user.fullname},
      
      Chào mừng bạn đến với Hệ thống quản lý trọ!
      
      Tài khoản của bạn đã được tạo thành công.
      
      Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
      
      Trân trọng,
      Hệ thống quản lý trọ
    `;

    try {
      const result = await sendMail(user.email, subject, content);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Send welcome email error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = EmailService; 