import TenantLayout from "../layouts/TenantLayout";
import HomePage from "../pages/Common/Homepage.jsx";
import RequestPage from "../pages/User/RequestPage.jsx";
import RoomInfoPage from "../pages/User/RoomInfoPage.jsx";
import Payment_History from "../pages/Tenant/Payment_History.jsx";

// Tạo component wrapper riêng cho TenantLayout
const TenantLayoutWrapper = () => <TenantLayout />;

const TenantRoutes = {
  path: "/tenant",
  element: <TenantLayoutWrapper />,
  children: [
    { path: "homepage", element: <HomePage /> },
    { path: "room-info", element: <RoomInfoPage /> },
    { path: "requests", element: <RequestPage /> },
    { path: "payment-history", element: <Payment_History /> },
  ],
};

export default TenantRoutes;
