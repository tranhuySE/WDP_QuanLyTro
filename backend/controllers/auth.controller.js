const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const EmailService = require("../services/emailService");
const crypto = require("crypto");
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (!user)
            return res.status(404).json({ message: "User not found!" });

        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch)
        //     return res.status(401).json({ message: "Invalid credentials!" });

        // don't use bcrypt to compare the password
        if (user.password !== password)
            return res.status(401).json({ message: "Invalid credentials!" });

        const token = generateToken(user._id);
        
        res.status(200).json({
            message: "Login successful!",
            token,
            user: user,
        });
    } catch (err) {
        res.status(500).json({ message: err.toString() });
    }
};

// Forgot Password - Gửi email reset password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        // Kiểm tra email có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });
        }

        // Tạo reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpire = new Date(Date.now() + 10 * 60 * 1000); // Token hết hạn sau 10 phút

        // Lưu token vào database
        user.resetToken = resetToken;
        user.resetTokenExpire = resetTokenExpire;
        await user.save();

        // Gửi email sử dụng EmailService
        await EmailService.sendForgotPasswordEmail(user, resetToken);

        res.status(200).json({ 
            message: "Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn." 
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: "Có lỗi xảy ra khi gửi email đặt lại mật khẩu!" });
    }
};

// Reset Password - Đặt lại mật khẩu mới
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Tìm user với token hợp lệ
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        }

        // Hash mật khẩu mới
        //const salt = await bcrypt.genSalt(10);
        //const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu mới và xóa token
        //user.password = hashedPassword;
        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();

        // Gửi email thông báo thành công
        EmailService.sendPasswordResetSuccessEmail(user).catch(err => {
            console.error('Send success email error:', err);
        });

        res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công!" });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: "Có lỗi xảy ra khi đặt lại mật khẩu!" });
    }
};

module.exports = {
    loginUser,
    forgotPassword,
    resetPassword,
};
