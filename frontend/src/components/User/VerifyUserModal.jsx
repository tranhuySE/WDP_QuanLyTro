import {
    Lock,
    Send,
    X
} from 'lucide-react';
import {
    Alert,
    Button,
    Form,
    InputGroup,
    Modal,
    Spinner
} from 'react-bootstrap';

const VerifyUserModal = ({
    show,
    onHide,
    formik: verifyFormik,
    user: selectedUser,
    loading
}) => {
    if (!selectedUser) return null;

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Xác minh người dùng</Modal.Title>
            </Modal.Header>
            <Form onSubmit={verifyFormik.handleSubmit}>
                <Modal.Body>
                    <Alert variant="info" className="mb-4">
                        Bạn đang xác minh người dùng: <strong>{selectedUser.fullname}</strong><br />
                        Email: <strong>{selectedUser.email}</strong>
                    </Alert>

                    <Form.Group className="mb-3">
                        <Form.Label>Tên đăng nhập</Form.Label>
                        <Form.Control
                            name="username"
                            value={verifyFormik.values.username}
                            onChange={verifyFormik.handleChange}
                            onBlur={verifyFormik.handleBlur}
                            isInvalid={verifyFormik.touched.username && verifyFormik.errors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                            {verifyFormik.errors.username}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu</Form.Label>
                        <InputGroup>
                            <Form.Control
                                name="password"
                                type="password"
                                value={verifyFormik.values.password}
                                onChange={verifyFormik.handleChange}
                                onBlur={verifyFormik.handleBlur}
                                isInvalid={verifyFormik.touched.password && verifyFormik.errors.password}
                            />
                            <InputGroup.Text>
                                <Lock size={18} />
                            </InputGroup.Text>
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">
                            {verifyFormik.errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Alert variant="warning">
                        Thông tin đăng nhập sẽ được gửi đến email của người dùng
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            onHide();
                            verifyFormik.resetForm();
                        }}
                    >
                        <X size={18} className="me-1" />
                        Hủy
                    </Button>
                    <Button variant="success" type="submit" disabled={loading}>
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