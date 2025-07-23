import React, { useState, useEffect, useRef } from 'react';
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
    Modal,
    Accordion,
} from 'react-bootstrap';
import moment from 'moment'; // Để định dạng ngày tháng dễ hơn
import { checkPaymentStatus, createPayment, getInvoicesByUserId } from '../../api/invoiceAPI';
import QRCodeImage from './QRCodeImage';

// Cài đặt moment nếu chưa có: npm install moment

const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false); // Đổi tên từ showModal cho rõ ràng
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentMessage, setPaymentMessage] = useState('');

    // State mới cho QR code và đếm ngược
    const [qrCodeData, setQrCodeData] = useState(null); // { qrCode: "url", paymentLink: "url" }
    const [countdown, setCountdown] = useState(300); // 5 phút = 300 giây
    const countdownIntervalRef = useRef(null);
    const pollingIntervalRef = useRef(null);

    // Lấy userId từ localStorage. Đảm bảo 'id' được lưu đúng sau khi đăng nhập.
    const currentUserId = localStorage.getItem('id');

    // --- Fetch Invoices ---
    useEffect(() => {
        fetchInvoices();
    }, [currentUserId]); // Gọi lại khi currentUserId thay đổi

    const fetchInvoices = async () => {
        setLoading(true);
        setError(null);
        try {
            // Không cần Authorization header vì đã bỏ protected middleware
            // Backend sẽ lấy userId từ req.params.id
            const response = await getInvoicesByUserId(currentUserId);
            setInvoices(response.data);
        } catch (err) {
            console.error('Error fetching invoices:', err);
            setError('Failed to fetch invoices. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // --- Modal Control ---
    const handleShowPaymentModal = (invoice) => {
        setSelectedInvoice(invoice);
        setShowPaymentModal(true);
        setPaymentMessage(''); // Reset message
        setPaymentProcessing(false); // Reset processing state
        setQrCodeData(null); // Reset QR data
        setCountdown(300); // Reset countdown
        clearInterval(countdownIntervalRef.current); // Clear any existing interval
        clearInterval(pollingIntervalRef.current); // Clear any existing interval
    };

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
        setSelectedInvoice(null);
        setQrCodeData(null);
        clearInterval(countdownIntervalRef.current); // Dừng đếm ngược
        clearInterval(pollingIntervalRef.current); // Dừng polling
    };

    // --- PayOS Payment Process ---
    const initiatePaymentProcess = async () => {
        if (!selectedInvoice || !currentUserId) {
            setPaymentMessage('Error: Invoice or User ID is missing.');
            return;
        }

        setPaymentProcessing(true);
        setPaymentMessage('Generating QR code...');
        setQrCodeData(null); // Reset previous QR

        try {
            // Gửi invoiceId và userId đến backend để tạo thanh toán PayOS
            // Backend sẽ không dùng req.user.id nữa, mà dùng req.body.userId
            const response = await createPayment(selectedInvoice._id, currentUserId);

            setQrCodeData(response.data);
            setPaymentMessage('Scan QR code to pay or click the payment link.');
            setPaymentProcessing(false);

            // Bắt đầu đếm ngược 5 phút
            setCountdown(300);
            countdownIntervalRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownIntervalRef.current);
                        setPaymentMessage('Payment time expired. Please close and try again.');
                        clearInterval(pollingIntervalRef.current); // Dừng polling khi hết giờ
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000); // Cập nhật mỗi giây

            // Bắt đầu Polling để kiểm tra trạng thái thanh toán
            pollingIntervalRef.current = setInterval(async () => {
                try {
                    // Gửi userId trong query params để backend có thể xác định người dùng
                    // LƯU Ý: Backend của bạn cần được cập nhật để đọc userId từ req.query.userId
                    // hoặc req.params nếu bạn thay đổi route.
                    const statusResponse = await checkPaymentStatus(
                        selectedInvoice._id,
                        currentUserId,
                    );

                    if (statusResponse.data.payment_status === 'paid') {
                        setPaymentMessage('Payment successful!');
                        // Cập nhật hóa đơn trong UI
                        setInvoices((prevInvoices) =>
                            prevInvoices.map((inv) =>
                                inv._id === selectedInvoice._id
                                    ? {
                                          ...inv,
                                          payment_status: 'paid',
                                          paid_date: new Date().toISOString(),
                                      }
                                    : inv,
                            ),
                        );
                        clearInterval(countdownIntervalRef.current); // Dừng đếm ngược
                        clearInterval(pollingIntervalRef.current); // Dừng polling
                        setTimeout(() => handleClosePaymentModal(), 1500); // Đóng modal sau 1.5s
                    }
                } catch (pollingErr) {
                    console.error('Polling error:', pollingErr);
                    // Có thể hiển thị lỗi polling nếu cần, hoặc để nó chạy ngầm
                }
            }, 5000); // Polling mỗi 5 giây
        } catch (err) {
            console.error('Error initiating payment:', err.response?.data || err.message);
            setPaymentMessage(
                `Failed to initiate payment: ${err.response?.data?.message || err.message}`,
            );
            setPaymentProcessing(false);
            clearInterval(countdownIntervalRef.current);
            clearInterval(pollingIntervalRef.current);
        }
    };

    // --- Helper function for time formatting ---
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
            .toString()
            .padStart(2, '0')}`;
    };

    // --- Render Logic ---
    if (loading) {
        return (
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: '80vh' }}
            >
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading invoices...</span>
                </Spinner>
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

    if (invoices.length === 0) {
        return (
            <Container className="mt-5">
                <Alert variant="info">You have no invoices at the moment.</Alert>
            </Container>
        );
    }

    const invoiceTypeLabels = {
        service: 'Hóa đơn dịch vụ',
        penalty: 'Hóa đơn phạt tiền',
        repair: 'Hóa đơn sửa chữa',
        other: 'Hóa đơn khác',
    };

    return (
        <Container fluid>
            <h3 className="mb-4 text-center">Danh sách hóa đơn của bạn</h3>
            <Accordion defaultActiveKey={null}>
                {invoices.map((invoice, index) => (
                    <Accordion.Item eventKey={index.toString()} key={invoice._id} className="mb-3">
                        <Accordion.Header>
                            <div className="d-flex justify-content-between w-100">
                                <div>
                                    <strong>Phòng:</strong> {invoice.for_room_id.roomNumber} |{' '}
                                    <strong>Loại:</strong>{' '}
                                    {invoiceTypeLabels[invoice.invoice_type] || 'Không xác định'}
                                </div>
                                <Badge
                                    bg={invoice.payment_status === 'paid' ? 'success' : 'warning'}
                                    className="ms-auto"
                                >
                                    {invoice.payment_status === 'paid'
                                        ? 'Đã thanh toán'
                                        : 'Chưa thanh toán'}
                                </Badge>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <Row className="mb-2">
                                <Col>
                                    <strong>Người tạo:</strong> {invoice.create_by.fullname}
                                </Col>
                                <Col>
                                    <strong>Ngày tạo:</strong>{' '}
                                    {moment(invoice.createdAt).format('DD/MM/YYYY')}
                                </Col>
                            </Row>

                            <p>
                                <strong>Nội dung:</strong> {invoice.content}
                            </p>

                            <ListGroup className="mb-3">
                                {invoice.items.map((item) => (
                                    <ListGroup.Item
                                        key={item._id}
                                        className="d-flex justify-content-between"
                                    >
                                        {item.name} ({item.quantity} {item.unit})
                                        <span>{item.subTotal.toLocaleString('vi-VN')} VND</span>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item className="d-flex justify-content-between fw-bold">
                                    Tổng cộng:
                                    <span>{invoice.total_amount.toLocaleString('vi-VN')} VND</span>
                                </ListGroup.Item>
                            </ListGroup>

                            {invoice.note?.text && (
                                <Alert variant="info">
                                    <strong>Ghi chú:</strong> {invoice.note.text}
                                    {invoice.note.img?.length > 0 && (
                                        <div className="mt-2 d-flex flex-wrap gap-2">
                                            {invoice.note.img.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt="Ghi chú"
                                                    className="img-thumbnail"
                                                    style={{ height: '100px', objectFit: 'cover' }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </Alert>
                            )}

                            <div className="text-end">
                                {invoice.payment_status === 'pending' ? (
                                    <Button
                                        variant="primary"
                                        onClick={() => handleShowPaymentModal(invoice)}
                                    >
                                        Thanh toán ngay
                                    </Button>
                                ) : (
                                    <Button variant="success" disabled>
                                        Đã thanh toán lúc{' '}
                                        {moment(invoice.paid_date).format('HH:mm DD/MM/YYYY')}
                                    </Button>
                                )}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
            <Modal show={showPaymentModal} onHide={handleClosePaymentModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Pay for Invoice</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {selectedInvoice && (
                        <>
                            <h5>Invoice for Room {selectedInvoice.for_room_id.roomNumber}</h5>
                            <p>Content: {selectedInvoice.content}</p>
                            <h3>
                                Total: {selectedInvoice.total_amount.toLocaleString('vi-VN')} VND
                            </h3>

                            {!qrCodeData && !paymentProcessing && (
                                <>
                                    <Button variant="primary" onClick={initiatePaymentProcess}>
                                        Generate PayOS QR
                                    </Button>
                                    {paymentMessage && (
                                        <Alert variant="info" className="mt-3">
                                            {paymentMessage}
                                        </Alert>
                                    )}
                                </>
                            )}
                            {paymentProcessing &&
                                !qrCodeData && ( // Khi đang tạo QR code
                                    <div className="d-flex flex-column align-items-center mt-3">
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Generating...</span>
                                        </Spinner>
                                        <p className="mt-2">{paymentMessage}</p>
                                    </div>
                                )}

                            {qrCodeData && ( // Khi có QR code
                                <>
                                    <p className="mt-3">
                                        Scan QR code to pay or click link to pay:
                                    </p>
                                    <QRCodeImage qrCodeData={qrCodeData.qrCode} />
                                    <p className="mt-2">
                                        Time remaining: <strong>{formatTime(countdown)}</strong>
                                    </p>
                                    {countdown === 0 && (
                                        <Alert variant="danger">
                                            Payment time expired. Please close and try again.
                                        </Alert>
                                    )}
                                    <a
                                        href={qrCodeData.paymentLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-info mt-3"
                                    >
                                        Open Payment Link
                                    </a>
                                </>
                            )}
                            {paymentMessage &&
                                (qrCodeData || (!qrCodeData && !paymentProcessing)) && (
                                    <Alert
                                        variant={
                                            paymentMessage.includes('successful')
                                                ? 'success'
                                                : paymentMessage.includes('expired') ||
                                                  paymentMessage.includes('Failed')
                                                ? 'danger'
                                                : 'info'
                                        }
                                        className="mt-3"
                                    >
                                        {paymentMessage}
                                    </Alert>
                                )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleClosePaymentModal}
                        disabled={paymentProcessing}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Invoice;
