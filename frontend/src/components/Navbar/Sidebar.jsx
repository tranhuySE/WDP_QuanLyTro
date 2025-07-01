import {
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/SideBar/Sidebar.css'; // Assuming you have a CSS file for styles

const Sidebar = ({ isCollapsed, onToggle, navItems }) => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname);

    const handleItemClick = (path) => {
        setActiveItem(path);
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Header */}
            <div className="sidebar-header">
                <div className="header-content">
                    {!isCollapsed && (
                        <div className="brand-info">
                            <div className="brand-logo">
                                🏠
                            </div>
                            <div className="brand-text">
                                <h5 className="brand-title">Trọ Quang Huy</h5>
                                <p className="brand-subtitle">Quản lý chuyên nghiệp</p>
                            </div>
                        </div>
                    )}

                    <button
                        className="toggle-btn"
                        onClick={onToggle}
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.path;

                    return (
                        <div key={item.path} className="nav-item-wrapper">
                            <Link
                                to={item.path}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => handleItemClick(item.path)}
                            >
                                <div className="nav-icon">
                                    <Icon size={20} />
                                </div>

                                {!isCollapsed && (
                                    <span className="nav-label">
                                        {item.label}
                                    </span>
                                )}

                                {/* Active indicator */}
                                {isActive && <div className="active-indicator" />}
                            </Link>
                        </div>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                {!isCollapsed && (
                    <div className="footer-card">
                        <div className="admin-avatar">
                            👨‍💼
                        </div>
                        <h6 className="admin-title">Admin Panel</h6>
                        <p className="admin-version">Phiên bản 2.0</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;