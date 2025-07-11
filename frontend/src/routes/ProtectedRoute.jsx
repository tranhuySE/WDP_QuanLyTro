import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { auth } = useAuth();

  if (!auth.isAuthenticated || !allowedRoles.includes(auth.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;