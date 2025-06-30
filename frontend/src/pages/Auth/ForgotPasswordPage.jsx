import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import forgotPasswordAPI từ api nếu có, hoặc để TODO
// import { forgotPasswordAPI } from "../../api/userAPI";

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
      // await forgotPasswordAPI(email); // Bỏ comment nếu đã có API
      setTimeout(() => { // Xóa dòng này khi có API thật
        setMessage("Vui lòng kiểm tra email để đặt lại mật khẩu.");
        setLoading(false);
      }, 1000); // Xóa khi có API thật
    } catch (error) {
      setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container" style={{maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8}}>
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
      {message && <div className="alert alert-info mt-3">{message}</div>}
      <button className="btn btn-link mt-2" onClick={() => navigate("/login")}>Quay lại đăng nhập</button>
    </div>
  );
};

export default ForgotPasswordPage;
