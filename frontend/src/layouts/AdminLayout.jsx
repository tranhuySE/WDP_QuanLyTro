import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Navbar/Sidebar.jsx";
import Topbar from "../components/Navbar/Topbar.jsx";
import "../styles/Admin/AdminLayout.css"; // Assuming you have a CSS file for styles

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 70 : 250;

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="admin-layout">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      <div
        className="main-content"
        style={{ marginLeft: sidebarWidth }}
      >
        <Topbar sidebarWidth={sidebarWidth} />

        <main className="content-area">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;