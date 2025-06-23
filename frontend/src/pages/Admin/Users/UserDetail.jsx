import { useEffect, useState } from 'react';
import { Button, Image, Modal, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById } from '../../../api/userAPI.js'; // Adjust the import path as necessary

export default function UserDetail({ isModal }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Gọi API khi component mounted
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserById(id);
                setUser(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy người dùng:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);


    const closeModal = () => navigate('/admin/users');

    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }) : 'N/A';
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;

    if (!user) return <p>Không tìm thấy người dùng với ID: {id}</p>;

    const UserTable = (
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
                <tr><th>Tên đăng nhập</th><td>{user.username}</td></tr>
                <tr><th>Email</th><td>{user.email}</td></tr>
                <tr><th>CMND/CCCD</th><td>{user.citizen_id}</td></tr>
                <tr><th>Họ và tên</th><td>{user.fullname}</td></tr>
                <tr><th>SĐT</th><td>{user.phoneNumber}</td></tr>
                <tr><th>Vai trò</th><td>{user.role}</td></tr>
                <tr><th>Địa chỉ</th><td>{user.address}</td></tr>
                <tr><th>Ngày sinh</th><td>{formatDate(user.dateOfBirth)}</td></tr>
                <tr><th>Ngày tạo</th><td>{formatDate(user.createdAt)}</td></tr>
                <tr><th>Ngày cập nhật</th><td>{formatDate(user.updatedAt)}</td></tr>
                <tr><th>Trạng thái</th><td>{user.status}</td></tr>
                <tr>
                    <th>Liên hệ khẩn cấp</th>
                    <td>
                        {user.contactEmergency?.name ? (
                            <>
                                Tên: {user.contactEmergency.name}<br />
                                Quan hệ: {user.contactEmergency.relationship}<br />
                                SĐT: {user.contactEmergency.phoneNumber}
                            </>
                        ) : (
                            'Không có thông tin'
                        )}
                    </td>
                </tr>
            </tbody>
        </Table>
    );

    return isModal ? (
        <Modal show onHide={closeModal} size="lg" centered dialogClassName="modal-full-height">
            <Modal.Header closeButton>
                <Modal.Title>Thông tin người dùng #{id}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                {UserTable}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    ) : (
        <div style={{ minHeight: '100vh', padding: '1rem', backgroundColor: '#fff' }}>
            <h2>Chi tiết người dùng</h2>
            {UserTable}
            <Button variant="secondary" onClick={() => navigate('/admin/users')}>Quay lại</Button>
        </div>
    );
}
