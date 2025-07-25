import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { auth } = useAuth();

    // Đợi AuthContext khởi tạo xong trước khi kiểm tra authentication
    if (!auth.initialized) {
        return <div>Loading...</div>; // Hoặc component loading spinner
    }

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(auth.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
