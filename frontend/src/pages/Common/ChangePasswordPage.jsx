/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner, Toast, InputGroup } from "react-bootstrap";
import UserAPI from "../../api/userAPI";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePasswordPage = () => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận không khớp.");
      return;
    }
    setLoading(true);
    try {
      const res = await UserAPI.changePassword({ oldPassword: form.oldPassword, password: form.newPassword });
      toast.success(res.data.message || "Đổi mật khẩu thành công!");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: 480 }}>
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-4 text-center">Đổi mật khẩu</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu hiện tại</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={form.oldPassword}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowOldPassword((v) => !v)}
                  tabIndex={-1}
                  style={{ borderLeft: 0 }}
                >
                  {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu mới"
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowNewPassword((v) => !v)}
                  tabIndex={-1}
                  style={{ borderLeft: 0 }}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  tabIndex={-1}
                  style={{ borderLeft: 0 }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button type="submit" variant="primary" disabled={loading} style={{ minWidth: 120 }}>
                {loading ? <Spinner size="sm" animation="border" /> : "Đổi mật khẩu"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ChangePasswordPage; 