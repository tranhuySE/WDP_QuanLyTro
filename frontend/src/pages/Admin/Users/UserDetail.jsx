import { Button, Image, Modal, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserDetail({ isModal, selectedUser }) {
    const { id } = useParams();
    const navigate = useNavigate();

    // Sample user data matching the userSchema structure
    const userData = [
        {
            id: 1,
            username: 'nguyenvanan',
            email: 'nguyenvanan@gmail.com',
            password: 'password123',
            citizen_id: '123456789012',
            fullname: 'Nguyễn Văn An',
            phoneNumber: '0901234567',
            avatar: 'https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/481272596_1179546833543417_3158719096453723109_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Upa3Z7zYf4gQ7kNvwHSU6bd&_nc_oc=Adngv2HTYBRYpDBo1U7PCi0JnAZQS4Uphasr0tdczvaXiRusbZvIpbZJ5eyw-yR91sw&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=CauNpWz33VXel2ctStK4mg&oh=00_AfP_PjoCayK1IFUgvSATh4SmO_f-uV4T3xrKTGrVYKC-jw&oe=685AA1E4',
            role: 'admin',
            address: '123 Đường Láng, Hà Nội',
            dateOfBirth: new Date('1990-05-15'),
            createdAt: new Date('2023-10-25T10:00:00Z'),
            updatedAt: new Date('2023-10-26T12:00:00Z'),
            status: 'active',
            contactEmergency: {
                name: 'Nguyễn Thị Mai',
                relationship: 'Vợ',
                phoneNumber: '0912345678',
            },
        },
        {
            id: 2,
            username: 'tranthibinh',
            email: 'tranthibinh@gmail.com',
            password: 'mypass456',
            citizen_id: '987654321098',
            fullname: 'Trần Thị Bình',
            phoneNumber: '0912345678',
            avatar: 'https://res.cloudinary.com/dqj0v4x5g/image/upload/v1698231234/avt_default.png',
            role: 'staff',
            address: '456 Nguyễn Huệ, TP.HCM',
            dateOfBirth: new Date('1985-08-20'),
            createdAt: new Date('2023-10-25T11:00:00Z'),
            updatedAt: new Date('2023-10-26T13:00:00Z'),
            status: 'active',
            contactEmergency: {
                name: 'Trần Văn Hùng',
                relationship: 'Chồng',
                phoneNumber: '0923456789',
            },
        },
        // ... other users
    ];

    // Find user by ID or use selectedUser if provided
    const user = selectedUser || userData.find(user => user.id === parseInt(id));

    const closeModal = () => navigate('/admin/users');

    // Format date for display
    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }) : 'N/A';
    };

    return isModal ? (
        <Modal
            show={true}
            onHide={closeModal}
            size="lg"
            centered
            dialogClassName="modal-full-height"
        >
            <Modal.Header closeButton>
                <Modal.Title>Thông tin người dùng #{id}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                {user ? (
                    <Table striped bordered hover>
                        <tbody>
                            <tr>
                                <th>Ảnh đại diện</th>
                                <td>
                                    <Image
                                        src={user.avatar}
                                        alt="Avatar"
                                        rounded
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>Tên đăng nhập</th>
                                <td>{user.username}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>{user.email}</td>
                            </tr>
                            <tr>
                                <th>CMND/CCCD</th>
                                <td>{user.citizen_id}</td>
                            </tr>
                            <tr>
                                <th>Họ và tên</th>
                                <td>{user.fullname}</td>
                            </tr>
                            <tr>
                                <th>Số điện thoại</th>
                                <td>{user.phoneNumber}</td>
                            </tr>
                            <tr>
                                <th>Vai trò</th>
                                <td>{user.role}</td>
                            </tr>
                            <tr>
                                <th>Địa chỉ</th>
                                <td>{user.address}</td>
                            </tr>
                            <tr>
                                <th>Ngày sinh</th>
                                <td>{formatDate(user.dateOfBirth)}</td>
                            </tr>
                            <tr>
                                <th>Ngày tạo</th>
                                <td>{formatDate(user.createdAt)}</td>
                            </tr>
                            <tr>
                                <th>Ngày cập nhật</th>
                                <td>{formatDate(user.updatedAt)}</td>
                            </tr>
                            <tr>
                                <th>Trạng thái</th>
                                <td>{user.status}</td>
                            </tr>
                            <tr>
                                <th>Liên hệ khẩn cấp</th>
                                <td>
                                    {user.contactEmergency?.name ? (
                                        <>
                                            Tên: {user.contactEmergency.name}<br />
                                            Quan hệ: {user.contactEmergency.relationship}<br />
                                            Số điện thoại: {user.contactEmergency.phoneNumber}
                                        </>
                                    ) : (
                                        'Không có thông tin'
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                ) : (
                    <p>Không tìm thấy người dùng với ID: {id}</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    ) : (
        <div style={{ minHeight: '100vh', padding: '1rem', backgroundColor: '#fff' }}>
            <h2>Chi tiết người dùng</h2>
            {user ? (
                <Table striped bordered hover>
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <td>{user.id}</td>
                        </tr>
                        <tr>
                            <th>Ảnh đại diện</th>
                            <td>
                                <Image
                                    src={user.avatar}
                                    alt="Avatar"
                                    rounded
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Tên đăng nhập</th>
                            <td>{user.username}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{user.email}</td>
                        </tr>
                        <tr>
                            <th>Mật khẩu</th>
                            <td>{user.password}</td>
                        </tr>
                        <tr>
                            <th>CMND/CCCD</th>
                            <td>{user.citizen_id}</td>
                        </tr>
                        <tr>
                            <th>Họ và tên</th>
                            <td>{user.fullname}</td>
                        </tr>
                        <tr>
                            <th>Số điện thoại</th>
                            <td>{user.phoneNumber}</td>
                        </tr>
                        <tr>
                            <th>Vai trò</th>
                            <td>{user.role}</td>
                        </tr>
                        <tr>
                            <th>Địa chỉ</th>
                            <td>{user.address}</td>
                        </tr>
                        <tr>
                            <th>Ngày sinh</th>
                            <td>{formatDate(user.dateOfBirth)}</td>
                        </tr>
                        <tr>
                            <th>Ngày tạo</th>
                            <td>{formatDate(user.createdAt)}</td>
                        </tr>
                        <tr>
                            <th>Ngày cập nhật</th>
                            <td>{formatDate(user.updatedAt)}</td>
                        </tr>
                        <tr>
                            <th>Trạng thái</th>
                            <td>{user.status}</td>
                        </tr>
                        <tr>
                            <th>Liên hệ khẩn cấp</th>
                            <td>
                                {user.contactEmergency?.name ? (
                                    <>
                                        Tên: {user.contactEmergency.name}<br />
                                        Quan hệ: {user.contactEmergency.relationship}<br />
                                        Số điện thoại: {user.contactEmergency.phoneNumber}
                                    </>
                                ) : (
                                    'Không có thông tin'
                                )}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            ) : (
                <p>Không tìm thấy người dùng với ID: {id}</p>
            )}
            <Button variant="secondary" onClick={() => navigate('/admin/users')}>
                Quay lại
            </Button>
        </div>
    );
}