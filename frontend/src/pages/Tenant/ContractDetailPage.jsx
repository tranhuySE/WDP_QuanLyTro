import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, Badge, Card, Accordion, Image } from 'react-bootstrap';
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
import { getContractByUserIdFE } from '../../api/contractAPI';
import { toast } from 'react-toastify';

const formatCurrency = (value) => value?.toLocaleString('vi-VN') + ' ₫';
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN');

const ContractDetailPage = () => {
    const id = localStorage.getItem('id');
    const [contract, setContract] = useState(null);
    const fetchContract = async () => {
        try {
            const res = await getContractByUserIdFE(id);
            setContract(res.data);
        } catch (error) {
            return toast.error(error.response.data.message);
        }
    };
    useEffect(() => {
        fetchContract();
    }, [id]);

    if (!contract) return <p>Đang tải dữ liệu...</p>;

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
        <Container fluid className="py-2">
            <h3>
                <HouseDoorFill className="me-2" />
                Chi tiết Hợp đồng
            </h3>

            <Accordion defaultActiveKey="0" className="mt-4">
                {/* Thông tin người thuê và phòng */}
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Thông tin người thuê & phòng</Accordion.Header>
                    <Accordion.Body>
                        <Row>
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
                                <ListGroup>
                                    <ListGroup.Item>
                                        Phòng: <strong>{roomId.roomNumber}</strong>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        Tầng: {roomId.floor} - Diện tích: {roomId.area} m²
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        Giá thuê: {formatCurrency(price)}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        Trạng thái:{' '}
                                        <Badge bg={status === 'active' ? 'success' : 'secondary'}>
                                            {status}
                                        </Badge>
                                    </ListGroup.Item>
                                    {terminationReason && (
                                        <ListGroup.Item>
                                            Lý do chấm dứt: {terminationReason}
                                        </ListGroup.Item>
                                    )}
                                    <ListGroup.Item>
                                        <GeoAlt className="me-1" /> {house_address}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Thời gian & Tiền cọc */}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Thời gian & Tiền cọc</Accordion.Header>
                    <Accordion.Body>
                        <Row>
                            <Col md={6}>
                                <h6>
                                    <CalendarCheck className="me-2" />
                                    Thời gian
                                </h6>
                                <ListGroup>
                                    <ListGroup.Item>
                                        Bắt đầu: {formatDate(startDate)}
                                    </ListGroup.Item>
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
                                        <Badge
                                            bg={deposit.status === 'paid' ? 'success' : 'warning'}
                                        >
                                            {deposit.status}
                                        </Badge>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Dịch vụ sử dụng */}
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Dịch vụ sử dụng</Accordion.Header>
                    <Accordion.Body>
                        <ListGroup horizontal>
                            {house_service.map((s) => (
                                <ListGroup.Item key={s._id}>
                                    {s.name}: {formatCurrency(s.price)} / {s.unit}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>

                {/* File hợp đồng */}
                {file?.length > 0 && (
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>
                            <FileEarmarkTextFill className="me-2" />
                            Tệp hợp đồng
                        </Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                {file.map((f, index) => (
                                    <Col key={f._id || index} xs={6} md={3} className="mb-3">
                                        <Zoom>
                                            <img
                                                src={f}
                                                alt={`img-${index}`}
                                                style={{
                                                    width: '100%',
                                                    height: 120,
                                                    objectFit: 'cover',
                                                    borderRadius: 8,
                                                    border: '1px solid #ccc',
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </Zoom>
                                    </Col>
                                ))}
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                )}

                {/* Điều khoản */}
                <Accordion.Item eventKey="4">
                    <Accordion.Header>Điều khoản</Accordion.Header>
                    <Accordion.Body>
                        <Card body>{terms}</Card>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
};

export default ContractDetailPage;
