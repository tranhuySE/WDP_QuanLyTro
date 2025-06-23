import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Pagination, Row, Table } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { deleteUserById, getAllUsers } from '../../../api/userAPI.js'; // Adjust the import path as necessary
import '../../../styles/Admin/User/UserManagement.css'; // Adjust the path as necessary

const UserManagement = () => {
    const location = useLocation();
    const [users, setUsers] = useState([]); // State to hold user data

    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // State for UserDetail modal
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        getAllUsers()
            .then((response) => {
                setUsers(response.data); // giả sử response.data là mảng
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách người dùng:', error);
            });
    }, []);


    const filteredData = users.filter(user =>
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
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.fullname}"?`)) {
        deleteUserById(user._id)
            .then(() => {
                alert('Xóa người dùng thành công!');
                // Xóa khỏi danh sách hiện tại trên frontend
                setUsers(prevUsers => prevUsers.filter(u => u._id !== user._id));
            })
            .catch((error) => {
                console.error('Lỗi khi xóa người dùng:', error);
                alert('Đã xảy ra lỗi khi xóa người dùng.');
            });
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
                                    <td>{user.fullname}</td>
                                    <td>{user.email}</td>
                                    <td>{user.username}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button
                                                as={Link}
                                                to={`/admin/users/${user._id}`}
                                                variant="outline-primary"
                                                size="sm"
                                                title="View-Details"
                                                state={{ backgroundLocation: location }}
                                            >
                                                Xem chi tiết
                                            </Button>
                                            {/* <Button
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={() => handleEdit(user)}
                                                title="Edit"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </Button> */}
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(user)}
                                                title="Delete"
                                            >
                                                Xóa
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