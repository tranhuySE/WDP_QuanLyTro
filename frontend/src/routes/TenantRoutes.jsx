import TenantLayout from "../layouts/TenantLayout";
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
  ],
};

export default TenantRoutes;
