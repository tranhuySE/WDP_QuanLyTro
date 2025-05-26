import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import {
  FaBed,
  FaUsers,
  FaFileInvoiceDollar,
  FaMoneyCheckAlt,
  FaConciergeBell,
  FaChartPie,
} from "react-icons/fa";
import "./HomePage.css";

const HomePage = () => {
  const data = [
    {
      name: "Quản lý phòng",
      icon: <FaBed size={40} />,
    },
    {
      name: "Quản lý người thuê",
      icon: <FaUsers size={40} />,
    },
    {
      name: "Quản lý hóa đơn",
      icon: <FaFileInvoiceDollar size={40} />,
    },
    {
      name: "Quản lý thanh toán",
      icon: <FaMoneyCheckAlt size={40} />,
    },
    {
      name: "Quản lý dịch vụ",
      icon: <FaConciergeBell size={40} />,
    },
    {
      name: "Phân tích dữ liệu",
      icon: <FaChartPie size={40} />,
    },
  ];

  return (
    <Container fluid>
      <Row>
        {data.map((item, index) => {
          return (
            <Col
              md={3}
              key={index}
              className="mb-3"
              style={{ cursor: "pointer" }}
            >
              <div
                className="d-flex flex-column align-items-center justify-content-center text-center p-3 border rounded shadow-sm bg-white hover-card"
                style={{
                  minHeight: "120px",
                  transition: "0.3s",
                }}
              >
                <div className="mb-2 text-primary">{item.icon}</div>
                <h5 style={{ fontSize: "1.1rem", marginBottom: 0 }}>
                  {item.name}
                </h5>
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default HomePage;
