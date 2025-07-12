import React, { useEffect, useState } from "react";
import { getMyRoomInfo } from "../../api/roomAPI";
import {
  Alert,
  Container,
  Card,
  Row,
  Col,
  ListGroup,
  Badge,
} from "react-bootstrap";

const RoomInfoPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyRoomInfo()
      .then((res) => {
        setRooms(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Bạn chưa được gán phòng nào.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <Container className="py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Đang tải thông tin phòng...</p>
      </Container>
    );
  if (error)
    return (
      <Container className="py-4 text-center">
        <Alert variant="info" className="mt-4">
          {error}
        </Alert>
      </Container>
    );
  if (!rooms || rooms.length === 0) {
    return (
      <Container className="py-4 text-center">
        <Alert variant="info" className="mt-4">
          Bạn chưa có phòng nào đang thuê.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">Thông tin phòng đang thuê</h2>
      <Row>
        {rooms.map((room, idx) => {
          let statusLabel = "";
          let statusColor = "secondary";
          if (room.status === "occupied") {
            statusLabel = "Đang thuê";
            statusColor = "success";
          } else if (room.status === "available") {
            statusLabel = "Trống";
            statusColor = "secondary";
          } else if (room.status === "pending") {
            statusLabel = "Chờ duyệt";
            statusColor = "warning";
          } else {
            statusLabel = room.status;
            statusColor = "info";
          }
          return (
            <Col md={12} key={room._id || idx} className="mb-4">
              <Card
                className="shadow-sm"
                style={{
                  borderLeft: "5px solid #0d6efd",
                  background: "#f8f9fa",
                }}
              >
                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <Card.Title
                      style={{ fontWeight: 600, fontSize: 20, marginBottom: 0 }}
                    >
                      Phòng {room.roomNumber}
                    </Card.Title>
                    <Badge
                      bg={statusColor}
                      className="ms-3"
                      style={{ fontSize: 16 }}
                    >
                      {statusLabel}
                    </Badge>
                  </div>
                  <Card.Subtitle className="mb-2 text-muted">
                    Tầng: {room.floor} • Diện tích: {room.area} m² • Giá:{" "}
                    {room.price?.toLocaleString("vi-VN")} đ
                  </Card.Subtitle>
                  <div className="mb-2">
                    <b>Mô tả:</b> {room.description}
                  </div>
                  <div className="mb-2">
                    <b>Dịch vụ kèm theo:</b>{" "}
                    {room.services && room.services.length > 0 ? (
                      <ListGroup variant="flush">
                        {room.services.map((s, i) => (
                          <ListGroup.Item key={i}>{s}</ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      "Không có"
                    )}
                  </div>
                  <div className="mb-2">
                    <b>Thời gian hợp đồng:</b>{" "}
                    {room.contractStart &&
                      new Date(room.contractStart).toLocaleDateString(
                        "vi-VN"
                      )}{" "}
                    -{" "}
                    {room.contractEnd &&
                      new Date(room.contractEnd).toLocaleDateString("vi-VN")}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default RoomInfoPage;
