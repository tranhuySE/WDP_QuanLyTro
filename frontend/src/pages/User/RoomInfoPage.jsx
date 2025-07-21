import React, { useEffect, useState } from "react";
import { getMyRoomInfo } from "../../api/roomAPI";
import { Alert, Container, Card, Row, Col, ListGroup, Badge, Modal, Table } from "react-bootstrap";
import { FaRulerCombined, FaMoneyBillWave, FaBuilding, FaFileContract, FaCouch, FaBoxOpen, FaRegCalendarAlt } from "react-icons/fa";

const RoomInfoPage = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showImgModal, setShowImgModal] = useState(false);
  const [imgPreview, setImgPreview] = useState("");

  useEffect(() => {
    getMyRoomInfo()
      .then(res => {
        setRooms(res.data);
        if (res.data && res.data.length > 0) {
          setSelectedRoom(res.data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || "Bạn chưa được gán phòng nào.");
        setLoading(false);
      });
  }, []);

  // Khi đổi phòng, đóng modal preview ảnh và reset preview
  useEffect(() => {
    setShowImgModal(false);
    setImgPreview("");
  }, [selectedRoom]);

  const handleImgClick = (img) => {
    setImgPreview(img);
    setShowImgModal(true);
  };

  if (loading) return (
    <Container className="py-4 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p>Đang tải thông tin phòng...</p>
    </Container>
  );
  if (error) return (
    <Container className="py-4 text-center">
      <Alert variant="info" className="mt-4">{error}</Alert>
    </Container>
  );
  if (!rooms || rooms.length === 0) {
    return (
      <Container className="py-4 text-center">
        <Alert variant="info" className="mt-4">Bạn chưa có phòng nào đang thuê.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Header>Phòng của bạn</Card.Header>
            <ListGroup variant="flush">
              {rooms.map((room, idx) => (
                <ListGroup.Item
                  key={room._id || idx}
                  action
                  active={selectedRoom && selectedRoom._id === room._id}
                  onClick={() => setSelectedRoom(room)}
                  style={{ cursor: "pointer" }}
                >
                  Phòng {room.roomNumber}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        <Col md={9}>
          {selectedRoom ? (
            <Card className="shadow-sm mb-3 p-3">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <Card.Title style={{ fontWeight: 700, fontSize: 22, marginBottom: 0 }}>
                    Phòng {selectedRoom.roomNumber}
                  </Card.Title>
                  <Badge bg={
                    selectedRoom.status === "occupied" ? "success" :
                    selectedRoom.status === "available" ? "secondary" :
                    selectedRoom.status === "pending" ? "warning" : "info"
                  } className="ms-3" style={{ fontSize: 16 }}>
                    {selectedRoom.status === "occupied" ? "Đang thuê" :
                      selectedRoom.status === "available" ? "Trống" :
                      selectedRoom.status === "pending" ? "Chờ duyệt" : selectedRoom.status}
                  </Badge>
                </div>
                {/* Thông tin chính */}
                <div className="d-flex gap-3 mb-3 flex-wrap">
                  <div className="d-flex align-items-center gap-2 bg-light rounded px-3 py-2 shadow-sm">
                    <FaBuilding color="#0d6efd" />
                    <span>Tầng: <b>{selectedRoom.floor}</b></span>
                  </div>
                  <div className="d-flex align-items-center gap-2 bg-light rounded px-3 py-2 shadow-sm">
                    <FaRulerCombined color="#0d6efd" />
                    <span>Diện tích: <b>{selectedRoom.area} m²</b></span>
                  </div>
                  <div className="d-flex align-items-center gap-2 bg-light rounded px-3 py-2 shadow-sm">
                    <FaMoneyBillWave color="#0d6efd" />
                    <span>Giá: <b>{selectedRoom.price?.toLocaleString("vi-VN")} đ</b></span>
                  </div>
                </div>
                {/* Mô tả */}
                <div className="mb-3">
                  <div className="fw-bold mb-1"><FaFileContract className="me-2"/>Mô tả phòng</div>
                  <div className="ps-3">{selectedRoom.description}</div>
                </div>
                {/* Dịch vụ kèm theo */}
                <div className="mb-3">
                  <div className="fw-bold mb-1"><FaCouch className="me-2"/>Dịch vụ kèm theo</div>
                  {selectedRoom.room_service && selectedRoom.room_service.length > 0 ? (
                    <Table size="sm" bordered hover className="mb-0">
                      <thead>
                        <tr>
                          <th>Tên dịch vụ</th>
                          <th>Đơn giá</th>
                          <th>Đơn vị</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRoom.room_service.map((s, i) => (
                          <tr key={i}>
                            <td>{s.name}</td>
                            <td>{s.price?.toLocaleString("vi-VN")} đ</td>
                            <td>{s.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : <div className="ps-3">Không có</div>}
                </div>
                {/* Thời gian hợp đồng */}
                <div className="mb-3">
                  <div className="fw-bold mb-1"><FaRegCalendarAlt className="me-2"/>Thời gian hợp đồng</div>
                  <div className="ps-3">
                    {selectedRoom.contractStart && new Date(selectedRoom.contractStart).toLocaleDateString("vi-VN")} - {selectedRoom.contractEnd && new Date(selectedRoom.contractEnd).toLocaleDateString("vi-VN")}
                  </div>
                </div>
                {/* Điều khoản hợp đồng */}
                <div className="mb-3">
                  <div className="fw-bold mb-1"><FaFileContract className="me-2"/>Điều khoản hợp đồng</div>
                  <div className="ps-3">{selectedRoom.contractTerms || "Không có"}</div>
                </div>
              </Card.Body>
            </Card>
          ) : <Alert variant="info">Chọn phòng để xem chi tiết</Alert>}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {selectedRoom && (
            <Card className="shadow-sm">
              <Card.Header className="fw-bold"><FaBoxOpen className="me-2"/>Chi tiết phòng</Card.Header>
              <Card.Body>
      <Row>
                  <Col md={7} className="mb-3 mb-md-0">
                    <div className="mb-3">
                      <div className="fw-bold mb-1">Tiện nghi</div>
                      {selectedRoom.amenities?.length > 0 ? (
                        <ListGroup horizontal>
                          {selectedRoom.amenities.map((a, i) => (
                            <ListGroup.Item key={i}>{a.name} ({a.quantity}) - {a.status === "available" ? "Còn" : "Hết"}</ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : <div className="ps-3">Không có</div>}
                    </div>
                    <div className="mb-3">
                      <div className="fw-bold mb-1">Tài sản</div>
                      {selectedRoom.assets?.length > 0 ? (
                        <ListGroup horizontal>
                          {selectedRoom.assets.map((asset, i) => (
                            <ListGroup.Item key={i}>{asset.type} - {asset.description} ({asset.quantity}) {asset.licensePlate ? `- ${asset.licensePlate}` : ""}</ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : <div className="ps-3">Không có</div>}
                    </div>
                  </Col>
                  <Col md={5}>
                    <div className="fw-bold mb-1">Hình ảnh</div>
                    {selectedRoom.images?.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {selectedRoom.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="room"
                            style={{ width: 220, height: 150, objectFit: "cover", borderRadius: 8, border: "1px solid #eee", cursor: "pointer" }}
                            onClick={() => handleImgClick(img)}
                          />
                        ))}
                      </div>
                    ) : <div className="ps-3">Không có</div>}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      {/* Modal preview ảnh */}
      <Modal show={showImgModal} onHide={() => setShowImgModal(false)} centered size="xl">
        <Modal.Body className="text-center p-0" style={{ background: "#000" }}>
          <img src={imgPreview} alt="preview" style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain" }} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default RoomInfoPage; 