// src/App.js
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/Auth/LoginPage.jsx"; // Giả sử bạn có một trang đăng nhập
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage.jsx";
import AdminRoutes from "./routes/AdminRoutes";
import StaffRoutes from "./routes/StaffRoutes.jsx";
import TenantRoutes from "./routes/TenantRoutes.jsx";

function App() {
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);
        setIsLoading(false);
    }, []);

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* Các route public có thể thêm ở đây */}
                    {/* ... */}
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                    {/* Route admin */}
                    {role === "admin" && (
                        <Route path={AdminRoutes.path} element={AdminRoutes.element}>
                            {AdminRoutes.children.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}
                        </Route>
                    )}

                    {/* Route staff */}
                    {role === "staff" && (
                        <Route path={StaffRoutes.path} element={StaffRoutes.element}>
                            {StaffRoutes.children.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}
                        </Route>
                    )}

                    {/* Route user */}
                    {role === "tenant" && (
                        <Route path={TenantRoutes.path} element={TenantRoutes.element}>
                            {TenantRoutes.children.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}
                        </Route>
                    )}

                    <Route path="*" element={<LoginPage />} />
                </Routes>
            </BrowserRouter>
            
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
}

export default App;