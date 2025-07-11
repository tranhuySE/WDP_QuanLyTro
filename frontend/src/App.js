// src/App.js
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import LoginPage from "./pages/Auth/LoginPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
import AdminRoutes from "./routes/AdminRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";
import StaffRoutes from "./routes/StaffRoutes";
import TenantRoutes from "./routes/TenantRoutes";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                    {/* Admin routes */}
                    <Route
                        path={AdminRoutes.path}
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                {AdminRoutes.element}
                            </ProtectedRoute>
                        }
                    >
                        {AdminRoutes.children.map((route, index) => (
                            <Route
                                key={`admin-${index}`}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                    </Route>

                    {/* Staff routes */}
                    <Route
                        path={StaffRoutes.path}
                        element={
                            <ProtectedRoute allowedRoles={['staff']}>
                                {StaffRoutes.element}
                            </ProtectedRoute>
                        }
                    >
                        {StaffRoutes.children.map((route, index) => (
                            <Route
                                key={`staff-${index}`}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                    </Route>

                    {/* Tenant routes */}
                    <Route
                        path={TenantRoutes.path}
                        element={
                            <ProtectedRoute allowedRoles={['user']}>
                                {TenantRoutes.element}
                            </ProtectedRoute>
                        }
                    >
                        {TenantRoutes.children.map((route, index) => (
                            <Route
                                key={`tenant-${index}`}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                    </Route>

                    {/* Fallback route */}
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
        </AuthProvider>
    );
}

export default App;