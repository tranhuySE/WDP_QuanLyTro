import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/Auth/LoginPage.css"; // Import your custom styles

const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { username, password } = form;

        // Demo: Giả lập đăng nhập
        if (username === "admin" && password === "admin123") {
            setError("");
            navigate("/dashboard"); // Điều hướng sau khi đăng nhập thành công
        } else {
            setError("Tài khoản hoặc mật khẩu không đúng.");
        }
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
