import { CardSim, FileCheck, FileText, Home, HousePlus, LifeBuoy } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Navbar/Sidebar.jsx';
import Topbar from '../components/Navbar/Topbar.jsx';
import '../styles/Admin/AdminLayout.css'; // Assuming you have a CSS file for styles

const TenantLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const sidebarWidth = sidebarCollapsed ? 70 : 250;

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const navItems = [
        { path: '/tenant/homepage', label: 'Trang chủ', icon: Home },
        { path: '/tenant/room-info', label: 'Thông tin phòng', icon: HousePlus },
        { path: '/tenant/room-invoice', label: 'Hóa đơn', icon: FileText },
        {
            path: '/tenant/payment-history',
            label: 'Lịch sử thanh toán',
            icon: CardSim,
        },
        { path: '/tenant/contracts', label: 'Hợp đồng', icon: FileCheck },
        { path: '/tenant/requests', label: 'Yêu cầu hỗ trợ', icon: LifeBuoy },
    ];

    return (
        <div className="admin-layout">
            <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} navItems={navItems} />

            <div className="main-content" style={{ marginLeft: sidebarWidth }}>
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

export default TenantLayout;
