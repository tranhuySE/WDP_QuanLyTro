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

const ManageRoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null); // Track which room is being edited
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
    const data = [
      {
        _id: 1,
        roomNumber: "101",
        floor: 1,
        area: 30,
        price: 200,
        maxOccupants: 2,
        status: "available",
        description: "Phòng đơn thoáng mát",
      },
      {
        _id: 2,
        roomNumber: "201",
        floor: 2,
        area: 40,
        price: 300,
        maxOccupants: 3,
        status: "occupied",
        description: "Phòng gia đình rộng rãi",
      },
      {
        _id: 3,
        roomNumber: "102",
        floor: 1,
        area: 25,
        price: 250,
        maxOccupants: 2,
        status: "under_maintenance",
        description: "Phòng đang sửa chữa",
      },
    ];
    setRooms(data);
    setFilteredRooms(data);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilter = () => {
    let result = [...rooms];

    if (filters.status) {
      result = result.filter((r) => r.status === filters.status);
    }

    if (filters.floor) {
      result = result.filter((r) => r.floor === parseInt(filters.floor));
    }

    setFilteredRooms(result);
  };

  // Reset form data
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

  // Open modal for adding new room
  const handleAddRoom = () => {
    resetForm();
    setShowModal(true);
  };

  // Open modal for editing existing room
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

  // Handle form submission for both add and edit
  const handleSubmit = () => {
    if (editingRoom) {
      // Update existing room
      const updatedRooms = rooms.map((room) =>
        room._id === editingRoom._id
          ? {
              ...room,
              ...formData,
              floor: parseInt(formData.floor),
              area: parseInt(formData.area),
              price: parseInt(formData.price),
              maxOccupants: parseInt(formData.maxOccupants),
            }
          : room
      );
      setRooms(updatedRooms);
      setFilteredRooms(updatedRooms);
    } else {
      // Add new room
      const newRoom = {
        ...formData,
        _id: Math.max(...rooms.map((r) => r._id)) + 1, // Generate new ID
        floor: parseInt(formData.floor),
        area: parseInt(formData.area),
        price: parseInt(formData.price),
        maxOccupants: parseInt(formData.maxOccupants),
      };
      const updatedRooms = [...rooms, newRoom];
      setRooms(updatedRooms);
      setFilteredRooms(updatedRooms);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xoá phòng này không?")) {
      const updatedRooms = rooms.filter((r) => r._id !== id);
      setRooms(updatedRooms);
      setFilteredRooms(updatedRooms);
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

      {/* Bộ lọc */}
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

      {/* Modal thêm/sửa phòng */}
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
                placeholder="Nhập số phòng"
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
                placeholder="Nhập mô tả phòng"
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
    </Container>
  );
};

export default ManageRoomPage;
