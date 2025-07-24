import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { XCircle } from 'react-bootstrap-icons';
import { useEffect } from 'react';

const CancelPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const orderId = queryParams.get('id');
    const orderCode = queryParams.get('orderCode');
    const status = queryParams.get('status');
    const code = queryParams.get('code');
    const cancel = queryParams.get('cancel');

    useEffect(() => {
        localStorage.removeItem('invoiceId');
    }, []);

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh' }}
        >
            <Row>
                <Col>
                    <div className="text-center">
                        <XCircle color="red" size={60} className="mx-auto mb-3" />
                        <h2 className="text-danger">Thanh toán đã bị hủy</h2>
                        <p className="text-muted">Bạn đã hủy thanh toán đơn hàng của mình.</p>

                        <div className="text-start mt-4">
                            <p>
                                <strong>Mã đơn hàng:</strong> {orderCode}
                            </p>
                            <p>
                                <strong>ID giao dịch:</strong> {orderId}
                            </p>
                            <p>
                                <strong>Trạng thái:</strong>
                                <Badge bg="danger" className="ms-2">
                                    {status}
                                </Badge>
                            </p>
                            <p>
                                <strong>Mã phản hồi:</strong> {code}
                            </p>
                        </div>

                        <Button
                            variant="secondary"
                            className="mt-3"
                            onClick={() => navigate('/tenant/room-invoice')}
                        >
                            Quay về
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CancelPayment;
