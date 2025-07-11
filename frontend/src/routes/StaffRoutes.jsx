import StaffLayout from '../layouts/StaffLayout';
import HomePage from '../pages/Common/Homepage.jsx';
import InvoicesPage from '../pages/Staff/InvoicesPage.jsx';

// Tạo component wrapper riêng cho StaffLayout
const StaffLayoutWrapper = () => <StaffLayout />;

const StaffRoutes = {
    path: '/staff',
    element: <StaffLayoutWrapper />,
    children: [
        { path: 'homepage', element: <HomePage /> },
        { path: 'invoices', element: <InvoicesPage /> },
    ],
};

export default StaffRoutes;
