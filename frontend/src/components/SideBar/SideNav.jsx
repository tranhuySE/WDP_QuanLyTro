import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { FaChevronDown } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { side_nav } from '../../routes/data_link.jsx';
import '../../styles/SideBar/SideNav.css';

const SideNav = ({ collapsed }) => {
    const location = useLocation();
    const [openItems, setOpenItems] = useState({});

    const toggleOpen = (uniqueKey) => {
        setOpenItems((prev) => ({ ...prev, [uniqueKey]: !prev[uniqueKey] }));
    };

    const renderNavItems = (items, level = 0, parentKey = '') => {
        return items.map((item, index) => {
            const uniqueKey = parentKey
                ? `${parentKey}-${index}-${item.name}`
                : `${index}-${item.name}`;

            const isActive = item.path && location.pathname === item.path;
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openItems[uniqueKey];

            return (
                <div key={uniqueKey}>
                    <Nav.Link
                        as={hasChildren ? 'button' : Link}
                        to={hasChildren ? undefined : item.path}
                        onClick={() => hasChildren && toggleOpen(uniqueKey)}
                        className={`sidebar-link d-flex align-items-center w-100 text-start ${
                            isActive ? 'active' : ''
                        }`}
                        style={{ paddingLeft: `${level * 20 + 10}px` }}
                    >
                        <span className="mx-2">{item.icon}</span>
                        {!collapsed && (
                            <>
                                <span className="flex-grow-1">{item.name}</span>
                                {hasChildren && (
                                    <span
                                        className="chevron-icon"
                                        style={{
                                            transition: 'transform 0.2s ease',
                                            transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                                        }}
                                    >
                                        <FaChevronDown size={12} />
                                    </span>
                                )}
                            </>
                        )}
                    </Nav.Link>
                    {hasChildren && !collapsed && (
                        <div
                            className={`children-container ${isOpen ? 'open' : 'closed'}`}
                            style={{
                                maxHeight: isOpen ? '1000px' : '0',
                                overflow: 'hidden',
                                transition: 'max-height 0.3s ease-in-out',
                            }}
                        >
                            {renderNavItems(item.children, level + 1, uniqueKey)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className={`flex-column sidebar ${collapsed ? 'collapsed' : ''}`}>
            <Nav className="flex-column">{renderNavItems(side_nav)}</Nav>
        </div>
    );
};

export default SideNav;
