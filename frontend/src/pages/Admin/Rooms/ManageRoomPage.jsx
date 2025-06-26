import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import RoomTable from "../../../components/Rooms/RoomTable"; // Chúng ta sẽ tạo file này tiếp theo

const ManageRoomPage = () => {
  return (
    <Container fluid>
      <Row>
        <Col>
          {/* Component RoomTable sẽ chứa toàn bộ logic và giao diện bảng */}
          <RoomTable />
        </Col>
      </Row>
    </Container>
  );
};

export default ManageRoomPage;
