import { AlertCircle, Eye, EyeOff, Home, Key, LogIn, User } from 'lucide-react';
import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import authAPI from '../../api/authAPI';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Auth/LoginPage.css';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const res = await authAPI.login(form);
            if (res.status === 200) {
                const { token, user } = res.data;
                login(token, user);
                // Chuyển hướng
                if (user.role === 'admin') navigate('/admin/homepage');
                else if (user.role === 'staff') navigate('/staff/homepage');
                else if (user.role === 'user') navigate('/tenant/homepage');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Tài khoản hoặc mật khẩu không đúng.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <div className="login-page">
            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col xs={12} md={6} lg={5}>
                        <Card className="login-card">
                            <Card.Body className="p-4">
                                <div className="text-center mb-4">
                                    <Home size={48} className="text-primary mb-3" />
                                    <h3 className="login-title">Boarding House Management</h3>
                                    <p className="text-muted">Please sign in to continue</p>
                                </div>

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="username">
                                        <Form.Label className="d-flex align-items-center">
                                            <User size={18} className="me-2" />
                                            Tên đăng nhập
                                        </Form.Label>
                                        <div className="input-with-icon">
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                value={form.username}
                                                onChange={handleChange}
                                                placeholder="Nhập tên đăng nhập"
                                                required
                                                className="ps-5"
                                            />
                                            <User size={18} className="input-icon" />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="password">
                                        <Form.Label className="d-flex align-items-center">
                                            <Key size={18} className="me-2" />
                                            Mật khẩu
                                        </Form.Label>
                                        <div className="input-with-icon">
                                            <Form.Control
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                placeholder="Nhập mật khẩu"
                                                required
                                                className="ps-5"
                                            />
                                            <Key size={18} className="input-icon" />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>
                                    </Form.Group>

                                    {error && (
                                        <div className="alert alert-danger d-flex align-items-center">
                                            <AlertCircle size={18} className="me-2" />
                                            {error}
                                        </div>
                                    )}

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 mt-3 login-button"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                        ) : (
                                            <LogIn size={18} className="me-2" />
                                        )}
                                        Đăng nhập
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                        <p className="text-center mt-2">
                            <Link to="/forgot-password" className="text-decoration-none">
                                Quên mật khẩu?
                            </Link>
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
