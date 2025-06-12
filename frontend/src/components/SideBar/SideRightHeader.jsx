import { Button, Image } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SideRightHeader = () => {
    const isLoggedIn = false;
    const navigate = useNavigate();

    return (
        <div className="d-flex h-100 justify-content-end">
            {isLoggedIn && (
                <Image
                    src="https://via.placeholder.com/32"
                    alt="User Avatar"
                    roundedCircle
                    width={32}
                    height={32}
                />
            )}

            {isLoggedIn && (
                <span className="text-dark" style={{ fontSize: "0.9rem" }}>
                    Nguyen Van A
                </span>
            )}

            <Button
                variant={isLoggedIn ? "outline-danger" : "outline-primary"}
                size="sm"
                className="ms-2"
                style={{ fontSize: "0.8rem" }}
                onClick={() => {
                    if (isLoggedIn) {
                        console.log("Logging out...");
                    } else {
                        navigate("/login");
                    }
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
