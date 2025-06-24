import { useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SideRightHeader = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({});

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("fullname");

        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <div className="d-flex h-100 justify-content-end align-items-center">
            {isLoggedIn && (
                <>
                    <Image
                        src="https://via.placeholder.com/32"
                        alt="User Avatar"
                        roundedCircle
                        width={32}
                        height={32}
                        className="me-2"
                    />
                    <span className="text-dark me-2" style={{ fontSize: "0.9rem" }}>
                        <strong>Xin chào, {userInfo.fullname || userInfo.username || "Người dùng"}</strong>
                    </span>
                </>
            )}

            <Button
                variant={isLoggedIn ? "outline-danger" : "outline-primary"}
                size="sm"
                className="ms-2"
                style={{ fontSize: "0.8rem" }}
                onClick={() => {
                    isLoggedIn ? handleLogout() : navigate("/login");
                }}
            >
                {isLoggedIn ? (
                    <>
                        <FaSignOutAlt size={12} className="me-1" />
                        Đăng xuất
                    </>
                ) : (
                    <>
                        <FaSignInAlt size={12} className="me-1" />
                        Đăng nhập
                    </>
                )}
            </Button>
        </div>
    );
};

export default SideRightHeader;
