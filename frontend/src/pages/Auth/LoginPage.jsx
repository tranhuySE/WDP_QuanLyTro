import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import authAPI from "../../api/authAPI";
import "../../styles/Auth/LoginPage.css";

const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        try {
            const res = await authAPI.login(form);

            if (res.status === 200) {
                const { token, user } = res.data;

                // Lưu thông tin vào localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("role", user.role);
                localStorage.setItem("fullname", user.fullname); 

                // Điều hướng dựa vào role
                if (user.role === "admin") navigate("/admin/homepage");
                else if (user.role === "staff") navigate("/staff/homepage");
                else navigate("/tenant/homepage");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Tài khoản hoặc mật khẩu không đúng.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <div className="login-page">
            <Container>
                <Row className="justify-content-center align-items-center">
                    <Col xs={12} md={6} lg={5}>
                        <Card className="shadow-lg border-0 rounded-4 p-3">
                            <Card.Body>
                                <h3 className="text-center mb-4 text-primary fw-bold">
                                    🏠 Boarding House Login
                                </h3>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="username">
                                        <Form.Label>Tên đăng nhập</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            value={form.username}
                                            onChange={handleChange}
                                            placeholder="Nhập tên đăng nhập"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="password">
                                        <Form.Label>Mật khẩu</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Nhập mật khẩu"
                                            required
                                        />
                                    </Form.Group>

                                    {error && (
                                        <div className="text-danger text-center mb-3">{error}</div>
                                    )}

                                    <div className="d-grid">
                                        <Button variant="primary" type="submit">
                                            Đăng nhập
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                        <p className="text-center mt-2">
                            <a href="/forgot-password">Quên mật khẩu?</a>
                        </p>
                        <p className="text-center text-muted mt-3">
                            &copy; 2025 Boarding House Management System
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LoginPage;
