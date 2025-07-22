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

  static async sendTenantAccountEmail(user, username, password) {
    const subject = "Thông tin tài khoản hệ thống quản lý nhà trọ";
    const content = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #2c3e50;">Xin chào ${user.fullname},</h2>
      
      <p>Admin đã tạo tài khoản cho bạn trên hệ thống quản lý nhà trọ Quang Huy.</p>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p style="margin: 0;"><strong>Thông tin đăng nhập:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Username:</strong> ${username}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
      </div>
      
      <p>Vui lòng đăng nhập và đổi <strong>mật khẩu</strong> ngay lần đầu tiên.</p>
      
      <p style="color: #7f8c8d; margin-top: 30px;">
        Trân trọng,<br>
        <strong>Ban quản lý nhà trọ Quang Huy</strong>
      </p>
    </div>
  `;

    try {
      const result = await sendMail(user.email, subject, content);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Send tenant account email error:', error);
      throw new Error('Không thể gửi email thông tin tài khoản');
    }
  }
}

module.exports = EmailService; 