import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authAPI from "../../api/authAPI";
import { toast } from "react-toastify";
import "../../styles/Auth/ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const response = await authAPI.forgotPassword(email);
      setMessage(response.data.message || "Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.");
      toast.success("Email đã được gửi thành công!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="text-center mb-4">Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
      </form>
      {message && (
        <div className={`alert ${message.includes('thành công') ? 'alert-success' : 'alert-info'} mt-3`}>
          {message}
        </div>
      )}
      <button className="btn btn-link mt-2" onClick={() => navigate("/")}>Quay lại đăng nhập</button>
    </div>
  );
};

export default ForgotPasswordPage;
