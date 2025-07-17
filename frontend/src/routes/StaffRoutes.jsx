import StaffLayout from '../layouts/StaffLayout';
import ChangePasswordPage from '../pages/Common/ChangePasswordPage.jsx';
import EditProfilePage from '../pages/Common/EditProfilePage.jsx';
import RequestManagement from '../pages/Admin/Request/index.jsx';
import HomePage from '../pages/Common/Homepage.jsx';
import InvoicesPage from '../pages/Staff/InvoicesPage.jsx';
import UserInfor from '../pages/Staff/UserInfor.jsx';

// Tạo component wrapper riêng cho StaffLayout
const StaffLayoutWrapper = () => <StaffLayout />;

const StaffRoutes = {
    path: '/staff',
    element: <StaffLayoutWrapper />,
    children: [
        { path: 'homepage', element: <HomePage /> },
        { path: 'users', element: <UserInfor />},
        { path: 'invoices', element: <InvoicesPage /> },
            { path : 'change-password', element : <ChangePasswordPage/>},
                   { path : 'profile', element : <EditProfilePage/>},
        { path: 'requests', element: <RequestManagement /> },
    ],
};

export default StaffRoutes;
