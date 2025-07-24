import { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    ListGroup,
    Badge,
    Alert,
    Spinner,
    Accordion,
} from 'react-bootstrap';
import moment from 'moment';
import { createPayment, getInvoicesByUserId } from '../../api/invoiceAPI';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { toast } from 'react-toastify';

const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem('id');

    useEffect(() => {
        fetchInvoices();
    }, [userId]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const res = await getInvoicesByUserId(userId);
            setInvoices(res.data);
        } catch (err) {
            setError('Không thể tải danh sách hóa đơn.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayNow = async (invoice) => {
        localStorage.setItem('invoiceId', invoice._id);
        try {
            const response = await createPayment(invoice._id, userId);
            const paymentLink = response.data?.paymentLink;
            if (paymentLink) {
                window.open(paymentLink, '_blank'); // Mở tab mới
            } else {
                toast.error('Không thể lấy link thanh toán.');
            }
        } catch (err) {
            toast.error(`Không thể tạo thanh toán: ${err.response?.data?.message || err.message}`);
        }
    };

    const invoiceTypeLabels = {
        service: 'Hóa đơn dịch vụ',
        penalty: 'Hóa đơn phạt',
        repair: 'Hóa đơn sửa chữa',
        other: 'Hóa đơn khác',
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
                <div>Đang tải hóa đơn...</div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            <h3 className="text-center mb-4">Hóa đơn của bạn</h3>
            <Accordion>
                {invoices.map((inv, idx) => (
                    <Accordion.Item key={inv._id} eventKey={idx.toString()}>
                        <Accordion.Header>
                            <div className="d-flex justify-content-between w-100">
                                <div>
                                    <strong>Phòng:</strong> {inv.for_room_id.roomNumber} |{' '}
                                    <strong>Loại:</strong>{' '}
                                    {invoiceTypeLabels[inv.invoice_type] || 'Không xác định'}
                                </div>
                                <Badge
                                    className="mx-1"
                                    bg={inv.payment_status === 'paid' ? 'success' : 'warning'}
                                >
                                    {inv.payment_status === 'paid'
                                        ? 'Đã thanh toán'
                                        : 'Chưa thanh toán'}
                                </Badge>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col>
                                    <strong>Người tạo:</strong> {inv.create_by.fullname}
                                </Col>
                                <Col>
                                    <strong>Ngày tạo:</strong>{' '}
                                    {moment(inv.createdAt).format('DD/MM/YYYY')}
                                </Col>
                            </Row>
                            <p className="mt-2">
                                <strong>Nội dung:</strong> {inv.content}
                            </p>

                            <ListGroup className="mb-3">
                                {inv.items.map((item) => (
                                    <ListGroup.Item
                                        key={item._id}
                                        className="d-flex justify-content-between"
                                    >
                                        {item.name} (SL: {item.quantity} | Đơn vị tính: {item.unit})
                                        <span>{item.subTotal.toLocaleString('vi-VN')} VND</span>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item className="fw-bold d-flex justify-content-between">
                                    Tổng cộng:
                                    <span>{inv.total_amount.toLocaleString('vi-VN')} VND</span>
                                </ListGroup.Item>
                            </ListGroup>

                            {inv.note?.text && (
                                <Alert variant="info">
                                    <strong>Ghi chú:</strong> {inv.note.text}
                                    {inv.note.img?.length > 0 && (
                                        <div className="mt-2 d-flex gap-2 flex-wrap">
                                            {inv.note.img.map((img, idx) => (
                                                <Zoom key={idx}>
                                                    <img
                                                        src={img}
                                                        alt={`note-img-${idx}`}
                                                        style={{
                                                            width: 100,
                                                            height: 100,
                                                            objectFit: 'cover',
                                                            borderRadius: 8,
                                                        }}
                                                    />
                                                </Zoom>
                                            ))}
                                        </div>
                                    )}
                                </Alert>
                            )}

                            <div className="text-end">
                                {inv.payment_status === 'pending' ? (
                                    <Button onClick={() => handlePayNow(inv)}>
                                        Thanh toán ngay
                                    </Button>
                                ) : (
                                    <Button variant="success" disabled>
                                        Đã thanh toán lúc{' '}
                                        {moment(inv.paid_date).format('HH:mm DD/MM/YYYY')}
                                    </Button>
                                )}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </Container>
    );
};

export default Invoice;
