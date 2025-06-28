import { Bell, LogOut, Menu, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/SideBar/Topbar.css"; // Adjust the path as necessary

const Topbar = ({ sidebarWidth = 250 }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullname: "",
    username: "",
    role: ""
  });

  const notifications = [
    { id: 1, message: "Hóa đơn mới cần xử lý", time: "5 phút trước", type: "warning" },
    { id: 2, message: "Hợp đồng sắp hết hạn", time: "1 giờ trước", type: "info" },
    { id: 3, message: "Thanh toán thành công", time: "2 giờ trước", type: "success" }
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    const fullname = localStorage.getItem("fullname");

    if (token) {
      setIsLoggedIn(true);
      setUserInfo({ role, username, fullname });
    }
  }, []);

  const handleOutsideClick = () => {
    setShowProfileMenu(false);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("fullname");
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    navigate("/profile");
  };

  return (
    <>
      {/* Overlay for closing dropdowns */}
      {(showProfileMenu || showNotifications) && (
        <div className="dropdown-overlay" onClick={handleOutsideClick} />
      )}

      <div 
        className="topbar-container"
        style={{ "--sidebar-width": `${sidebarWidth}px` }}
      >
        <div className="topbar-content">
          {/* Left side */}
          <div className="topbar-left">
            <button className="mobile-menu-button">
              <Menu size={20} />
            </button>
            <div className="logo-container">
              <span className="logo-emoji">🎓</span>
              <span className="logo-text">Quản lý hệ thống</span>
            </div>
          </div>

          {/* Right side */}
          <div className="topbar-right">
            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <div className="notification-container">
                  <button
                    className="action-button"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell size={18} />
                    <span className="notification-badge">{notifications.length}</span>
                  </button>

                  {showNotifications && (
                    <div className="notifications-dropdown">
                      <div className="notifications-header">
                        <h6 className="notifications-title">Thông báo</h6>
                        <span className="notifications-count">{notifications.length} mới</span>
                      </div>
                      <div className="notifications-list">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="notification-item">
                            <div className="notification-content">
                              <div className={`notification-indicator ${notif.type}`} />
                              <div>
                                <p className="notification-message">{notif.message}</p>
                                <span className="notification-time">{notif.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="notifications-footer">
                        <button className="view-all-button">Xem tất cả</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Settings */}
                <button className="action-button">
                  <Settings size={18} />
                </button>

                {/* User Profile */}
                <div className="profile-container">
                  <button
                    className="user-profile-button"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <div className="user-avatar">
                      <User size={16} />
                    </div>
                    <div className="user-info">
                      <div className="user-name">
                        {userInfo.fullname || userInfo.username || "Người dùng"}
                      </div>
                      <div className="user-role">
                        {userInfo.role || "Khách"}
                      </div>
                    </div>
                  </button>

                  {showProfileMenu && (
                    <div className="profile-dropdown">
                      <button
                        className="profile-dropdown-item"
                        onClick={handleProfileClick}
                      >
                        <User size={16} className="profile-dropdown-icon" />
                        <span>Hồ sơ cá nhân</span>
                      </button>
                      <button
                        className="profile-dropdown-item logout"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} className="profile-dropdown-icon" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                className="login-button"
                onClick={() => navigate("/login")}
              >
                <User size={16} className="me-1" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;