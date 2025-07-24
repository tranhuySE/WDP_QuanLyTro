import { Modal, Button, Row, Col, ListGroup, Badge, Card, Image } from 'react-bootstrap';
import {
    PersonFill,
    HouseDoorFill,
    FileEarmarkTextFill,
    CashStack,
    CalendarCheck,
    GeoAlt,
} from 'react-bootstrap-icons';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const formatCurrency = (value) => value.toLocaleString('vi-VN') + ' ₫';
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN');

const ContractDetailModal = ({ show, handleClose, contract }) => {
    if (!contract) return null;

    const {
        roomId,
        tenant,
        deposit,
        startDate,
        endDate,
        price,
        file,
        house_service,
        terms,
        house_address,
        status,
        terminationReason,
    } = contract;

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>
                    <HouseDoorFill className="me-2" />
                    Chi tiết Hợp đồng
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Người thuê và phòng */}
                <Row className="mb-3">
                    <Col md={4} className="text-center">
                        <Image
                            src={tenant.avatar}
                            roundedCircle
                            fluid
                            width={100}
                            height={100}
                            style={{
                                border: '3px solid #0d6efd',
                                padding: '2px',
                            }}
                        />
                        <h6 className="mt-2">{tenant.fullname}</h6>
                        <p>
                            <PersonFill className="me-1" />
                            {tenant.phoneNumber}
                        </p>
                        <p>{tenant.email}</p>
                    </Col>
                    <Col md={8}>
                        <h6>Thông tin phòng</h6>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                Phòng: <strong>{roomId.roomNumber}</strong>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Tầng: {roomId.floor} - Diện tích: {roomId.area} m²
                            </ListGroup.Item>
                            <ListGroup.Item>Giá thuê: {formatCurrency(price)}</ListGroup.Item>
                            <ListGroup.Item>
                                Trạng thái:{' '}
                                <Badge bg={status === 'active' ? 'success' : 'secondary'}>
                                    {status}
                                </Badge>
                            </ListGroup.Item>
                            {terminationReason && (
                                <ListGroup.Item>
                                    Lý do chấm dứt hợp đồng : {terminationReason}
                                </ListGroup.Item>
                            )}
                            <ListGroup.Item>
                                <GeoAlt className="me-1" /> {house_address}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>

                {/* Thời gian và cọc */}
                <Row className="mb-3">
                    <Col md={6}>
                        <h6>
                            <CalendarCheck className="me-2" />
                            Thời gian
                        </h6>
                        <ListGroup>
                            <ListGroup.Item>Bắt đầu: {formatDate(startDate)}</ListGroup.Item>
                            <ListGroup.Item>Kết thúc: {formatDate(endDate)}</ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={6}>
                        <h6>
                            <CashStack className="me-2" />
                            Tiền cọc
                        </h6>
                        <ListGroup>
                            <ListGroup.Item>
                                Số tiền: {formatCurrency(deposit.amount)}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Thanh toán: {formatDate(deposit.paymentDate)}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Trạng thái:{' '}
                                <Badge bg={deposit.status === 'paid' ? 'success' : 'warning'}>
                                    {deposit.status}
                                </Badge>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>

                {/* Dịch vụ */}
                <h6>Dịch vụ sử dụng</h6>
                <ListGroup horizontal className="mb-3">
                    {house_service.map((s) => (
                        <ListGroup.Item key={s._id}>
                            {s.name}: {formatCurrency(s.price)} / {s.unit}
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                {/* File hợp đồng */}
                {file?.length > 0 && (
                    <>
                        <h6>
                            <FileEarmarkTextFill className="me-2" />
                            Tệp hợp đồng
                        </h6>
                        <ListGroup className="mb-3">
                            {file.map((f, index) => (
                                <ListGroup.Item key={f._id || index}>
                                    <Zoom>
                                        <img
                                            src={f}
                                            alt={`img-${index}`}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                objectFit: 'cover',
                                                borderRadius: 8,
                                                border: '1px solid #ccc',
                                                cursor: 'zoom-in',
                                            }}
                                        />
                                    </Zoom>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </>
                )}

                {/* Điều khoản */}
                <h6>Điều khoản</h6>
                <Card body>{terms}</Card>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ContractDetailModal;
