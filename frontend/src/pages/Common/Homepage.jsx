import {
    AlertTriangle,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    ClipboardList,
    Info,
    Pin
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Card, Container, ListGroup } from 'react-bootstrap';
import { getAllPosts, getAllTags } from '../../api/postAPI';

const HomePage = () => {
    // State
    const [announcements, setAnnouncements] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedAnnouncements, setExpandedAnnouncements] = useState(new Set());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsResponse, tagsResponse] = await Promise.all([
                    getAllPosts(),
                    getAllTags()
                ]);

                const transformedData = postsResponse.data.map(post => ({
                    id: post._id,
                    title: post.title,
                    content: post.content,
                    tag: post.tag || 'Thông báo',
                    date: new Date(post.createdAt).toLocaleDateString('vi-VN'),
                    author: post.author?.fullname || 'Ban quản lý',
                    pinned: post.pinned,
                    createdAt: post.createdAt
                }));

                setAnnouncements(transformedData);
                setTags(tagsResponse.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    //check độ dài
    const isContentLong = (content) => {
        return content.length > 200 || content.split('\n').length > 3;
    };

    //cắt ngắn nội dung
    const getTruncatedContent = (content) => {
        const lines = content.split('\n');
        if (lines.length > 3) {
            return lines.slice(0, 3).join('\n') + '...';
        }
        if (content.length > 200) {
            return content.substring(0, 200) + '...';
        }
        return content;
    };

    const toggleExpanded = (announcementId) => {
        const newExpanded = new Set(expandedAnnouncements);
        if (newExpanded.has(announcementId)) {
            newExpanded.delete(announcementId);
        } else {
            newExpanded.add(announcementId);
        }
        setExpandedAnnouncements(newExpanded);
    };

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



    // sắp xếp thông báo
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
                    sortedAnnouncements.map(announcement => {
                        const isExpanded = expandedAnnouncements.has(announcement.id);
                        const isLong = isContentLong(announcement.content);

                        return (
                            <ListGroup.Item
                                key={announcement.id}
                                className="mb-3 rounded position-relative p-0 overflow-visible"
                                style={{
                                    border: getBorderColor(announcement),
                                    boxShadow: announcement.pinned ? '0 0.5rem 1rem rgba(255, 193, 7, 0.15)' : 'none',
                                    zIndex: 0
                                }}
                            >

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
                                                    {isLong && !isExpanded
                                                        ? getTruncatedContent(announcement.content)
                                                        : announcement.content
                                                    }
                                                </div>
                                                <div>
                                                    {isLong && (
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            className="p-0 mb-2 text-primary"
                                                            onClick={() => toggleExpanded(announcement.id)}
                                                            style={{ textDecoration: 'none' }}
                                                        >
                                                            {isExpanded ? (
                                                                <>
                                                                    <ChevronUp size={16} className="me-1" />
                                                                    Thu gọn
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ChevronDown size={16} className="me-1" />
                                                                    Xem thêm
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>
                                                <small className="text-muted">Đăng bởi: {announcement.author} - Quản trị viên</small>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </ListGroup.Item>
                        )
                    })
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