import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Swal from "sweetalert2";

/**
 * Protege rutas privadas verificando autenticación y permisos por rol (Codigo_Cargo).
 * Roles del sistema:
 *  1 = Administrador
 *  2 = Trabajador
 *  3 = Chofer
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, getHomeRoute } = useAuth();
  const location = useLocation();

  const isAuthenticated = Boolean(user);
  const userRole = user ? Number(user.Codigo_Cargo) : null;
  const isAuthorized =
    isAuthenticated &&
    (!allowedRoles || allowedRoles.map(Number).includes(userRole));

  useEffect(() => {
    if (!isAuthenticated) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Inicia sesión para acceder a esta sección",
        showConfirmButton: false,
        timer: 2500,
      });
    } else if (!isAuthorized) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Acceso restringido para tu rol de usuario",
        showConfirmButton: false,
        timer: 2800,
      });
    }
  }, [isAuthenticated, isAuthorized, location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to={getHomeRoute()} replace />;
  }

  return children;
};

/**
 * Ruta pública (Login): si el usuario ya tiene sesión activa,
 * lo redirige automáticamente a su panel principal según su rol.
 */
export const PublicRoute = ({ children }) => {
  const { user, getHomeRoute } = useAuth();

  if (user) {
    return <Navigate to={getHomeRoute()} replace />;
  }

  return children;
};

/**
 * Redirección para rutas no encontradas (404 / comodín *).
 */
export const FallbackRoute = () => {
  const { user, getHomeRoute } = useAuth();
  return <Navigate to={user ? getHomeRoute() : "/"} replace />;
};

export default ProtectedRoute;
