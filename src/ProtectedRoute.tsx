import { Navigate } from 'react-router-dom';
import { useAuth, type AuthUser } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AuthUser['role'][];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-brand">
            <h1>CampusCare</h1>
            <span className="login-subtitle">Memuat...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
