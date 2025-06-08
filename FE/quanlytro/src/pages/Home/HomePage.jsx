import React, { useState } from "react";
import { Container, Accordion, Badge } from "react-bootstrap";
import "./HomePage.css";

const HomePage = () => {
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
      author: "Admin",
    },
  ];

  const [posts, setPosts] = useState(data);

  return (
    <Container className="mt-3">
      <h3 className="mb-4 text-primary">📢 Thông báo & Bài viết</h3>

      {posts.length === 0 ? (
        <p>Không có thông báo nào.</p>
      ) : (
        <Accordion defaultActiveKey={null}>
          {posts.map((post, index) => (
            <Accordion.Item
              eventKey={index.toString()}
              key={post.id}
              className="mb-3 hover-accordion"
            >
              <Accordion.Header>
                <div className="w-100 d-flex justify-content-between align-items-center px-2">
                  <span className="fw-semibold text-dark">{post.title}</span>
                  <Badge bg="secondary" className="ms-2">
                    {post.date}
                  </Badge>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <p>{post.content}</p>
                <p className="text-muted mb-0">✍️ Tác giả: {post.author}</p>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default HomePage;
