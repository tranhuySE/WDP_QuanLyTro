import {
    AlertTriangle,
    CheckCircle,
    ClipboardList,
    Edit,
    Info,
    MoreVertical,
    Pin,
    Trash2
} from 'lucide-react';
import { useState } from 'react';
import { Card, Container, Dropdown, ListGroup } from 'react-bootstrap';

const Homepage = () => {
    // State for announcements
    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            title: 'Mất điện từ 14h-16h ngày 15/6',
            content: 'Sẽ có kế hoạch bảo trì hệ thống điện toà nhà từ 14h đến 16h ngày 15/6. Xin cư dân lưu ý và chuẩn bị.',
            type: 'warning',
            date: '10/6/2023',
            author: 'Ban quản lý',
            pinned: true
        },
        {
            id: 2,
            title: 'Thông báo thu phí dịch vụ tháng 6',
            content: 'Kính nhờ cư dân nộp phí dịch vụ tháng 6 trước ngày 10/6. Mọi thắc mắc vui lòng liên hệ bộ phận quản lý.',
            type: 'info',
            date: '1/6/2023',
            author: 'Kế toán',
            pinned: false
        },
        {
            id: 3,
            title: 'Hoàn thành sửa chữa thang máy',
            content: 'Thang máy tòa A đã được sửa chữa xong và hoạt động bình thường trở lại.',
            type: 'success',
            date: '25/5/2023',
            author: 'Kỹ thuật',
            pinned: false
        }
    ]);

    // State for modals
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // State for current announcement being edited/deleted
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        type: 'info'
    });

    // Handle input change for new/edit announcement
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (currentAnnouncement) {
            setCurrentAnnouncement({
                ...currentAnnouncement,
                [name]: value
            });
        } else {
            setNewAnnouncement({
                ...newAnnouncement,
                [name]: value
            });
        }
    };

    // Handle submit new announcement
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) return;

        const announcement = {
            id: Math.max(...announcements.map(a => a.id), 0) + 1,
            title: newAnnouncement.title,
            content: newAnnouncement.content,
            type: newAnnouncement.type,
            date: new Date().toLocaleDateString('vi-VN'),
            author: 'Ban quản lý',
            pinned: false
        };

        setAnnouncements([announcement, ...announcements]);
        setNewAnnouncement({
            title: '',
            content: '',
            type: 'info'
        });
        setShowModal(false);
    };

    // Handle edit announcement
    const handleEdit = (announcement) => {
        setCurrentAnnouncement({ ...announcement });
        setShowEditModal(true);
    };

    // Handle save edited announcement
    const handleSaveEdit = (e) => {
        e.preventDefault();

        if (!currentAnnouncement.title.trim() || !currentAnnouncement.content.trim()) return;

        setAnnouncements(announcements.map(a =>
            a.id === currentAnnouncement.id ? currentAnnouncement : a
        ));
        setShowEditModal(false);
        setCurrentAnnouncement(null);
    };

    // Handle pin/unpin announcement
    const togglePin = (id) => {
        setAnnouncements(announcements.map(a =>
            a.id === id ? { ...a, pinned: !a.pinned } : a
        ));
    };

    // Get icon by announcement type
    const getIconByType = (type) => {
        switch (type) {
            case 'warning':
                return <AlertTriangle size={20} className="text-warning me-2" />;
            case 'success':
                return <CheckCircle size={20} className="text-success me-2" />;
            default:
                return <Info size={20} className="text-info me-2" />;
        }
    };

    // Get border color based on type and pinned status
    const getBorderColor = (announcement) => {
        if (announcement.pinned) return '3px solid #FFC107'; // Màu vàng cho thông báo ghim
        switch (announcement.type) {
            case 'warning': return '2px solid #FD7E14';
            case 'success': return '2px solid #20C997';
            default: return '2px solid #0D6EFD';
        }
    };

    // Sort announcements: pinned first, then by date (newest first)
    const sortedAnnouncements = [...announcements].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.date.split('/').reverse().join('/')) - new Date(a.date.split('/').reverse().join('/'));
    });

    return (
        <Container className="py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    <ClipboardList size={28} className="me-2 text-primary" />
                    Thông Báo Chung Cư
                </h2>
            </div>

            {/* Announcements List */}
            <ListGroup>
                {sortedAnnouncements.map(announcement => (
                    <ListGroup.Item
                        key={announcement.id}
                        className="mb-3 rounded position-relative p-0 overflow-visible"
                        style={{
                            border: getBorderColor(announcement),
                            boxShadow: announcement.pinned ? '0 0.5rem 1rem rgba(255, 193, 7, 0.15)' : 'none',
                            zIndex: 0
                        }}
                    >
                        {/* Pin icon in top-left corner */}
                        {announcement.pinned && (
                            <div className="position-absolute top-0 start-0 bg-warning rounded-circle p-2 shadow"
                                style={{
                                    zIndex: 1,
                                    transform: 'translate(-30%, -30%)',
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePin(announcement.id);
                                }}
                                title="Bỏ ghim">
                                <Pin size={20} className="text-white" fill="white" />
                            </div>
                        )}

                        <Card className="border-0">
                            <Card.Body className={announcement.pinned ? "bg-warning bg-opacity-10" : ""}>
                                <div className="d-flex align-items-start" style={{ marginLeft: '10px' }}>
                                    {getIconByType(announcement.type)}
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h5 className="mb-1">{announcement.title}</h5>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="light" size="sm" className="p-1">
                                                    <MoreVertical size={18} />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleEdit(announcement)}>
                                                        <Edit size={16} className="me-2" /> Sửa
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => togglePin(announcement.id)}>
                                                        <Pin size={16} className="me-2" />
                                                        {announcement.pinned ? 'Bỏ ghim' : 'Ghim'}
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() => handleDeleteClick(announcement)}
                                                        className="text-danger"
                                                    >
                                                        <Trash2 size={16} className="me-2" /> Xóa
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        <small className="text-muted d-block mb-2">{announcement.date}</small>
                                        <p className="mb-2">{announcement.content}</p>
                                        <small className="text-muted">Đăng bởi: {announcement.author}</small>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </ListGroup.Item>
                ))}
            </ListGroup>

        </Container>
    );
};

export default Homepage;