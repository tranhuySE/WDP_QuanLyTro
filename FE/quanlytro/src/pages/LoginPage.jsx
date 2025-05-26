import React, { useState } from "react";
import { Form, Button, ProgressBar, Container } from "react-bootstrap";

export default function LoginWithProgress() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Giả lập delay login, ví dụ 3 giây
    setTimeout(() => {
      setLoading(false);
      alert("Login giả lập thành công!");
      // Ở đây có thể redirect hoặc làm gì đó sau login
    }, 3000);
  };

  return (
    <Container style={{ maxWidth: "400px", marginTop: "50px" }}>
      {!loading ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Control type="text" placeholder="Username" required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Control type="password" placeholder="Password" required />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      ) : (
        <ProgressBar animated now={100} label="Đang đăng nhập..." />
      )}
    </Container>
  );
}
