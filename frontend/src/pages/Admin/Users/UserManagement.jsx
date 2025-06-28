
import { useFormik } from 'formik';
import {
    Calendar,
    CheckCircle,
    Edit,
    Eye,
    Home,
    Lock,
    Mail,
    Phone,
    Plus,
    Save,
    Search,
    Send,
    Shield,
    Trash2,
    User,
    UserCheck,
    UserX,
    X
} from 'lucide-react';
import { MaterialReactTable } from 'material-react-table';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Form,
    Image,
    InputGroup,
    Modal,
    Row,
    Spinner,
    Tab,
    Tabs
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { getAllUsers } from '../../../api/userAPI';

const UserManagement = () => {
    // State
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Sync selectedUser with users data
    useEffect(() => {
        getAllUsers()
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                toast.error('Không thể tải người dùng, vui lòng thử lại sau.');
            });


        if (selectedUser && showDetailModal) {
            const updatedUser = users.find(user => user._id === selectedUser._id);
            if (updatedUser) {
                setSelectedUser(updatedUser);
            }
        }
    }, [users, selectedUser, showDetailModal]);

    // Filter users based on search term
    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            Object.values(user).some(
                value =>
                    (typeof value === 'string' &&
                        value.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (typeof value === 'object' &&
                        value !== null &&
                        Object.values(value).some(
                            nestedValue =>
                                typeof nestedValue === 'string' &&
                                nestedValue.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                    )
            )
        );
    }, [users, searchTerm]);

    // Validation Schema
    const userSchema = Yup.object().shape({
        username: Yup.string().when([], (fields, schema, context) => {
            if (context.parent.isVerifiedByAdmin) {
                return schema.required('Tên đăng nhập là bắt buộc');
            }
            return schema.nullable();
        }),
        email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
        password: Yup.string().when([], (fields, schema, context) => {
            if (context.parent.isVerifiedByAdmin) {
                return schema.min(6, 'Mật khẩu phải có ít nhất 6 ký tự');
            }
            return schema.nullable();
        }),
        fullname: Yup.string().required('Họ tên là bắt buộc'),
        citizen_id: Yup.string().required('CMND/CCCD là bắt buộc'),
        phoneNumber: Yup.string()
            .matches(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ')
            .required('Số điện thoại là bắt buộc'),
        role: Yup.string().required('Vai trò là bắt buộc'),
        address: Yup.string().required('Địa chỉ là bắt buộc'),
        dateOfBirth: Yup.date().required('Ngày sinh là bắt buộc'),
        status: Yup.string().required('Trạng thái là bắt buộc'),
        contactEmergency: Yup.object().shape({
            name: Yup.string().required('Tên người liên hệ là bắt buộc'),
            relationship: Yup.string().required('Mối quan hệ là bắt buộc'),
            phoneNumber: Yup.string()
                .matches(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ')
                .required('Số điện thoại liên hệ là bắt buộc')
        }),
        isVerifiedByAdmin: Yup.boolean()
    });

    // Verify User Schema
    const verifySchema = Yup.object().shape({
        username: Yup.string().required('Tên đăng nhập là bắt buộc'),
        password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc')
    });

    // Formik form for user
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            fullname: '',
            citizen_id: '',
            phoneNumber: '',
            avatar: 'https://res.cloudinary.com/dqj0v4x5g/image/upload/v1698231234/avt_default.png',
            role: 'user',
            address: '',
            dateOfBirth: '',
            status: 'inactive',
            contactEmergency: {
                name: '',
                relationship: '',
                phoneNumber: ''
            },
            isVerifiedByAdmin: false
        },
        validationSchema: userSchema,
        onSubmit: (values, { resetForm }) => {
            setLoading(true);
            setTimeout(() => {
                if (isEditing && selectedUser) {
                    // Cập nhật người dùng hiện có
                    const updatedUsers = users.map(user =>
                        user._id === selectedUser._id ? { ...user, ...values } : user
                    );
                    setUsers(updatedUsers);
                    toast.success('Cập nhật người dùng thành công (mock)');
                } else {
                    // Thêm người dùng mới
                    const newUser = {
                        ...values,
                        _id: Math.random().toString(36).substring(2, 9), // Mock ID
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    setUsers([...users, newUser]);
                    toast.success('Thêm người dùng thành công (mock)');
                }
                setLoading(false);
                setShowModal(false);
                setIsEditing(false);
                setSelectedUser(null);
                resetForm();
            }, 1000);
        }
    });

    // Formik form for verification
    const verifyFormik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: verifySchema,
        onSubmit: (values, { resetForm }) => {
            setLoading(true);
            setTimeout(() => {
                // Mock verify user
                const updatedUsers = users.map(user =>
                    user._id === selectedUser._id
                        ? {
                            ...user,
                            username: values.username,
                            password: values.password,
                            isVerifiedByAdmin: true
                        }
                        : user
                );
                setUsers(updatedUsers);

                toast.success(`Đã xác minh người dùng và gửi thông tin đăng nhập đến ${selectedUser.email}`);
                setLoading(false);
                setShowVerifyModal(false);
                setSelectedUser(null);
                resetForm();
            }, 1000);
        }
    });

    // Handle delete user (mock)
    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            setLoading(true);
            setTimeout(() => {
                const filteredUsers = users.filter(user => user._id !== id);
                setUsers(filteredUsers);
                toast.success('Xóa người dùng thành công (mock)');
                setLoading(false);
            }, 800);
        }
    };

    // Handle view detail
    const handleViewDetail = (user) => {
        setSelectedUser(user);
        setShowDetailModal(true);
    };

    // Handle edit user
    const handleEdit = (user) => {
        setSelectedUser(user);
        formik.setValues({
            username: user.username || '',
            room: user.room || '',
            email: user.email,
            password: '',
            fullname: user.fullname,
            citizen_id: user.citizen_id,
            phoneNumber: user.phoneNumber,
            avatar: user.avatar,
            role: user.role,
            address: user.address,
            dateOfBirth: moment(user.dateOfBirth).format('YYYY-MM-DD'),
            status: user.status,
            contactEmergency: user.contactEmergency || {
                name: '',
                relationship: '',
                phoneNumber: ''
            },
            isVerifiedByAdmin: user.isVerifiedByAdmin
        });
        setIsEditing(true);
        setShowModal(true);
    };

    // Handle status change in modal
    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        formik.setFieldValue('status', newStatus);
    };

    // Handle verify user
    const handleVerify = (user) => {
        setSelectedUser(user);
        verifyFormik.resetForm();
        setShowVerifyModal(true);
    };

    // Table columns
    const columns = useMemo(
        () => [
            {
                accessorKey: 'email',
                header: 'Email',
                size: 200
            },
            {
                accessorKey: 'fullname',
                header: 'Họ tên',
                size: 150
            },
            {
                accessorKey: 'phoneNumber',
                header: 'Số điện thoại',
                size: 120
            },
            {
                accessorKey: 'role',
                header: 'Vai trò',
                size: 100,
                Cell: ({ cell }) => (
                    <Badge
                        bg={
                            cell.getValue() === 'admin'
                                ? 'danger'
                                : cell.getValue() === 'staff'
                                    ? 'warning'
                                    : 'primary'
                        }
                    >
                        {cell.getValue() === 'admin' ? 'Quản trị' :
                            cell.getValue() === 'staff' ? 'Nhân viên' : 'Người dùng'}
                    </Badge>
                )
            },
            {
                accessorKey: 'status',
                header: 'Hoạt động',
                size: 100,
                Cell: ({ cell }) => (
                    <Badge
                        bg={
                            cell.getValue() === 'active'
                                ? 'success'
                                : cell.getValue() === 'inactive'
                                    ? 'danger'
                                    : 'primary'
                        }
                    >
                        {cell.getValue() === 'active' ? 'Hoạt động' :
                            cell.getValue() === 'inactive' ? 'Không hoạt động' : 'Bị khóa'}
                    </Badge>
                )
            },
            {
                accessorKey: 'isVerifiedByAdmin',
                header: 'Xác minh',
                size: 100,
                Cell: ({ cell, row }) => (
                    <div>
                        <Badge bg={cell.getValue() ? 'success' : 'warning'}>
                            {cell.getValue() ? 'Đã xác minh' : 'Chưa xác minh'}
                        </Badge>
                        {!cell.getValue() && (
                            <Button
                                variant="outline-success"
                                size="sm"
                                className="ms-2"
                                onClick={() => handleVerify(row.original)}
                            >
                                <CheckCircle size={14} />
                            </Button>
                        )}
                    </div>
                )
            }
        ],
        []
    );

    // Action column for table
    const actionColumn = useMemo(
        () => ({
            header: 'Thao tác',
            size: 150,
            Cell: ({ row }) => (
                <div className="d-flex gap-2">
                    <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleViewDetail(row.original)}
                    >
                        <Eye size={16} />
                    </Button>
                    <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleEdit(row.original)}
                    >
                        <Edit size={16} />
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(row.original._id)}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            )
        }),
        []
    );

    return (
        <div className="p-4">
            <h2 className="mb-4 d-flex align-items-center">
                <User className="me-2" size={28} />
                Quản lý người dùng
            </h2>

            <Card className="mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <Search size={18} />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Tìm kiếm người dùng..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={6} className="text-end">
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setShowModal(true);
                                    setIsEditing(false);
                                    formik.resetForm();
                                }}
                            >
                                <Plus size={18} className="me-1" />
                                Thêm người dùng
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <MaterialReactTable
                columns={[...columns, actionColumn]}
                data={filteredUsers}
                enableColumnActions={false}
                enableColumnFilters={false}
                enablePagination={true}
                enableSorting={true}
                enableBottomToolbar={true}
                enableTopToolbar={false}
                muiTableBodyRowProps={{ hover: true }}
                state={{ isLoading: loading }}
                localization={{
                    noRecordsToDisplay: 'Không có dữ liệu',
                    of: 'của',
                    rowsPerPage: 'Số hàng mỗi trang'
                }}
            />

            {/* Add/Edit User Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
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
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowModal(false);
                                formik.resetForm();
                            }}
                        >
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

            {/* Verify User Modal */}
            <Modal show={showVerifyModal} onHide={() => setShowVerifyModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác minh người dùng</Modal.Title>
                </Modal.Header>
                <Form onSubmit={verifyFormik.handleSubmit}>
                    <Modal.Body>
                        {selectedUser && (
                            <>
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
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowVerifyModal(false);
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

            {/* User Detail Modal */}
            <Modal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết người dùng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div>
                            <div className="text-center mb-4">
                                <Image
                                    src={selectedUser.avatar}
                                    roundedCircle
                                    width={100}
                                    height={100}
                                    className="border"
                                />
                                <h4 className="mt-3">{selectedUser.fullname}</h4>
                                <div className="d-flex justify-content-center gap-2 mb-2">
                                    <Badge
                                        bg={
                                            selectedUser.role === 'admin'
                                                ? 'danger'
                                                : selectedUser.role === 'staff'
                                                    ? 'warning'
                                                    : 'primary'
                                        }
                                    >
                                        {selectedUser.role === 'admin' ? 'Quản trị' :
                                            selectedUser.role === 'staff' ? 'Nhân viên' : 'Người dùng'}
                                    </Badge>
                                    <Badge bg={selectedUser.isVerifiedByAdmin ? 'success' : 'warning'}>
                                        {selectedUser.isVerifiedByAdmin ? 'Đã xác minh' : 'Chưa xác minh'}
                                    </Badge>
                                </div>
                            </div>

                            <Tabs defaultActiveKey="info" className="mb-3">
                                <Tab eventKey="info" title="Thông tin chung">
                                    <div className="mt-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <Mail size={18} className="me-2 text-muted" />
                                            <div>
                                                <small className="text-muted">Email</small>
                                                <div>{selectedUser.email}</div>
                                            </div>
                                        </div>
                                        {selectedUser.isVerifiedByAdmin && (
                                            <>
                                                <div className="d-flex align-items-center mb-3">
                                                    <User size={18} className="me-2 text-muted" />
                                                    <div>
                                                        <small className="text-muted">Tên đăng nhập</small>
                                                        <div>{selectedUser.username}</div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        <div className="d-flex align-items-center mb-3">
                                            <Phone size={18} className="me-2 text-muted" />
                                            <div>
                                                <small className="text-muted">Số phòng</small>
                                                <div>{selectedUser.room && selectedUser.room.roomNumber ? selectedUser.room.roomNumber : 'Chưa có'}</div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                            <Phone size={18} className="me-2 text-muted" />
                                            <div>
                                                <small className="text-muted">Số điện thoại</small>
                                                <div>{selectedUser.phoneNumber}</div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                            <Shield size={18} className="me-2 text-muted" />
                                            <div>
                                                <small className="text-muted">CMND/CCCD</small>
                                                <div>{selectedUser.citizen_id}</div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                            <Calendar size={18} className="me-2 text-muted" />
                                            <div>
                                                <small className="text-muted">Ngày sinh</small>
                                                <div>{moment(selectedUser.dateOfBirth).format('DD/MM/YYYY')}</div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                            <Home size={18} className="me-2 text-muted" />
                                            <div>
                                                <small className="text-muted">Địa chỉ</small>
                                                <div>{selectedUser.address}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>

                                <Tab eventKey="emergency" title="Liên hệ khẩn cấp">
                                    <div className="mt-3">
                                        {selectedUser.contactEmergency ? (
                                            <>
                                                <div className="d-flex align-items-center mb-3">
                                                    <UserCheck size={18} className="me-2 text-muted" />
                                                    <div>
                                                        <small className="text-muted">Tên người liên hệ</small>
                                                        <div>{selectedUser.contactEmergency.name}</div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center mb-3">
                                                    <User size={18} className="me-2 text-muted" />
                                                    <div>
                                                        <small className="text-muted">Mối quan hệ</small>
                                                        <div>{selectedUser.contactEmergency.relationship}</div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center mb-3">
                                                    <Phone size={18} className="me-2 text-muted" />
                                                    <div>
                                                        <small className="text-muted">Số điện thoại liên hệ</small>
                                                        <div>{selectedUser.contactEmergency.phoneNumber}</div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center text-muted py-4">
                                                <UserX size={32} className="mb-2" />
                                                <p>Không có thông tin liên hệ khẩn cấp</p>
                                            </div>
                                        )}
                                    </div>
                                </Tab>

                                {!selectedUser.isVerifiedByAdmin && (
                                    <Tab eventKey="verify" title="Xác minh">
                                        <div className="mt-4 text-center">
                                            <Alert variant="warning" className="mb-4">
                                                Người dùng này chưa được xác minh và chưa có tài khoản đăng nhập
                                            </Alert>
                                            <Button
                                                variant="success"
                                                size="lg"
                                                onClick={() => {
                                                    setShowDetailModal(false);
                                                    handleVerify(selectedUser);
                                                }}
                                            >
                                                <CheckCircle size={20} className="me-2" />
                                                Xác minh người dùng
                                            </Button>
                                        </div>
                                    </Tab>
                                )}
                            </Tabs>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserManagement;