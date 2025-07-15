import StaffLayout from '../layouts/StaffLayout';
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
        { path: 'requests', element: <RequestManagement /> },
    ],
};

export default StaffRoutes;
