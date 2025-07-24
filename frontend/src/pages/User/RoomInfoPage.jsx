import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Accordion, ListGroup, Row, Col, Container, Badge } from 'react-bootstrap';
import { FaBed, FaUserFriends, FaRulerCombined, FaMoneyBillAlt } from 'react-icons/fa';
import { MdMeetingRoom } from 'react-icons/md';
import { useState } from 'react';
import { getMyRoomInfo } from '../../api/roomAPI';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const RoomInfoPage = () => {
    const [room, setRoom] = useState(null);
    const id = localStorage.getItem('id');

    const getRInfo = async () => {
        try {
            const res = await getMyRoomInfo(id);
            setRoom(res.data);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        getRInfo();
    }, []);

    if (!room) return <div>Không có dữ liệu phòng</div>;

    return (
        <Container fluid className="my-2">
            <h3 className="mb-3">
                <MdMeetingRoom /> Phòng {room.roomNumber}
            </h3>

            <Row className="mb-4">
                {room.images?.map((url, idx) => (
                    <Col key={idx} xs={6} md={4} lg={3} className="mb-3">
                        <Zoom>
                            <img
                                src={url}
                                alt={`room-img-${idx}`}
                                style={{
                                    width: '100%',
                                    height: 150,
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                    border: '1px solid #ccc',
                                }}
                            />
                        </Zoom>
                    </Col>
                ))}
            </Row>

            <Row className="mb-4">
                <Col>
                    <FaRulerCombined /> Diện tích: <strong>{room.area} m²</strong>
                </Col>
                <Col>
                    <FaMoneyBillAlt /> Giá: <strong>{room.price.toLocaleString()}đ</strong>
                </Col>
                <Col>
                    <FaUserFriends /> Tối đa: <strong>{room.maxOccupants} người</strong>
                </Col>
                <Col>
                    Trạng thái:{' '}
                    <Badge bg={room.status === 'available' ? 'success' : 'secondary'}>
                        {room.status}
                    </Badge>
                </Col>
            </Row>

            <Accordion defaultActiveKey="0">
                {/* Mô tả */}
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Mô tả phòng</Accordion.Header>
                    <Accordion.Body>{room.description}</Accordion.Body>
                </Accordion.Item>

                {/* Tiện ích */}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Tiện ích</Accordion.Header>
                    <Accordion.Body>
                        {room.amenities?.length > 0 ? (
                            <ListGroup>
                                {room.amenities.map((a) => (
                                    <ListGroup.Item key={a._id}>
                                        <FaBed className="me-2" />
                                        {a.name} - SL: {a.quantity} ({a.status})
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            'Không có tiện ích'
                        )}
                    </Accordion.Body>
                </Accordion.Item>

                {/* Người thuê */}
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Người thuê</Accordion.Header>
                    <Accordion.Body>
                        {room.tenant?.length > 0 ? (
                            <ListGroup>
                                {room.tenant.map((t, idx) => (
                                    <ListGroup.Item key={idx}>
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={t.avatar}
                                                alt={t.fullname}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    marginRight: 10,
                                                }}
                                            />
                                            <div>
                                                <strong>{t.fullname}</strong> <br />
                                                <small>{t.phoneNumber}</small>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            'Chưa có người thuê'
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
};

export default RoomInfoPage;
