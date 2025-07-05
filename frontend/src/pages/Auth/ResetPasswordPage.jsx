import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authAPI from "../../api/authAPI";
import { toast } from "react-toastify";
import "../../styles/Auth/ResetPasswordPage.css";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setMessage("Token không hợp lệ!");
    }
  }, [token]);

  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return minLength && hasLowercase && hasUppercase && hasNumber;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword(newPassword)) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số.");
      toast.error("Mật khẩu không đủ mạnh!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp!");
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const response = await authAPI.resetPassword(token, newPassword);
      setMessage(response.data.message || "Mật khẩu đã được đặt lại thành công!");
      toast.success("Mật khẩu đã được đặt lại thành công!");
      
      // Chuyển hướng về trang đăng nhập sau 2 giây
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="reset-password-container">
        <h2 className="text-center mb-4">Link không hợp lệ</h2>
        <div className="alert alert-danger">{message}</div>
        <button className="btn btn-primary w-100" onClick={() => navigate("/forgot-password")}>
          Yêu cầu link mới
        </button>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <h2 className="text-center mb-4">Đặt lại mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Mật khẩu mới</label>
          <input
            type="password"
            className="form-control"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <small className="form-text text-muted">
            Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số.
          </small>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Xác nhận mật khẩu</label>
          <input
            type="password"
            className="form-control"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </button>
      </form>
      
      {message && (
        <div className={`alert ${message.includes('thành công') ? 'alert-success' : 'alert-info'} mt-3`}>
          {message}
        </div>
      )}
      
      <button className="btn btn-link mt-2" onClick={() => navigate("/")}>
        Quay lại đăng nhập
      </button>
    </div>
  );
};

export default ResetPasswordPage; 