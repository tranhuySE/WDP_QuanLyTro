// src/routes/AdminRoutes.js
import AdminLayout from "../layouts/AdminLayout";
import AdminHomePage from "../pages/Admin/AdminHomePage.jsx";
import ContractPage from "../pages/Admin/Contract/ContractPage.jsx";
import Analyst from "../pages/Admin/Dasboard/Analyst.jsx";
import ManageRoomPage from "../pages/Admin/Rooms/ManageRoomPage.jsx";
// import ServiceManagement from "../pages/ServiceManagement";
import RequestManagement from "../pages/Admin/RequestManagement/index.jsx";
import UserManagement from "../pages/Admin/Users/UserManagement.jsx";

const AdminRoutes = {
    path: '/admin',
    element: <AdminLayout />,
    children: [
        { path: 'homepage', element: <AdminHomePage /> },
        { path: 'dashboard', element: <Analyst /> },
        { path: 'users', element: <UserManagement /> },
        { path: 'rooms', element: <ManageRoomPage /> },
        // { path: 'invoices', element: <InvoiceManagement /> },
        { path: 'contracts', element: <ContractPage /> },
        // { path: 'services', element: <ServiceManagement /> },
        { path: 'requests', element: <RequestManagement /> },
        // // Có thể thêm route mặc định hoặc catch-all ở đây nếu cần
        // { path: '', element: <HomePage /> }, // Mặc định khi vào /admin
    ]
};

export default AdminRoutes;