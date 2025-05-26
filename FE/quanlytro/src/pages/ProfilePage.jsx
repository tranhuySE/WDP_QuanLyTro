import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  return (
    <div>
      <Link to="/profile/change-password">
        <Button variant="primary">Đổi mật khẩu</Button>
      </Link>
    </div>
  );
};

export default ProfilePage;
