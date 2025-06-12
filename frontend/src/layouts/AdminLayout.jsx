import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import BreadcrumbLayout from "../components/Breadcrumb.jsx";
import SideNav from "../components/SideBar/SideNav.jsx";
import SideRightHeader from "../components/SideBar/SideRightHeader.jsx";

const AdminLayout = () => {
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
                        <h5>{!sidebarCollapsed ? "Trọ Quang Huy" : "..."}</h5>
                        <div className="d-flex align-items-center">
                            <FaBars size={16} onClick={toggleSidebar} />
                        </div>
                    </div>
                    <SideNav collapsed={sidebarCollapsed} />
                </Col>

                <Col md={sidebarCollapsed ? 11 : 10} className="pt-2">
                    <Row className="align-items-center border-bottom">
                        <Col md={5}>
                            <BreadcrumbLayout />
                        </Col>
                        <Col md={7}>
                            <SideRightHeader />
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

export default AdminLayout;
