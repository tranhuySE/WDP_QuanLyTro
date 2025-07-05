import {
    AlertTriangle,
    CheckCircle,
    ClipboardList,
    Info,
    Pin
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Card, Container, ListGroup } from 'react-bootstrap';
import { getAllPosts, getAllTags } from '../../api/postAPI';

const HomePage = () => {
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


        </Container>
    );
};

export default HomePage;