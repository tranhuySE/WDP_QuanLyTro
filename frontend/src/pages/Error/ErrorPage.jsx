import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Container
            className="text-center d-flex align-items-center justify-content-center"
            style={{ minHeight: '100vh' }}
        >
            <Row>
                <Col>
                    <Image
                        src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                        alt="404 Not Found"
                        width={150}
                        className="mb-4"
                    />
                    <h1 className="display-4">404 - Không tìm thấy trang</h1>
                    <p className="lead">Trang bạn truy cập không tồn tại hoặc đã bị xóa.</p>
                    <div className="d-flex justify-content-center gap-2 mt-3">
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                            ⬅ Quay lại
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFoundPage;
