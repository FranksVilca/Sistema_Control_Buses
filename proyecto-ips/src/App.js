import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { ThemeProvider } from "./components/ThemeContext";
import {
  ProtectedRoute,
  PublicRoute,
  FallbackRoute,
} from "./components/ProtectedRoute";
import DashboardLogin from "./components/DashboardLogin";
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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Ruta Pública (Login) */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <DashboardLogin />
                </PublicRoute>
              }
            />

            {/* ================= RUTAS DE ADMINISTRADOR (Rol 1) ================= */}
            <Route
              path="/VistaAdmin"
              element={
                <ProtectedRoute allowedRoles={[1]}>
                  <VistaAdmin />
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
              path="/editar"
              element={
                <ProtectedRoute allowedRoles={[1]}>
                  <PaginaEdicionUsuario />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editar/:codigoUsuario"
              element={
                <ProtectedRoute allowedRoles={[1]}>
                  <PaginaEdicionUsuario />
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
              path="/InsertarBus"
              element={
                <ProtectedRoute allowedRoles={[1]}>
                  <PaginaInsertarBuses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/PaginaEdicionBus"
              element={
                <ProtectedRoute allowedRoles={[1]}>
                  <PaginaEdicionBus />
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
              path="/ComponenteGestorRuta"
              element={
                <ProtectedRoute allowedRoles={[1]}>
                  <ComponenteGestorRuta />
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
              path="/PaginaEdicionRuta"
              element={
                <ProtectedRoute allowedRoles={[1]}>
                  <PaginaEdicionRuta />
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
              path="/ComponenteGestorHorarios"
              element={
                <ProtectedRoute allowedRoles={[1]}>
                  <ComponenteGestorHorarios />
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
              path="/PaginaEdicionHorarios"
              element={
                <ProtectedRoute allowedRoles={[1]}>
                  <PaginaEdicionHorarios />
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
              path="/asignarTurno"
              element={
                <ProtectedRoute allowedRoles={[1]}>
                  <AsignarTurno />
                </ProtectedRoute>
              }
            />
            <Route
              path="/asignarTurno/:codigoTurno/:numAsientos"
              element={
                <ProtectedRoute allowedRoles={[1]}>
                  <AsignarTurno />
                </ProtectedRoute>
              }
            />

            {/* ================= RUTAS DE TRABAJADOR (Rol 2 y Admin 1) ================= */}
            <Route
              path="/VistaUsuario"
              element={
                <ProtectedRoute allowedRoles={[2, 1]}>
                  <VistaUsuario />
                </ProtectedRoute>
              }
            />
            <Route
              path="/VistaUsuario/:codigoUsuario"
              element={
                <ProtectedRoute allowedRoles={[2, 1]}>
                  <VistaUsuario />
                </ProtectedRoute>
              }
            />
            <Route
              path="/TrabajadorTurno"
              element={
                <ProtectedRoute allowedRoles={[2, 1]}>
                  <TrabajadorTurno />
                </ProtectedRoute>
              }
            />

            {/* ================= RUTAS DE CHOFER (Rol 3 y Admin 1) ================= */}
            <Route
              path="/VistaChofer"
              element={
                <ProtectedRoute allowedRoles={[3, 1]}>
                  <VistaChofer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/VistaChofer/:codigoUsuario"
              element={
                <ProtectedRoute allowedRoles={[3, 1]}>
                  <VistaChofer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Asistencia"
              element={
                <ProtectedRoute allowedRoles={[3, 1]}>
                  <Asistencia />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Asistencia/:codigoTurno"
              element={
                <ProtectedRoute allowedRoles={[3, 1]}>
                  <Asistencia />
                </ProtectedRoute>
              }
            />

            {/* ================= RUTAS COMPARTIDAS AUTENTICADAS (Roles 1, 2, 3) ================= */}
            <Route
              path="/TrabajadorPerfil"
              element={
                <ProtectedRoute allowedRoles={[1, 2, 3]}>
                  <TrabajadorPerfil />
                </ProtectedRoute>
              }
            />
            <Route
              path="/TrabajadorPerfil/:codigoUsuario"
              element={
                <ProtectedRoute allowedRoles={[1, 2, 3]}>
                  <TrabajadorPerfil />
                </ProtectedRoute>
              }
            />
            <Route
              path="/TrabajadorRuta"
              element={
                <ProtectedRoute allowedRoles={[1, 2, 3]}>
                  <TrabajadorRuta />
                </ProtectedRoute>
              }
            />

            {/* ================= RUTA COMODÍN (404 / No encontrada) ================= */}
            <Route path="*" element={<FallbackRoute />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

