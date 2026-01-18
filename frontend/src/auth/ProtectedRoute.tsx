import { useContext } from "react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("admin" | "manager" | "user")[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const authContext = useContext(AuthContext);

  if (!authContext) return null;

  // 🔑 WAIT until auth is restored
  if (authContext.isLoading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!authContext.token) {
    return <Navigate to="/login" replace />;
  }

  // Role-based check
  if (
    allowedRoles &&
    authContext.user &&
    !allowedRoles.includes(authContext.user.role)
  ) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
