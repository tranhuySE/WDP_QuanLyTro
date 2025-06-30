import {
    AlertTriangle,
    Bell,
    CheckCircle,
    ClipboardList,
    Edit,
    Info,
    MoreVertical,
    Pin,
    Plus,
    Trash2,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Card, Container, Dropdown, Form, ListGroup, Modal } from 'react-bootstrap';
import { createPost, deletePost, getAllPosts, getAllTags, updatePost } from '../../api/postAPI';

const AdminHomePage = () => {
    // State for announcements and tags
    const [announcements, setAnnouncements] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch announcements and tags from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both posts and tags in parallel
                const [postsResponse, tagsResponse] = await Promise.all([
                    getAllPosts(),
                    getAllTags()
                ]);

                // Transform API data
                const transformedData = postsResponse.data.map(post => ({
                    id: post._id,
                    title: post.title,
                    content: post.content,
                    tag: post.tag || 'Thông báo', // Default to 'Thông báo' if no tag
                    date: new Date(post.createdAt).toLocaleDateString('vi-VN'),
                    author: post.author?.fullname || 'Ban quản lý',
                    pinned: post.pinned,
                    createdAt: post.createdAt
                }));

                setAnnouncements(transformedData);
                setTags(tagsResponse.data); // Set tags from API response
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Get icon by tag
    const getIconByTag = (tag) => {
        switch (tag) {
            case 'Cảnh báo':
                return <AlertTriangle size={20} className="text-warning me-2" />;
            case 'Nhắc nhở':
                return <AlertTriangle size={20} className="text-warning me-2" />;
            case 'Tin tức':
                return <CheckCircle size={20} className="text-success me-2" />;
            case 'Quy định':
                return <Info size={20} className="text-primary me-2" />;
            default:
                return <Info size={20} className="text-info me-2" />;
        }
    };

    // Get border color based on tag and pinned status
    const getBorderColor = (announcement) => {
        if (announcement.pinned) return '3px solid #FFC107';
        switch (announcement.tag) {
            case 'Cảnh báo':
            case 'Nhắc nhở':
                return '2px solid #FD7E14';
            case 'Tin tức':
                return '2px solid #20C997';
            case 'Quy định':
                return '2px solid #0D6EFD';
            default:
                return '2px solid #6C757D';
        }
    };

    // State for modals
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // State for current announcement being edited/deleted
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        tag: 'Thông báo' // Default tag
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
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
            setError('Vui lòng nhập đầy đủ tiêu đề và nội dung');
            return;
        }

        try {
            // Lấy thông tin người dùng hiện tại từ localStorage hoặc context
            // Giả sử bạn lưu thông tin user trong localStorage với key 'user'
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user || !user._id) {
                throw new Error('Không tìm thấy thông tin người dùng');
            }

            const response = await createPost({
                title: newAnnouncement.title,
                content: newAnnouncement.content,
                tag: newAnnouncement.tag,
                pinned: false,
                author: user._id
            });

            // Add the new post to our state
            const newPost = {
                id: response.data._id,
                title: response.data.title,
                content: response.data.content,
                tag: response.data.tag,
                date: new Date(response.data.createdAt).toLocaleDateString('vi-VN'),
                author: user.fullname || 'Ban quản lý', // Sử dụng tên người dùng thực tế
                pinned: response.data.pinned,
                createdAt: response.data.createdAt
            };

            setAnnouncements([newPost, ...announcements]);
            setNewAnnouncement({
                title: '',
                content: '',
                tag: 'Thông báo'
            });
            setShowModal(false);
            setError(null);
        } catch (err) {
            console.error('Error creating post:', err);
            setError(err.message || 'Tạo thông báo thất bại. Vui lòng thử lại.');
        }
    };

    // Handle edit announcement
    const handleEdit = (announcement) => {
        setCurrentAnnouncement(announcement);
        setShowEditModal(true);
    };

    // Handle save edited announcement
    const handleSaveEdit = async (e) => {
        e.preventDefault();

        if (!currentAnnouncement.title.trim() || !currentAnnouncement.content.trim()) {
            setError('Vui lòng nhập đầy đủ tiêu đề và nội dung');
            return;
        }

        try {
            await updatePost(currentAnnouncement.id, {
                title: currentAnnouncement.title,
                content: currentAnnouncement.content,
                tag: currentAnnouncement.tag
            });

            // Update the announcement in our state
            setAnnouncements(announcements.map(a =>
                a.id === currentAnnouncement.id ? {
                    ...currentAnnouncement,
                    date: new Date().toLocaleDateString('vi-VN')
                } : a
            ));
            setShowEditModal(false);
            setCurrentAnnouncement(null);
            setError(null);
        } catch (err) {
            console.error('Error updating post:', err);
            setError('Cập nhật thông báo thất bại. Vui lòng thử lại.');
        }
    };

    // Handle delete confirmation
    const handleDeleteClick = (announcement) => {
        setCurrentAnnouncement(announcement);
        setShowDeleteModal(true);
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        try {
            await deletePost(currentAnnouncement.id);
            setAnnouncements(announcements.filter(a => a.id !== currentAnnouncement.id));
            setShowDeleteModal(false);
            setCurrentAnnouncement(null);
            setError(null);
        } catch (err) {
            console.error('Error deleting post:', err);
            setError('Xóa thông báo thất bại. Vui lòng thử lại.');
        }
    };

    // Handle pin/unpin announcement
    const togglePin = async (id) => {
        try {
            const announcement = announcements.find(a => a.id === id);
            const updatedPinStatus = !announcement.pinned;

            await updatePost(id, {
                pinned: updatedPinStatus
            });

            setAnnouncements(announcements.map(a =>
                a.id === id ? { ...a, pinned: updatedPinStatus } : a
            ));
        } catch (err) {
            console.error('Error toggling pin:', err);
            setError('Thay đổi trạng thái ghim thất bại. Vui lòng thử lại.');
        }
    };

    // Sort announcements: pinned first, then by date (newest first)
    const sortedAnnouncements = [...announcements].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    if (loading) {
        return (
            <Container className="py-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Đang tải thông báo...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-4 text-center text-danger">
                <p>{error}</p>
                <Button variant="primary" onClick={() => window.location.reload()}>
                    Thử lại
                </Button>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    <ClipboardList size={28} className="me-2 text-primary" />
                    Thông Báo Chung Cư
                </h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} className="me-1" />
                    Thêm Thông Báo
                </Button>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="alert alert-danger mb-4">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
            )}

            {/* Announcements List */}
            <ListGroup>
                {sortedAnnouncements.length > 0 ? (
                    sortedAnnouncements.map(announcement => (
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
                                        {getIconByTag(announcement.tag)}
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
                                            <small className="text-muted d-block mb-2">
                                                {announcement.date} • {announcement.tag}
                                            </small>
                                            <div className="mb-2" style={{ whiteSpace: 'pre-line' }}>
                                                {announcement.content}
                                            </div>
                                            <small className="text-muted">Đăng bởi: {announcement.author}</small>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </ListGroup.Item>
                    ))
                ) : (
                    <div className="text-center py-4">
                        <p>Chưa có thông báo nào.</p>
                    </div>
                )}
            </ListGroup>

            {/* Add Announcement Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <Bell className="me-2" />
                        Thêm Thông Báo Mới
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Tiêu đề</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={newAnnouncement.title}
                                onChange={handleInputChange}
                                placeholder="Nhập tiêu đề thông báo"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nội dung</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="content"
                                value={newAnnouncement.content}
                                onChange={handleInputChange}
                                placeholder="Nhập nội dung thông báo"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Loại thông báo</Form.Label>
                            <Form.Select
                                name="tag"
                                value={newAnnouncement.tag}
                                onChange={handleInputChange}
                                required
                            >
                                {tags.map((tag, index) => (
                                    <option key={index} value={tag}>{tag}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            <X className="me-1" />
                            Hủy
                        </Button>
                        <Button variant="primary" type="submit">
                            Đăng Thông Báo
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Edit Announcement Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <Edit className="me-2" />
                        Chỉnh Sửa Thông Báo
                    </Modal.Title>
                </Modal.Header>
                {currentAnnouncement && (
                    <Form onSubmit={handleSaveEdit}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Tiêu đề</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={currentAnnouncement.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Nội dung</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    name="content"
                                    value={currentAnnouncement.content}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Loại thông báo</Form.Label>
                                <Form.Select
                                    name="tag"
                                    value={currentAnnouncement.tag}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {tags.map((tag, index) => (
                                        <option key={index} value={tag}>{tag}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                <X className="me-1" />
                                Hủy
                            </Button>
                            <Button variant="primary" type="submit">
                                Lưu Thay Đổi
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <Trash2 className="me-2 text-danger" />
                        Xác Nhận Xóa
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa thông báo "{currentAnnouncement?.title}" không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        <X className="me-1" />
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        <Trash2 className="me-1" />
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminHomePage;