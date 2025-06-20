import { useState } from "react";
import { Accordion, Badge, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Calendar2Date, PencilSquare, PersonCircle, Trash } from "react-bootstrap-icons";
import "../../styles/Common/HomePage.css";

const HomePage = () => {
    // Dữ liệu khởi tạo
    const data = [
        {
            id: 1,
            title: "Thông báo về thời gian đóng tiền phòng tháng 5",
            content:
                "Kính gửi các bạn sinh viên, hạn đóng tiền phòng là ngày 5 hàng tháng. Vui lòng thực hiện đúng hạn để tránh bị phạt và đảm bảo quyền lợi lưu trú của bạn.",
            date: "2025-05-25",
            author: "Ban quản lý",
        },
        {
            id: 2,
            title: "Hướng dẫn sử dụng hệ thống quản lý trọ",
            content:
                "Để sử dụng hệ thống, bạn cần đăng nhập bằng tài khoản sinh viên được cấp. Sau đó bạn có thể xem hóa đơn, lịch sử thanh toán và các thông tin phòng.",
            date: "2025-05-24",
            author: "Ban quản lý",
        },
        {
            id: 2,
            title: "Hướng dẫn sử dụng hệ thống quản lý trọ",
            content:
                "Để sử dụng hệ thống, bạn cần đăng nhập bằng tài khoản sinh viên được cấp. Sau đó bạn có thể xem hóa đơn, lịch sử thanh toán và các thông tin phòng.",
            date: "2025-05-24",
            author: "Ban quản lý",
        },
        {
            id: 2,
            title: "Hướng dẫn sử dụng hệ thống quản lý trọ",
            content:
                "Để sử dụng hệ thống, bạn cần đăng nhập bằng tài khoản sinh viên được cấp. Sau đó bạn có thể xem hóa đơn, lịch sử thanh toán và các thông tin phòng.",
            date: "2025-05-24",
            author: "Ban quản lý",
        },
        {
            id: 2,
            title: "Hướng dẫn sử dụng hệ thống quản lý trọ",
            content:
                "Để sử dụng hệ thống, bạn cần đăng nhập bằng tài khoản sinh viên được cấp. Sau đó bạn có thể xem hóa đơn, lịch sử thanh toán và các thông tin phòng.",
            date: "2025-05-24",
            author: "Ban quản lý",
        },
        {
            id: 2,
            title: "Hướng dẫn sử dụng hệ thống quản lý trọ",
            content:
                "Để sử dụng hệ thống, bạn cần đăng nhập bằng tài khoản sinh viên được cấp. Sau đó bạn có thể xem hóa đơn, lịch sử thanh toán và các thông tin phòng.",
            date: "2025-05-24",
            author: "Ban quản lý",
        },
        {
            id: 2,
            title: "Hướng dẫn sử dụng hệ thống quản lý trọ",
            content:
                "Để sử dụng hệ thống, bạn cần đăng nhập bằng tài khoản sinh viên được cấp. Sau đó bạn có thể xem hóa đơn, lịch sử thanh toán và các thông tin phòng.",
            date: "2025-05-24",
            author: "Ban quản lý",
        },
        {
            id: 2,
            title: "Hướng dẫn sử dụng hệ thống quản lý trọ",
            content:
                "Để sử dụng hệ thống, bạn cần đăng nhập bằng tài khoản sinh viên được cấp. Sau đó bạn có thể xem hóa đơn, lịch sử thanh toán và các thông tin phòng.",
            date: "2025-05-24",
            author: "Ban quản lý",
        },
    ];

    // State quản lý posts
    const [posts, setPosts] = useState(data);

    // State quản lý form tạo/sửa bài
    const [form, setForm] = useState({ id: null, title: "", content: "", date: "", author: "Ban quản lý" });

    // State để phân biệt đang ở chế độ edit hay tạo mới
    const [isEditing, setIsEditing] = useState(false);

    // Hàm xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Thêm bài mới
    const handleCreate = () => {
        if (!form.title.trim() || !form.content.trim() || !form.date.trim()) {
            alert("Vui lòng điền đầy đủ tiêu đề, nội dung và ngày tháng.");
            return;
        }
        const newPost = {
            id: Date.now(),
            title: form.title,
            content: form.content,
            date: form.date,
            author: form.author,
        };
        setPosts((prev) => [newPost, ...prev]);
        setForm({ id: null, title: "", content: "", date: "", author: "Ban quản lý" });
    };

    // Bắt đầu chỉnh sửa
    const handleEditClick = (post) => {
        setIsEditing(true);
        setForm(post);
    };

    // Lưu bài chỉnh sửa
    const handleUpdate = () => {
        if (!form.title.trim() || !form.content.trim() || !form.date.trim()) {
            alert("Vui lòng điền đầy đủ tiêu đề, nội dung và ngày tháng.");
            return;
        }
        setPosts((prev) =>
            prev.map((p) => (p.id === form.id ? { ...p, title: form.title, content: form.content, date: form.date } : p))
        );
        setForm({ id: null, title: "", content: "", date: "", author: "Ban quản lý" });
        setIsEditing(false);
    };

    // Hủy chỉnh sửa
    const handleCancelEdit = () => {
        setForm({ id: null, title: "", content: "", date: "", author: "Ban quản lý" });
        setIsEditing(false);
    };

    // Xóa bài viết
    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa bài thông báo này?")) {
            setPosts((prev) => prev.filter((p) => p.id !== id));
        }
    };

    return (
        <Container className="mt-5 mb-5">
            <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">📢 Bảng tin thông báo</h2>
                <p className="text-muted">Cập nhật mới nhất từ Ban quản lý và hệ thống.</p>
            </div>

            {/* Form tạo / chỉnh sửa */}
            <Card className="mb-4">
                <Card.Body>
                    <h5 className="mb-3">{isEditing ? "✏️ Chỉnh sửa bài thông báo" : "✍️ Thêm bài thông báo mới"}</h5>
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Control
                                type="text"
                                placeholder="Tiêu đề"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col md={3}>
                            {/* Author cố định */}
                            <Form.Control type="text" value={form.author} disabled />
                        </Col>
                        <Col md={12}>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Nội dung"
                                name="content"
                                value={form.content}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col className="text-end">
                            {isEditing ? (
                                <>
                                    <Button variant="success" className="me-2" onClick={handleUpdate}>
                                        Lưu
                                    </Button>
                                    <Button variant="secondary" onClick={handleCancelEdit}>
                                        Hủy
                                    </Button>
                                </>
                            ) : (
                                <Button variant="primary" onClick={handleCreate}>
                                    Thêm bài
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Danh sách bài post */}
            {posts.length === 0 ? (
                <p className="text-center text-muted">Không có thông báo nào.</p>
            ) : (
                <Accordion defaultActiveKey={null} alwaysOpen>
                    {posts.map((post, index) => (
                        <Accordion.Item
                            eventKey={index.toString()}
                            key={post.id}
                            className="custom-accordion-item"
                        >
                            <Accordion.Header>
                                <Row className="w-100 align-items-center">
                                    <Col xs={12} md={8} className="fw-semibold d-flex align-items-center">
                                        {post.title}
                                        {/* Nút chỉnh sửa */}
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="ms-2 text-primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClick(post);
                                            }}
                                            title="Chỉnh sửa"
                                        >
                                            <PencilSquare />
                                        </Button>
                                        {/* Nút xóa */}
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="ms-1 text-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(post.id);
                                            }}
                                            title="Xóa"
                                        >
                                            <Trash />
                                        </Button>
                                    </Col>
                                    <Col xs={12} md={4} className="text-md-end mt-2 mt-md-0">
                                        <Badge bg="light" text="dark" className="me-2">
                                            <Calendar2Date className="me-1" />
                                            {new Date(post.date).toLocaleDateString("vi-VN")}
                                        </Badge>
                                        <Badge bg="light" text="dark">
                                            <PersonCircle className="me-1" />
                                            {post.author}
                                        </Badge>
                                    </Col>
                                </Row>
                            </Accordion.Header>
                            <Accordion.Body className="fade-in">
                                <Card className="border-0">
                                    <Card.Body>
                                        <p className="mb-0">{post.content}</p>
                                    </Card.Body>
                                </Card>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            )}
        </Container>
    );
};

export default HomePage;
