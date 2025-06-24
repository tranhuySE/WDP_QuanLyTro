import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Container,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaFilter } from "react-icons/fa";
import axios from "axios";

const ManageRoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [viewingRoom, setViewingRoom] = useState(null);

  const [formData, setFormData] = useState({
    roomNumber: "",
    floor: 1,
    area: 20,
    price: 0,
    maxOccupants: 1,
    status: "available",
    description: "",
  });

  const [filters, setFilters] = useState({
    status: "",
    floor: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:9999/rooms");
      setRooms(res.data);
      setFilteredRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilter = () => {
    let result = [...rooms];
    if (filters.status)
      result = result.filter((r) => r.status === filters.status);
    if (filters.floor)
      result = result.filter((r) => r.floor === parseInt(filters.floor));
    setFilteredRooms(result);
  };

  const resetForm = () => {
    setFormData({
      roomNumber: "",
      floor: 1,
      area: 20,
      price: 0,
      maxOccupants: 1,
      status: "available",
      description: "",
    });
    setEditingRoom(null);
  };

  const handleAddRoom = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditRoom = (room) => {
    setFormData({
      roomNumber: room.roomNumber,
      floor: room.floor,
      area: room.area,
      price: room.price,
      maxOccupants: room.maxOccupants,
      status: room.status,
      description: room.description || "",
    });
    setEditingRoom(room);
    setShowModal(true);
  };

  const handleViewRoom = (room) => {
    setViewingRoom(room);
  };

  const handleSubmit = async () => {
    try {
      if (editingRoom) {
        const res = await axios.put(
          `http://localhost:9999/rooms/${editingRoom._id}`,
          formData
        );
        const updatedRooms = rooms.map((room) =>
          room._id === editingRoom._id ? res.data : room
        );
        setRooms(updatedRooms);
        setFilteredRooms(updatedRooms);
      } else {
        const res = await axios.post("http://localhost:9999/rooms", formData);
        const updatedRooms = [...rooms, res.data];
        setRooms(updatedRooms);
        setFilteredRooms(updatedRooms);
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Failed to save room:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá phòng này không?")) {
      try {
        await axios.delete(`http://localhost:9999/rooms/${id}`);
        const updatedRooms = rooms.filter((r) => r._id !== id);
        setRooms(updatedRooms);
        setFilteredRooms(updatedRooms);
      } catch (err) {
        console.error("Failed to delete room:", err);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "available":
        return <Badge bg="success">Available</Badge>;
      case "occupied":
        return <Badge bg="warning">Occupied</Badge>;
      case "under_maintenance":
        return <Badge bg="danger">Under Maintenance</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <Col>
          <h2>Quản lý phòng</h2>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleAddRoom}>
            <FaPlus className="me-2" /> Thêm phòng
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Form.Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">-- Lọc theo trạng thái --</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="under_maintenance">Under Maintenance</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="Lọc theo tầng"
              name="floor"
              value={filters.floor}
              onChange={handleFilterChange}
            />
            <Button variant="secondary" onClick={applyFilter}>
              <FaFilter /> Lọc
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead className="table-primary">
          <tr>
            <th>Số phòng</th>
            <th>Tầng</th>
            <th>Diện tích (m²)</th>
            <th>Giá ($)</th>
            <th>Số người tối đa</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map((room) => (
            <tr key={room._id}>
              <td>{room.roomNumber}</td>
              <td>{room.floor}</td>
              <td>{room.area}</td>
              <td>{room.price}</td>
              <td>{room.maxOccupants}</td>
              <td>{renderStatusBadge(room.status)}</td>
              <td className="text-center">
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleViewRoom(room)}
                >
                  Xem
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditRoom(room)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(room._id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingRoom ? "Sửa phòng" : "Thêm phòng"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Số phòng</Form.Label>
              <Form.Control
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tầng</Form.Label>
              <Form.Control
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                min="1"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Diện tích (m²)</Form.Label>
              <Form.Control
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                min="1"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá ($)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số người tối đa</Form.Label>
              <Form.Control
                type="number"
                name="maxOccupants"
                value={formData.maxOccupants}
                onChange={handleChange}
                min="1"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="under_maintenance">Under Maintenance</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Huỷ
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            {editingRoom ? "Cập nhật" : "Lưu"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Chi Tiết */}
      <Modal
        show={!!viewingRoom}
        onHide={() => setViewingRoom(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết phòng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewingRoom && (
            <div>
              <p>
                <strong>Số phòng:</strong> {viewingRoom.roomNumber}
              </p>
              <p>
                <strong>Tầng:</strong> {viewingRoom.floor}
              </p>
              <p>
                <strong>Diện tích:</strong> {viewingRoom.area} m²
              </p>
              <p>
                <strong>Giá:</strong> {viewingRoom.price} $
              </p>
              <p>
                <strong>Số người tối đa:</strong> {viewingRoom.maxOccupants}
              </p>
              <p>
                <strong>Trạng thái:</strong> {viewingRoom.status}
              </p>
              <p>
                <strong>Mô tả:</strong> {viewingRoom.description}
              </p>

              {viewingRoom.images && viewingRoom.images.length > 0 && (
                <>
                  <p>
                    <strong>Hình ảnh:</strong>
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {viewingRoom.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`img-${idx}`}
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                      />
                    ))}
                  </div>
                </>
              )}

              {viewingRoom.amenities && viewingRoom.amenities.length > 0 && (
                <>
                  <hr />
                  <h5>Tiện nghi</h5>
                  <ul>
                    {viewingRoom.amenities.map((item, idx) => (
                      <li key={idx}>
                        {item.name} - {item.quantity} ({item.status})
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {viewingRoom.assets && viewingRoom.assets.length > 0 && (
                <>
                  <hr />
                  <h5>Tài sản</h5>
                  <ul>
                    {viewingRoom.assets.map((item, idx) => (
                      <li key={idx}>
                        {item.type}: {item.description || "Không mô tả"} – SL:{" "}
                        {item.quantity}{" "}
                        {item.licensePlate
                          ? `(Biển số: ${item.licensePlate})`
                          : ""}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {viewingRoom.room_service &&
                viewingRoom.room_service.length > 0 && (
                  <>
                    <hr />
                    <h5>Dịch vụ</h5>
                    <ul>
                      {viewingRoom.room_service.map((service, idx) => (
                        <li key={idx}>
                          {typeof service === "object" && service.name
                            ? `${service.name} - ${service.unit} - ${service.price}đ`
                            : `ID: ${service}`}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewingRoom(null)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageRoomPage;
