import TenantLayout from "../layouts/TenantLayout";
import HomePage from "../pages/Common/Homepage.jsx";

const TenantRoutes = {
    path: '/tenant',
    element: <TenantLayout />,
    children: [
        { path: 'homepage', element: <HomePage /> },
    ]
};

export default TenantRoutes;