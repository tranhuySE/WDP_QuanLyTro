import TenantLayout from "../layouts/TenantLayout";
import HomePage from "../pages/Common/Homepage.jsx";

// Tạo component wrapper riêng cho TenantLayout
const TenantLayoutWrapper = () => <TenantLayout />;

const TenantRoutes = {
    path: '/tenant',
    element: <TenantLayoutWrapper />,
    children: [
        { path: 'homepage', element: <HomePage /> },
    ]
};

export default TenantRoutes;