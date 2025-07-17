import TenantLayout from "../layouts/TenantLayout";
import ChangePasswordPage from "../pages/Common/ChangePasswordPage.jsx";
import EditProfilePage from "../pages/Common/EditProfilePage.jsx";
import HomePage from "../pages/Common/Homepage.jsx";
import RoomInfoPage from "../pages/User/RoomInfoPage.jsx";

// Tạo component wrapper riêng cho TenantLayout
const TenantLayoutWrapper = () => <TenantLayout />;

const TenantRoutes = {
  path: "/tenant",
  element: <TenantLayoutWrapper />,
  children: [
    { path: "homepage", element: <HomePage /> },
    { path: "room-info", element: <RoomInfoPage /> },
        { path : 'change-password', element : <ChangePasswordPage/>},
         { path : 'profile', element : <EditProfilePage/>},
  ],
};

export default TenantRoutes;
