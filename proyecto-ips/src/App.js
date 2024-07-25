import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext'; 
import DashboardLogin from './components/DashboardLogin'; 
import ComponenteGestorUsuarios from "./Usuario/ComponenteGestorUsuarios";
import PaginaInsertarUsuario from "./Usuario/PaginaInsertarUsuario";
import ComponenteGestorBuses from "./Buses/ComponenteGestorBuses";
import PaginaInsertarBuses from "./Buses/PaginaInsertarBuses";
import PaginaEdicionBus from "./Buses/PaginaEdicionBuses";
import ComponenteGestorRuta from "./Rutas/ComponenteGestorRuta";
import PaginaInsertarRuta from "./Rutas/PaginaInsertarRuta";
import PaginaEdicionRuta from "./Rutas/PaginaEdicionRuta";
import TrabajadorRuta from "./Rutas/TrabajadorRuta";
import ComponenteGestorHorarios from "./Horarios/ComponenteGestorHorario";
import PaginaInsertarHorarios from "./Horarios/PaginaInsertarHorario";
import PaginaEdicionHorarios from "./Horarios/PaginaEdicionHorario";
import TrabajadorTurno from "./Turno/TrabajadorTurno";
import TrabajadorPerfil from "./Perfiles/TrabajadorPerfil";
import VistaAdmin from "./Vistas/VistaAdmin";
import VistaChofer from "./Vistas/VistaChofer";
import VistaUsuario from "./Vistas/VistaUsuario";
import PaginaEdicionUsuario from "./Usuario/PaginaEdicionUsuario";
import Asistencia from "./Asistencias/MarcarAsistencias";
import GestionarTurnos from "./Turno/ComponenteGestorTurnos";
import PaginaInsertarTurno from "./Turno/PaginaInsertarTurno";
import AsignarTurno from "./Turno/AsignarTurno";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user.Codigo_Cargo)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLogin />} />
          <Route
            path="/GestionarUsuarios"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <ComponenteGestorUsuarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/InsertarUsuario"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <PaginaInsertarUsuario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/InsertarBus"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <PaginaInsertarBuses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ComponenteGestorBuses"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <ComponenteGestorBuses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PaginaEdicionBus/:idBus"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <PaginaEdicionBus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PaginaInsertarRuta"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <PaginaInsertarRuta />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ComponenteGestorRuta"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <ComponenteGestorRuta />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PaginaEdicionRuta/:idRuta"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <PaginaEdicionRuta />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PaginaInsertarHorarios"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <PaginaInsertarHorarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ComponenteGestorHorarios"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <ComponenteGestorHorarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PaginaEdicionHorarios/:idHorario"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <PaginaEdicionHorarios />
              </ProtectedRoute>
            }
          />
          <Route path="/TrabajadorTurno" element={<TrabajadorTurno />} />
          <Route
            path="/editar/:codigo_usuario"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <PaginaEdicionUsuario />
              </ProtectedRoute>
            }
          />
         <Route
            path="/VistaAdmin/:codigoUsuario"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <VistaAdmin />
              </ProtectedRoute>
            }
          />
          <Route path="/TrabajadorRuta" element={<TrabajadorRuta />} />
          <Route
            path="/GestionarTurno"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <GestionarTurnos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/InsertarTurno"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <PaginaInsertarTurno />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Asistencia/:codigoTurno"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <Asistencia />
              </ProtectedRoute>
            }
          />
         <Route
            path="/VistaChofer/:codigoUsuario"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <VistaChofer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/VistaUsuario/:codigoUsuario"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <VistaUsuario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/TrabajadorPerfil/:codigoUsuario"
            element={
                <TrabajadorPerfil />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
