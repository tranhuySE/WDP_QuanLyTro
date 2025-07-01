import StaffLayout from "../layouts/StaffLayout";
import HomePage from "../pages/Common/Homepage.jsx";

const StaffRoutes = {
    path: '/staff',
    element: <StaffLayout />,
    children: [
        { path: 'homepage', element: <HomePage /> },
    ]
};

export default StaffRoutes;