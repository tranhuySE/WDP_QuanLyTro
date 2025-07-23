import { Lock, Send, X } from 'lucide-react';
import { Alert, Button, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { verifyTenant } from '../../api/userAPI';

const VerifyUserModal = ({
    show,
    onHide,
    formik: verifyFormik,
    user: selectedUser,
    loading,
    setLoading,
    onVerifySuccess // Thêm prop này để xử lý sau khi verify thành công
}) => {
    if (!selectedUser) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Gọi API verify tenant
            const response = await verifyTenant(selectedUser._id, {
                username: verifyFormik.values.username,
                password: verifyFormik.values.password
            });

            if (response.data) {
                toast.success(response.data.message || 'Xác minh thành công');
                onVerifySuccess(response.data.tenant); // Cập nhật UI với tenant đã verify
                onHide();
            }
        } catch (error) {
            console.error('Verify tenant error:', error);
            toast.error(error.response?.data?.message || 'Xác minh thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Xác minh người dùng</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Alert variant="info" className="mb-4">
                        Bạn đang xác minh người dùng: <strong>{selectedUser.fullname}</strong><br />
                        Email: <strong>{selectedUser.email}</strong>
                    </Alert>

                    <Form.Group className="mb-3">
                        <Form.Label>Tên đăng nhập <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            name="username"
                            value={verifyFormik.values.username}
                            onChange={verifyFormik.handleChange}
                            onBlur={verifyFormik.handleBlur}
                            isInvalid={verifyFormik.touched.username && verifyFormik.errors.username}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {verifyFormik.errors.username}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Tên đăng nhập phải là duy nhất trong hệ thống
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu <span className="text-danger">*</span></Form.Label>
                        <InputGroup>
                            <Form.Control
                                name="password"
                                type="password"
                                value={verifyFormik.values.password}
                                onChange={verifyFormik.handleChange}
                                onBlur={verifyFormik.handleBlur}
                                isInvalid={verifyFormik.touched.password && verifyFormik.errors.password}
                                required
                                minLength={6}
                            />
                            <InputGroup.Text>
                                <Lock size={18} />
                            </InputGroup.Text>
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">
                            {verifyFormik.errors.password}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Mật khẩu tối thiểu 6 ký tự
                        </Form.Text>
                    </Form.Group>

                    <Alert variant="warning">
                        Thông tin đăng nhập sẽ được gửi đến email: <strong>{selectedUser.email}</strong>
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            onHide();
                            verifyFormik.resetForm();
                        }}
                        disabled={loading}
                    >
                        <X size={18} className="me-1" />
                        Hủy
                    </Button>
                    <Button
                        variant="success"
                        type="submit"
                        disabled={loading || !verifyFormik.isValid}
                    >
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Send size={18} className="me-1" />
                                Xác minh & Gửi thông tin
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default VerifyUserModal;