import { useState } from 'react';
import '../../../styles/Admin/User/UserManagement.css'; // Adjust the path as necessary

const UserManagement = () => {
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [visiblePasswords, setVisiblePasswords] = useState({});

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
        console.log('View user:', user);
        // Implement view logic here
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
        <div className="user-management">
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <div className="main-card">

                            <div className="header">
                                <h3 className="title">Danh sách người dùng</h3>
                            </div>

                            {/* Controls Row */}
                            <div className="controls-row">
                                <div className="entries-control">
                                    <span className="control-label">Hiển thị</span>
                                    <select
                                        className="entries-select"
                                        value={entriesPerPage}
                                        onChange={handleEntriesChange}
                                    >
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                    <span className="control-label">mục</span>
                                </div>

                                <div className="search-control">
                                    <span className="control-label">Tìm kiếm:</span>
                                    <input
                                        type="text"
                                        className="search-input"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        placeholder="Nhập từ khóa..."
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="table-container">
                                <button
                                    label="Add User"
                                    className="action-btn add-btn"
                                    title="Add"
                                >
                                    <i className="bi bi-person-plus"></i>
                                    Add new User
                                </button>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th className="table-header">STT</th>
                                            <th className="table-header">Họ và tên</th>
                                            <th className="table-header">Email</th>
                                            <th className="table-header">Tên đăng nhập</th>
                                            <th className="table-header">Số điện thoại</th>
                                            <th className="table-header">Vai trò</th>
                                            <th className="table-header">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((user, index) => (
                                            <tr key={user.id} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                                                <td className="table-cell text-center">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="table-cell">{user.fullName}</td>
                                                <td className="table-cell">{user.email}</td>
                                                <td className="table-cell">{user.username}</td>
                                                <td className="table-cell">{user.phone}</td>
                                                <td className="table-cell">{user.role}</td>
                                                <td className="table-cell">
                                                    <div className="action-buttons">
                                                        <button
                                                            className="action-btn view-btn"
                                                            onClick={() => handleView(user)}
                                                            title="View-Details"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </button>
                                                        <button
                                                            className="action-btn edit-btn"
                                                            onClick={() => handleEdit(user)}
                                                            title="Edit"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button
                                                            className="action-btn delete-btn"
                                                            onClick={() => handleDelete(user)}
                                                            title="Delete"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer Row */}
                            <div className="footer-row">
                                <span className="entries-info">
                                    Hiển thị {startIndex + 1} đến {endIndex} trong tổng số {totalEntries} mục
                                </span>

                                <nav>
                                    <ul className="pagination">
                                        <li>
                                            <button
                                                className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                                                disabled={currentPage === 1}
                                                onClick={() => handlePageChange(currentPage - 1)}
                                            >
                                                Trước
                                            </button>
                                        </li>

                                        {renderPaginationItems()}

                                        <li>
                                            <button
                                                className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                                                disabled={currentPage === totalPages}
                                                onClick={() => handlePageChange(currentPage + 1)}
                                            >
                                                Sau
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;