// src/routes/AdminRoutes.js
import HouseServiceList from '../components/HouseService/HouseServiceList';
import AdminLayout from '../layouts/AdminLayout';
import AdminHomePage from '../pages/Admin/AdminHomePage';
import ContractPage from '../pages/Admin/Contract/ContractPage';
import Analyst from '../pages/Admin/Dasboard/Analyst';
import RequestManagement from '../pages/Admin/Request';
import ManageRoomPage from '../pages/Admin/Rooms/ManageRoomPage';
import UserManagement from '../pages/Admin/Users/UserManagement';
import ChangePasswordPage from '../pages/Common/ChangePasswordPage';
import EditProfilePage from '../pages/Common/EditProfilePage';

// Tạo component wrapper riêng
const AdminLayoutWrapper = () => <AdminLayout />;

const AdminRoutes = {
    path: '/admin',
    element: <AdminLayoutWrapper />,
    children: [
        { path: 'homepage', element: <AdminHomePage /> },
        { path: 'dashboard', element: <Analyst /> },
        { path: 'users', element: <UserManagement /> },
        { path: 'rooms', element: <ManageRoomPage /> },
        { path: 'contracts', element: <ContractPage /> },
        { path: 'requests', element: <RequestManagement /> },
        { path: 'change-password', element: <ChangePasswordPage /> },
        { path: 'services', element: <HouseServiceList /> },
        { path: 'profile', element: <EditProfilePage /> },
        { path: '', element: <AdminHomePage /> }, // Route mặc định
    ],
};

export default AdminRoutes;
