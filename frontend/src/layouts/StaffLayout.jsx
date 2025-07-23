import {
  FileText,
  Home,
  LifeBuoy,
  Building2,
  Users
} from 'lucide-react';
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Navbar/Sidebar.jsx";
import Topbar from "../components/Navbar/Topbar.jsx";
import "../styles/Admin/AdminLayout.css"; // Assuming you have a CSS file for styles

const StaffLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 70 : 250;

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const navItems = [
    { path: '/staff/homepage', label: 'Trang chủ', icon: Home },
    { path: '/staff/users', label: 'Đăng ký thông tin', icon: Users },
    { path: '/staff/rooms', label: 'Quản lý phòng', icon: Building2 },
    { path: '/staff/invoices', label: 'Quản lý hóa đơn', icon: FileText },
    { path: '/staff/requests', label: 'Yêu cầu', icon: LifeBuoy }
  ];

  return (
    <div className="admin-layout">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        navItems={navItems}
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

export default StaffLayout;