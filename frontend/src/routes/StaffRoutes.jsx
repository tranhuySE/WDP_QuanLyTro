import StaffLayout from '../layouts/StaffLayout';
import HomePage from '../pages/Common/Homepage.jsx';
import InvoicesPage from '../pages/Staff/InvoicesPage.jsx';

const StaffRoutes = {
    path: '/staff',
    element: <StaffLayout />,
    children: [
        { path: 'homepage', element: <HomePage /> },
        { path: 'invoices', element: <InvoicesPage /> },
    ],
};

export default StaffRoutes;
