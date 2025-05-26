import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { side_nav } from "../../navigation/data_link";
import { Link, useLocation } from "react-router-dom";
import "./SideNav.css";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const SideNav = ({ collapsed }) => {
  const location = useLocation();
  const [openItems, setOpenItems] = useState({});

  const toggleOpen = (path) => {
    setOpenItems((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const renderNavItems = (items, level = 0) => {
    return items.map((item, index) => {
      const isActive = location.pathname === item.path;
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openItems[item.path];

      return (
        <div key={item.path + index}>
          <Nav.Link
            as={hasChildren ? "button" : Link}
            to={hasChildren ? undefined : item.path}
            onClick={() => hasChildren && toggleOpen(item.path)}
            className={`sidebar-link d-flex align-items-center gap-2 py-2 w-100 text-start ${
              isActive ? "active" : ""
            }`}
            style={{ paddingLeft: `${level * 20 + 10}px` }}
          >
            <span>{item.icon}</span>
            {!collapsed && (
              <>
                <span className="flex-grow-1">{item.name}</span>
                {hasChildren &&
                  (isOpen ? (
                    <FaChevronDown size={12} />
                  ) : (
                    <FaChevronRight size={12} />
                  ))}
              </>
            )}
          </Nav.Link>
          {hasChildren && isOpen && renderNavItems(item.children, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="flex-column sidebar">
      <Nav className="flex-column">{renderNavItems(side_nav)}</Nav>
    </div>
  );
};

export default SideNav;
