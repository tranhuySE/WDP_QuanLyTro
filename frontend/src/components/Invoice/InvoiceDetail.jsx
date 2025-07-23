import { Modal, Row, Col, Table, Badge } from 'react-bootstrap';
import { FaFilePdf } from 'react-icons/fa';

const formatCurrency = (value) => {
    return value?.toLocaleString('vi-VN') + ' ₫';
};

const InvoiceDetail = ({ show, onHide, invoice }) => {
    if (!invoice) return null;

    const {
        create_by,
        for_room_id,
        content,
        createdAt,
        items,
        total_amount,
        payment_type,
        invoice_type,
        payment_status,
        note,
    } = invoice;

    const INVOICE_TYPE_LABELS = {
        service: 'Hóa đơn dịch vụ',
        penalty: 'Hóa đơn phạt tiền',
        repair: 'Hóa đơn sửa chữa',
        other: 'Hóa đơn khác',
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết hóa đơn</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Row className="mb-3">
                    <Col>
                        <strong>Người tạo:</strong> {create_by?.fullname}
                    </Col>
                    <Col>
                        <strong>Phòng:</strong> {for_room_id?.roomNumber}
                    </Col>
                    <Col>
                        <strong>Loại hóa đơn:</strong>{' '}
                        {INVOICE_TYPE_LABELS[invoice_type] || 'Không xác định'}
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <strong>Ngày tạo:</strong> {new Date(createdAt).toLocaleDateString()}
                    </Col>
                    <Col>
                        <strong>Trạng thái:</strong>{' '}
                        <Badge bg={payment_status === 'paid' ? 'success' : 'warning'}>
                            {payment_status}
                        </Badge>
                    </Col>
                    <Col>
                        <strong>Phương thức:</strong>{' '}
                        <Badge bg={payment_type === 'Cash' ? 'secondary' : 'info'}>
                            {payment_type}
                        </Badge>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <strong>Nội dung:</strong>
                        <div>{content}</div>
                    </Col>
                </Row>

                <Row className="mb-2">
                    <Col>
                        <strong>Ghi chú:</strong>
                        <div>{note?.text}</div>
                        {note?.img?.length > 0 && (
                            <div className="mt-2 d-flex flex-wrap gap-2">
                                {note.img.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Note ${idx + 1}`}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </Col>
                </Row>

                <hr />

                <h6>Chi tiết các khoản</h6>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên</th>
                            <th>Đơn vị</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={item._id}>
                                <td>{idx + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.unit}</td>
                                <td>{formatCurrency(item.price_unit)}</td>
                                <td>{item.quantity}</td>
                                <td>{formatCurrency(item.subTotal)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <h5 className="text-end">Tổng cộng: {formatCurrency(total_amount)}</h5>
            </Modal.Body>
        </Modal>
    );
};

export default InvoiceDetail;
