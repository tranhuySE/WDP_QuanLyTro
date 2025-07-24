import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { CheckCircle } from 'react-bootstrap-icons';
import { useEffect } from 'react';
import { updateInvoiceStatus } from '../../api/invoiceAPI';
import { toast } from 'react-toastify';
import { message } from 'antd';
import { useState } from 'react';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('id');
    const orderCode = queryParams.get('orderCode');
    const status = queryParams.get('status');
    const code = queryParams.get('code');
    const invoiceId = localStorage.getItem('invoiceId');
    const userId = localStorage.getItem('id');
    const [isDisabled, setIsDisabled] = useState(true);
    const updateStatusInvoice = async () => {
        try {
            const res = await updateInvoiceStatus(invoiceId, userId);
            if (res.status === 200) {
                localStorage.removeItem('invoiceId');
                return toast.success('Đã cập nhật trạng thái đơn hàng!');
            }
        } catch (error) {
            return toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        updateStatusInvoice();
        const timer = setTimeout(() => {
            setIsDisabled(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh' }}
        >
            <Row>
                <Col>
                    <div className="text-center p-4">
                        <CheckCircle color="green" size={60} className="mx-auto mb-3" />
                        <h2 className="text-success">Thanh toán thành công</h2>
                        <p className="text-muted">Cảm ơn bạn đã hoàn tất thanh toán.</p>

                        <div className="text-start mt-4">
                            <p>
                                <strong>Mã đơn hàng:</strong> {orderCode}
                            </p>
                            <p>
                                <strong>ID giao dịch:</strong> {orderId}
                            </p>
                            <p>
                                <strong>Trạng thái:</strong>
                                <Badge bg="success" className="ms-2">
                                    {status}
                                </Badge>
                            </p>
                            <p>
                                <strong>Mã phản hồi:</strong> {code}
                            </p>
                        </div>

                        <Button
                            variant="success"
                            className="mt-3"
                            onClick={() => navigate('/tenant/room-invoice')}
                            disabled={isDisabled}
                        >
                            Quay về
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default PaymentSuccess;
