import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout.jsx';
import StaffLayout from './layouts/StaffLayout.jsx';
import TenantLayout from './layouts/TenantLayout.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import AdminRoutes from './routes/AdminRoutes.jsx';
import { side_nav } from './routes/data_link';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function renderRoutes(routes) {
    return routes.map((route, index) => {
        if (route.children && route.children.length > 0) {
            return (
                <React.Fragment key={index}>
                    <Route path={route.path} element={route.element} />
                    {route.children.map((child, idx) => (
                        <Route key={`${index}-${idx}`} path={child.path} element={child.element} />
                    ))}
                </React.Fragment>
            );
        }
        return <Route key={index} path={route.path} element={route.element} />;
    });
}

function App() {
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
        setIsLoading(false);
    }, []);

    if (isLoading) return <div>Loading...</div>;

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />

                {role === 'admin' && (
                    <Route
                        path="/admin/"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        {renderRoutes(side_nav)}
                    </Route>
                )}

                <Route path="*" element={<AdminRoutes />} />

                {role === 'staff' && (
                    <Route
                        path="/staff/"
                        element={
                            <ProtectedRoute allowedRoles={['staff']}>
                                <StaffLayout />
                            </ProtectedRoute>
                        }
                    />
                )}

                {role === 'tenant' && (
                    <Route
                        path="/tenant/"
                        element={
                            <ProtectedRoute allowedRoles={['tenant', 'user']}>
                                <TenantLayout />
                            </ProtectedRoute>
                        }
                    />
                )}

                {/* fallback nếu không khớp */}
                <Route path="*" element={<LoginPage />} />
            </Routes>
        </Router>
    );
}

export default App;
