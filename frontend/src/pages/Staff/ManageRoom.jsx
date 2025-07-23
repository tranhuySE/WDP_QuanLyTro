import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import RoomTable from "../../components/Rooms/Staff/RoomTable.jsx"; 
const ManageRoom = () => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <RoomTable />
        </Col>
      </Row>
    </Container>
  );
};

export default ManageRoom;
