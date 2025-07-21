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
import { getAvailableRooms } from '../../../api/roomAPI';
import { createUserByAdmin, editUserInfo, getAllUsers, getUserById } from '../../../api/userAPI';

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
    const [availableRooms, setAvailableRooms] = useState([]);

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
                setAvailableRooms([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchAvailableRooms = async () => {
            try {
                const roomsResponse = await getAvailableRooms();
                if (Array.isArray(roomsResponse.data.data)) {
                    setAvailableRooms(Array.isArray(roomsResponse.data.data) ? roomsResponse.data.data : []);

                } else {
                    console.error('Invalid response format for available rooms:', roomsResponse.data);
                    toast.error('Không thể tải danh sách phòng, vui lòng thử lại sau.');
                }
            } catch (error) {
                console.error('Error fetching available rooms:', error);
                toast.error('Không thể tải danh sách phòng, vui lòng thử lại sau.');
            }
        };

        fetchUsers();
        fetchAvailableRooms();
    }, []);

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
        // Sử dụng schema động dựa trên isEditing
        validationSchema: isEditing ? editUserSchema : userSchema,
        enableReinitialize: true, // Cho phép reinitialize khi isEditing thay đổi
        // onSubmit: async (values, { resetForm }) => {
        //     try {
        //         setLoading(true);
        //         const updateData = { ...values };

        //         // Xóa password nếu không cập nhật
        //         if (isEditing && (!updateData.password || updateData.password.trim() === '')) {
        //             delete updateData.password;
        //         }

        //         const response = await editUserInfo(selectedUser._id, updateData);

        //         // Backend trả về user trực tiếp (không có wrapper object)
        //         if (response.data) { // Nếu có dữ liệu -> thành công
        //             const updatedUser = response.data;

        //             // Cập nhật state
        //             const updatedUsers = users.map(user =>
        //                 user._id === updatedUser._id ? updatedUser : user
        //             );
        //             setUsers(updatedUsers);

        //             toast.success('Cập nhật thành công');
        //             setShowModal(false);
        //             resetForm();
        //         } else {
        //             // Trường hợp lỗi (response.error hoặc response.message)
        //             toast.error(response.message || 'Cập nhật thất bại');
        //         }
        //     } catch (error) {
        //         console.error('Error:', error);
        //         toast.error(error.response?.data?.message || 'Lỗi hệ thống');
        //     } finally {
        //         setLoading(false);
        //     }
        // }
        onSubmit: async (values, { resetForm }) => {
            try {
                setLoading(true);

                if (isEditing) {
                    // Handle edit user
                    const updateData = { ...values };
                    if (!updateData.password) delete updateData.password;

                    const response = await editUserInfo(selectedUser._id, updateData);
                    if (response.data) {
                        setUsers(users.map(u => u._id === response.data._id ? response.data : u));
                        toast.success('Cập nhật thành công');
                        setShowModal(false);
                    }
                } else {
                    // Handle create new user
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
                toast.success('Xóa người dùng thành công');
                setLoading(false);
            }, 800);
        }
    };

    // Handle view detail
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


    // Handle edit user
    const handleEdit = async (user) => {
        try {
            setSelectedUser(user);
            setIsEditing(true); // Set trước khi setValues để schema được cập nhật

            formik.setValues({
                username: user.username || '',
                email: user.email || '',
                password: '', // Luôn để trống khi edit
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
        // Cập nhật danh sách users
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
                onUpdateSuccess={(updatedUser) => {
                    // Cập nhật state users với dữ liệu mới
                    const updatedUsers = users.map(user =>
                        user._id === updatedUser._id ? updatedUser : user
                    );
                    setUsers(updatedUsers);
                }}
                availableRooms={availableRooms}
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