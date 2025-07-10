import {
    Home,
    Lock,
    Phone,
    Save,
    X
} from 'lucide-react';
import {
    Button,
    Col,
    Form,
    InputGroup,
    Modal,
    Row,
    Spinner,
    Tab,
    Tabs
} from 'react-bootstrap';

const UserFormModal = ({
    show,
    onHide,
    formik,
    isEditing,
    loading,
    handleStatusChange
}) => {
    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={formik.handleSubmit}>
                <Modal.Body>
                    <Tabs defaultActiveKey="basic" className="mb-3">
                        <Tab eventKey="basic" title="Thông tin cơ bản">
                            <Row className="mt-3">
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            name="email"
                                            type="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.email && formik.errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Họ tên</Form.Label>
                                        <Form.Control
                                            name="fullname"
                                            value={formik.values.fullname}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.fullname && formik.errors.fullname}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.fullname}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>CMND/CCCD</Form.Label>
                                        <Form.Control
                                            name="citizen_id"
                                            value={formik.values.citizen_id}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.citizen_id && formik.errors.citizen_id}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.citizen_id}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Số điện thoại</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <Phone size={18} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                name="phoneNumber"
                                                value={formik.values.phoneNumber}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                isInvalid={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                            />
                                        </InputGroup>
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.phoneNumber}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ngày sinh</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="dateOfBirth"
                                            value={formik.values.dateOfBirth}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.dateOfBirth}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Tab>

                        <Tab eventKey="additional" title="Thông tin bổ sung">
                            <Row className="mt-3">
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Vai trò</Form.Label>
                                        <Form.Select
                                            name="role"
                                            value={formik.values.role}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.role && formik.errors.role}
                                        >
                                            <option value="admin">Quản trị</option>
                                            <option value="staff">Nhân viên</option>
                                            <option value="user">Người dùng</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.role}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Trạng thái</Form.Label>
                                        <Form.Select
                                            name="status"
                                            value={formik.values.status}
                                            onChange={(e) => {
                                                handleStatusChange(e);
                                                formik.handleChange(e);
                                            }}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.status && formik.errors.status}
                                        >
                                            <option value="active">Hoạt động</option>
                                            <option value="inactive">Không hoạt động</option>
                                            <option value="banned">Bị khóa</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.status}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Địa chỉ</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <Home size={18} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="address"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.address && formik.errors.address}
                                    />
                                </InputGroup>
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.address}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Đã xác minh bởi quản trị"
                                    name="isVerifiedByAdmin"
                                    checked={formik.values.isVerifiedByAdmin}
                                    onChange={formik.handleChange}
                                />
                            </Form.Group>

                            {formik.values.isVerifiedByAdmin && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên đăng nhập</Form.Label>
                                        <Form.Control
                                            name="username"
                                            value={formik.values.username}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={formik.touched.username && formik.errors.username}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.username}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {!isEditing && (
                                        <Form.Group className="mb-3">
                                            <Form.Label>Mật khẩu</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    name="password"
                                                    type="password"
                                                    value={formik.values.password}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    isInvalid={formik.touched.password && formik.errors.password}
                                                />
                                                <InputGroup.Text>
                                                    <Lock size={18} />
                                                </InputGroup.Text>
                                            </InputGroup>
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    )}
                                </>
                            )}
                        </Tab>

                        <Tab eventKey="emergency" title="Liên hệ khẩn cấp">
                            <Row className="mt-3">
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên người liên hệ</Form.Label>
                                        <Form.Control
                                            name="contactEmergency.name"
                                            value={formik.values.contactEmergency?.name || ''}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={
                                                formik.touched.contactEmergency?.name &&
                                                formik.errors.contactEmergency?.name
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.contactEmergency?.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Mối quan hệ</Form.Label>
                                        <Form.Control
                                            name="contactEmergency.relationship"
                                            value={formik.values.contactEmergency?.relationship || ''}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={
                                                formik.touched.contactEmergency?.relationship &&
                                                formik.errors.contactEmergency?.relationship
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.contactEmergency?.relationship}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Số điện thoại liên hệ</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <Phone size={18} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="contactEmergency.phoneNumber"
                                        value={formik.values.contactEmergency?.phoneNumber || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={
                                            formik.touched.contactEmergency?.phoneNumber &&
                                            formik.errors.contactEmergency?.phoneNumber
                                        }
                                    />
                                </InputGroup>
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.contactEmergency?.phoneNumber}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        <X size={18} className="me-1" />
                        Hủy
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Save size={18} className="me-1" />
                                {isEditing ? 'Cập nhật' : 'Lưu'}
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default UserFormModal;