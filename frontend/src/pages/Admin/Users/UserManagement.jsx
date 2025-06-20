import { useState } from 'react';
import { Button, Col, Container, Form, Pagination, Row, Table } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../../../styles/Admin/User/UserManagement.css'; // Adjust the path as necessary

const UserManagement = () => {
    const location = useLocation();

    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // State for UserDetail modal
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Updated sample data with new structure
    const userData = [
        { id: 1, fullName: 'Nguyễn Văn An', email: 'nguyenvanan@gmail.com', username: 'nguyenvanan', password: 'password123', phone: '0901234567', role: 'Admin' },
        { id: 2, fullName: 'Trần Thị Bình', email: 'tranthibinh@gmail.com', username: 'tranthibinh', password: 'mypass456', phone: '0912345678', role: 'Staff' },
        { id: 3, fullName: 'Lê Hoàng Cường', email: 'lehoangcuong@gmail.com', username: 'lehoangcuong', password: 'secure789', phone: '0923456789', role: 'Tenant' },
        { id: 4, fullName: 'Phạm Thị Dung', email: 'phamthidung@gmail.com', username: 'phamthidung', password: 'admin2024', phone: '0934567890', role: 'Admin' },
        { id: 5, fullName: 'Võ Minh Đức', email: 'vominhduc@gmail.com', username: 'vominhduc', password: 'user1234', phone: '0945678901', role: 'Staff' },
        { id: 6, fullName: 'Hoàng Thị Giang', email: 'hoangthigiang@gmail.com', username: 'hoangthigiang', password: 'pass9876', phone: '0956789012', role: 'Tenant' },
        { id: 7, fullName: 'Đặng Văn Hùng', email: 'dangvanhung@gmail.com', username: 'dangvanhung', password: 'welcome123', phone: '0967890123', role: 'Staff' },
        { id: 8, fullName: 'Bùi Thị Lan', email: 'buithilan@gmail.com', username: 'buithilan', password: 'login456', phone: '0978901234', role: 'Tenant' },
        { id: 9, fullName: 'Ngô Văn Minh', email: 'ngovanminh@gmail.com', username: 'ngovanminh', password: 'test789', phone: '0989012345', role: 'Admin' },
        { id: 10, fullName: 'Lý Thị Nga', email: 'lythinga@gmail.com', username: 'lythinga', password: 'demo2024', phone: '0990123456', role: 'Staff' },
        { id: 11, fullName: 'Trịnh Văn Phúc', email: 'trinhvanphuc@gmail.com', username: 'trinhvanphuc', password: 'system123', phone: '0901234568', role: 'Tenant' },
        { id: 12, fullName: 'Đỗ Thị Quỳnh', email: 'dothiquynh@gmail.com', username: 'dothiquynh', password: 'secret456', phone: '0912345679', role: 'Staff' },
        { id: 13, fullName: 'Vũ Văn Sang', email: 'vuvansang@gmail.com', username: 'vuvansang', password: 'access789', phone: '0923456780', role: 'Tenant' },
        { id: 14, fullName: 'Phan Thị Tâm', email: 'phanthitam@gmail.com', username: 'phanthitam', password: 'enter2024', phone: '0934567891', role: 'Admin' },
        { id: 15, fullName: 'Lại Văn Ước', email: 'laivanuoc@gmail.com', username: 'laivanuoc', password: 'login123', phone: '0945678902', role: 'Staff' },
        { id: 16, fullName: 'Mai Thị Vân', email: 'maithivan@gmail.com', username: 'maithivan', password: 'user456', phone: '0956789013', role: 'Tenant' },
        { id: 17, fullName: 'Chu Văn Xuân', email: 'chuvanxuan@gmail.com', username: 'chuvanxuan', password: 'pass789', phone: '0967890124', role: 'Staff' },
        { id: 18, fullName: 'Đinh Thị Yến', email: 'dinhthiyen@gmail.com', username: 'dinhthiyen', password: 'admin2024', phone: '0978901235', role: 'Tenant' },
        { id: 19, fullName: 'Hồ Văn Zung', email: 'hovanzung@gmail.com', username: 'hovanzung', password: 'secure123', phone: '0989012346', role: 'Admin' },
        { id: 20, fullName: 'Kim Thị An', email: 'kimthian@gmail.com', username: 'kimthian', password: 'welcome456', phone: '0990123457', role: 'Staff' }
    ];

    // Filter data based on search term
    const filteredData = userData.filter(user =>
        Object.values(user).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Pagination logic
    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
    const currentData = filteredData.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEntriesChange = (e) => {
        setEntriesPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Action handlers
    const handleView = (user) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (user) => {
        console.log('Edit user:', user);
        // Implement edit logic here
    };

    const handleDelete = (user) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.fullName}"?`)) {
            console.log('Delete user:', user);
            // Implement delete logic here
        }
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 6;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <li key={i}>
                    <button
                        className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </button>
                </li>
            );
        }
        return items;
    };

    return (
        <Container fluid className="user-management-container" style={{ minHeight: '100vh', padding: 0 }}>
            <div className="main-card shadow rounded bg-white" style={{ height: '100%', margin: 0, padding: '1rem' }}>
                <div className="header mb-3">
                    <h3 className="title">Danh sách người dùng</h3>
                </div>

                {/* Controls Row */}
                <Row className="align-items-center mb-3">
                    <Col md={6} className="d-flex align-items-center gap-2">
                        <span>Hiển thị</span>
                        <Form.Select
                            value={entriesPerPage}
                            onChange={handleEntriesChange}
                            style={{ width: 'auto' }}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </Form.Select>
                        <span>mục</span>
                    </Col>

                    <Col md={6} className="text-md-end mt-2 mt-md-0">
                        <Form.Label className="me-2">Tìm kiếm:</Form.Label>
                        <Form.Control
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Nhập từ khóa..."
                            style={{ display: 'inline-block', width: 'auto' }}
                        />
                    </Col>
                </Row>

                {/* Add User Button */}
                <div className="mb-3 text-end">
                    <Button variant="success" className="action-btn add-btn">
                        <i className="bi bi-person-plus me-2"></i>
                        Add new User
                    </Button>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <Table striped bordered hover className="data-table" style={{ width: '100%', minWidth: '100%' }}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Họ và tên</th>
                                <th>Email</th>
                                <th>Tên đăng nhập</th>
                                <th>Số điện thoại</th>
                                <th>Vai trò</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((user, index) => (
                                <tr key={user.id}>
                                    <td className="text-center">{startIndex + index + 1}</td>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.username}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button
                                                as={Link}
                                                to={`/admin/users/${user.id}`}
                                                variant="outline-primary"
                                                size="sm"
                                                title="View-Details"
                                                state={{ backgroundLocation: location }}
                                            >
                                                Xem chi tiết
                                            </Button>
                                            <Button
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={() => handleEdit(user)}
                                                title="Edit"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(user)}
                                                title="Delete"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                {/* Footer Row */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span>
                        Hiển thị {startIndex + 1} đến {endIndex} trong tổng số {totalEntries} mục
                    </span>

                    <Pagination>
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {renderPaginationItems()}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            </div>
        </Container>
    );
};

export default UserManagement;