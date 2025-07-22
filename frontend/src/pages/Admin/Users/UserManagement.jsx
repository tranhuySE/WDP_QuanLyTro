import {
    Plus, Search,
    User
} from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';

import { useFormik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';

// Components
import UserDetailModal from '../../../components/User/UserDetailModal';
import UserFormModal from '../../../components/User/UserFormModal';
import UserTable from '../../../components/User/UserTable';
import VerifyUserModal from '../../../components/User/VerifyUserModal';

// Schemas
import { editUserSchema, userSchema, verifySchema } from '../../../validation/userSchema';

// API
import { createUserByAdmin, deleteUserById, editUserInfo, getAllUsers, getUserById } from '../../../api/userAPI';

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
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem("role");
        setCurrentUser({ role: role || "user" });

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

    // lọc user
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

    // formik form cho user
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
        validationSchema: isEditing ? editUserSchema : userSchema,
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            try {
                setLoading(true);

                if (isEditing) {
                    // sửa info user
                    const updateData = { ...values };
                    if (!updateData.password) delete updateData.password;

                    const response = await editUserInfo(selectedUser._id, updateData);
                    if (response.data) {
                        setUsers(users.map(u => u._id === response.data._id ? response.data : u));
                        toast.success('Cập nhật thành công');
                        setShowModal(false);
                    }
                } else {
                    // taạo user mới
                    const response = await createUserByAdmin(values);
                    if (response.data) {
                        setUsers([...users, response.data.user]);
                        toast.success(response.data.message);
                        setShowModal(false);

                        if (response.data.emailSent) {
                            toast.info(`Đã gửi thông tin đăng nhập đến ${response.data.user.email}`);
                        }
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error(error.response?.data?.message || 'Lỗi hệ thống');
            } finally {
                setLoading(false);
            }
        }
    });

    // formik form cho verification
    const verifyFormik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: verifySchema,
        onSubmit: (values, { resetForm }) => {
            setLoading(true);
            setTimeout(() => {
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

    // Hxóa user
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                setLoading(true);
                await deleteUserById(id); // Gọi API xóa

                // Cập nhật state sau khi xóa thành công
                const filteredUsers = users.filter(user => user._id !== id);
                setUsers(filteredUsers);
                toast.success('Xóa người dùng thành công');
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error(error.response?.data?.message || 'Xóa người dùng thất bại');
            } finally {
                setLoading(false);
            }
        }
    };

    // xem chi tiết user
    const handleViewDetail = async (user) => {
        try {
            setLoading(true);
            const response = await getUserById(user._id);
            console.log('Response from getUserById:', response.data);
            setSelectedUser({
                ...response.data,
                rooms: response.data.rooms // Đảm bảo giữ nguyên mảng rooms từ response
            });
            setShowDetailModal(true);
        } catch (error) {
            console.error('Error fetching user details:', error);
            toast.error('Không thể tải thông tin chi tiết');
        } finally {
            setLoading(false);
        }
    };


    // sửa thông tin user
    const handleEdit = async (user) => {
        try {
            setSelectedUser(user);
            setIsEditing(true); // Set trước khi setValues để schema được cập nhật

            formik.setValues({
                username: user.username || '',
                email: user.email || '',
                password: '',
                fullname: user.fullname || '',
                citizen_id: user.citizen_id || '',
                phoneNumber: user.phoneNumber || '',
                avatar: user.avatar || 'https://res.cloudinary.com/dqj0v4x5g/image/upload/v1698231234/avt_default.png',
                role: user.role || 'user',
                address: user.address || '',
                dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth).format('YYYY-MM-DD') : '',
                status: user.status || 'inactive',
                contactEmergency: user.contactEmergency || {
                    name: '',
                    relationship: '',
                    phoneNumber: ''
                },
                isVerifiedByAdmin: user.isVerifiedByAdmin || false
            });

            setShowModal(true);
        } catch (error) {
            console.error('Error preparing edit form:', error);
            toast.error('Có lỗi xảy ra khi chuẩn bị form chỉnh sửa');
        }
    };

    // Handle verify user
    const handleVerify = (user) => {
        setSelectedUser(user);
        verifyFormik.resetForm();
        setShowVerifyModal(true);
    };

    const handleVerifySuccess = (verifiedUser) => {
        // cập nhật danh sách users
        const updatedUsers = users.map(user =>
            user._id === verifiedUser._id
                ? { ...user, ...verifiedUser, isVerifiedByAdmin: true }
                : user
        );
        setUsers(updatedUsers);
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
                    currentUser={currentUser}
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
                currentUser={currentUser}
                onUpdateSuccess={(updatedUser) => {
                    const updatedUsers = users.map(user =>
                        user._id === updatedUser._id ? updatedUser : user
                    );
                    setUsers(updatedUsers);
                }}
            />

            <VerifyUserModal
                show={showVerifyModal}
                onHide={() => {
                    setShowVerifyModal(false);
                    verifyFormik.resetForm();
                }}
                formik={verifyFormik}
                user={selectedUser}
                loading={verifyLoading}
                setLoading={setVerifyLoading}
                onVerifySuccess={handleVerifySuccess}
            />

            <UserDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                user={selectedUser}
                onVerify={handleVerify}
                loading={loading}
            />
        </div>
    );
};

export default UserManagement;