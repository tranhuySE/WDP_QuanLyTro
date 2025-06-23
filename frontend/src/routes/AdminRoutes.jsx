// src/routes/AdminRoutes.jsx
import { Route, Routes, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import HomePage from "../pages/Admin/HomePage";
import UserDetail from "../pages/Admin/Users/UserDetail";
import UserManagement from "../pages/Admin/Users/UserManagement";

const AdminRoutes = () => {
    const location = useLocation();
    const state = location.state;
    const backgroundLocation = state?.backgroundLocation;

    return (
        <>
            <Routes location={backgroundLocation || location}>
                <Route path={ROUTES.ADMIN_HOMEPAGE} element={<HomePage />} />
                <Route path={ROUTES.ACCOUNTS_LIST} element={<UserManagement />} />
            </Routes>

            {backgroundLocation && (
                <Routes>
                    <Route path={ROUTES.ACCOUNTS_DETAIL} element={<UserDetail isModal />} />
                </Routes>
            )}
        </>
    );
};

export default AdminRoutes;
