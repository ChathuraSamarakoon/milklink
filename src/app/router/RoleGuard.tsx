import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { Role } from '../../features/auth/components/AuthUI';
import { getSession } from '../../features/auth/components/mockAuth';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const location = useLocation();
  const session = getSession();

  if (!session) {
    // Redirect unauthenticated user to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    // If authenticated but role not allowed, route to their own role dashboard
    return <Navigate to={`/${session.role}`} replace />;
  }

  return <>{children}</>;
}
