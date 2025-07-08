import TenantLayout from "../layouts/TenantLayout";
import HomePage from "../pages/Common/Homepage.jsx";
// Đảm bảo import đúng đường dẫn
import Payment_History from "../pages/Tenant/Payment_History.jsx";

const TenantRoutes = {
  path: "/tenant",
  element: <TenantLayout />,
  children: [
    { path: "homepage", element: <HomePage /> },
    // Dòng này đã đúng
    { path: "payment-history", element: <Payment_History /> },
  ],
};

export default TenantRoutes;
