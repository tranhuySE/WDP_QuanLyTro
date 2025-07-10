import { useFormik } from 'formik';
import { Plus, Search, User } from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

// Components
import UserDetailModal from '../../../components/User/UserDetailModal';
import UserFormModal from '../../../components/User/UserFormModal';
import UserTable from '../../../components/User/UserTable';
import VerifyUserModal from '../../../components/User/VerifyUserModal';

// Schemas
import { userSchema, verifySchema } from '../../../validation/userSchema';

// API
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

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await getAllUsers();
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error('Không thể tải người dùng, vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Sync selectedUser with users data
    useEffect(() => {
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
                    // Update existing user
                    const updatedUsers = users.map(user =>
                        user._id === selectedUser._id ? { ...user, ...values } : user
                    );
                    setUsers(updatedUsers);
                    toast.success('Cập nhật người dùng thành công (mock)');
                } else {
                    // Add new user
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

    // Handle verify user
    const handleVerify = (user) => {
        setSelectedUser(user);
        verifyFormik.resetForm();
        setShowVerifyModal(true);
    };

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

            {loading && !users.length ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <UserTable 
                    users={filteredUsers} 
                    loading={loading}
                    onViewDetail={handleViewDetail}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onVerify={handleVerify}
                />
            )}

            <UserFormModal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    formik.resetForm();
                }}
                formik={formik}
                isEditing={isEditing}
                loading={loading}
            />

            <VerifyUserModal
                show={showVerifyModal}
                onHide={() => {
                    setShowVerifyModal(false);
                    verifyFormik.resetForm();
                }}
                formik={verifyFormik}
                user={selectedUser}
                loading={loading}
            />

            <UserDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                user={selectedUser}
                onVerify={() => {
                    setShowDetailModal(false);
                    handleVerify(selectedUser);
                }}
            />
        </div>
    );
};

export default UserManagement;