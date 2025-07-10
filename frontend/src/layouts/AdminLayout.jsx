import {
  BarChart3,
  Building2,
  FileCheck,
  Home,
  LifeBuoy,
  Users,
  Wrench
} from 'lucide-react';
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

  const navItems = [
    { path: '/admin/homepage', label: 'Trang chủ', icon: Home },
    { path: '/admin/dashboard', label: 'Phân tích dữ liệu', icon: BarChart3 },
    { path: '/admin/rooms', label: 'Quản lý phòng', icon: Building2 },
    { path: '/admin/users', label: 'Quản lý tài khoản', icon: Users },
    { path: '/admin/contracts', label: 'Quản lý hợp đồng', icon: FileCheck },
    { path: '/admin/services', label: 'Quản lý dịch vụ', icon: Wrench },
    { path: '/admin/requests', label: 'Yêu cầu hỗ trợ', icon: LifeBuoy },
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

export default AdminLayout;