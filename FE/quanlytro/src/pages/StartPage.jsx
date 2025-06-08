import React, { useState } from "react";
import { Button, Container, Form, InputGroup, Row, Col } from "react-bootstrap";
import SideNav from "../components/SideBar/SideNav";
import Breakcum from "../components/Breakcum";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Side_right_header from "../components/SideBar/Side_right_header";

const StartPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Container fluid>
      <Row>
        <Col
          md={sidebarCollapsed ? 1 : 2}
          className="bg-white text-black vh-100 border-end border-2"
        >
          <div className="d-flex justify-content-between p-3 text-center">
            <h5>{!sidebarCollapsed ? "quanlytro123.com" : "..."}</h5>
            <div className="d-flex align-items-center">
              <FaBars size={16} onClick={toggleSidebar} />
            </div>
          </div>
          <SideNav collapsed={sidebarCollapsed} />
        </Col>

        <Col md={sidebarCollapsed ? 11 : 10} className="pt-2">
          <Row className="align-items-center border-bottom">
            <Col md={5}>
              <Breakcum />
            </Col>
            <Col md={7}>
              <Side_right_header />
            </Col>
          </Row>
          <Row
            className="mt-3"
            style={{ overflowY: "auto", height: "calc(100vh - 150px)" }}
          >
            <Outlet />
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default StartPage;
