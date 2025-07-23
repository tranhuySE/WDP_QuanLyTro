import TenantLayout from '../layouts/TenantLayout';
import ChangePasswordPage from '../pages/Common/ChangePasswordPage.jsx';
import EditProfilePage from '../pages/Common/EditProfilePage.jsx';
import HomePage from '../pages/Common/Homepage.jsx';
import RequestPage from '../pages/User/RequestPage.jsx';
import RoomInfoPage from '../pages/User/RoomInfoPage.jsx';
import Payment_History from '../pages/Tenant/Payment_History.jsx';
import Invoice from '../pages/Tenant/Invoice.jsx';

// Tạo component wrapper riêng cho TenantLayout
const TenantLayoutWrapper = () => <TenantLayout />;

const TenantRoutes = {
    path: '/tenant',
    element: <TenantLayoutWrapper />,
    children: [
        { path: 'homepage', element: <HomePage /> },
        { path: 'room-info', element: <RoomInfoPage /> },
        { path: 'room-invoice', element: <Invoice /> },
        { path: 'change-password', element: <ChangePasswordPage /> },
        { path: 'profile', element: <EditProfilePage /> },
        { path: 'requests', element: <RequestPage /> },
        { path: 'payment-history', element: <Payment_History /> },
    ],
};

export default TenantRoutes;
