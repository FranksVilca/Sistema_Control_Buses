import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLogin from "./components/DashboardLogin";
import ComponenteGestorUsuarios from "./Usuario/ComponenteGestorUsuarios";
import PaginaInsertarUsuario from "./Usuario/PaginaInsertarUsuario";
import ComponenteGestorBuses from "./Buses/ComponenteGestorBuses";
import PaginaInsertarBuses from "./Buses/PaginaInsertarBuses";
import PaginaEdicionBus from "./Buses/PaginaEdicionBuses";
import ComponenteGestorRuta from "./Rutas/ComponenteGestorRuta";
import PaginaInsertarRuta from "./Rutas/PaginaInsertarRuta";
import PaginaEdicionRuta from "./Rutas/PaginaEdicionRuta";
import ComponenteGestorHorarios from "./Horarios/ComponenteGestorHorario";
import PaginaInsertarHorarios from "./Horarios/PaginaInsertarHorario";
import PaginaEdicionHorarios from "./Horarios/PaginaEdicionHorario";
import TrabajadorTurno from "./Turno/TrabajadorTurno";
import TrabajadorPerfil from './Perfiles/TrabajadorPerfil';
import GestionarBuses from './Vistas/GestionarBuses';
import GestionarRuta from './Vistas/GestionarRuta';
import PaginaEdicionUsuario from "./Usuario/PaginaEdicionUsuario";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLogin />} />
        <Route
          path="/GestionarUsuarios"
          element={<ComponenteGestorUsuarios />}
        />
        <Route path="/InsertarUsuario" element={<PaginaInsertarUsuario />} />
        <Route path="/PaginaEdicionUsuario" element={<PaginaEdicionUsuario />} />
        <Route path="/InsertarBus" element={<PaginaInsertarBuses/>} />
        <Route path="/ComponenteGestorBuses" element={<ComponenteGestorBuses />} />
        <Route path="/PaginaEdicionBus" element={<PaginaEdicionBus />} />
        <Route path="/PaginaInsertarRuta" element={<PaginaInsertarRuta />} />
        <Route path="/ComponenteGestorRuta" element={<ComponenteGestorRuta />} />
        <Route path="/PaginaEdicionRuta" element={<PaginaEdicionRuta />} />
        <Route path="/PaginaInsertarHorarios" element={<PaginaInsertarHorarios />} />
        <Route path="/ComponenteGestorHorarios" element={<ComponenteGestorHorarios />} />
        <Route path="/PaginaEdicionHorarios" element={<PaginaEdicionHorarios />} />
        <Route path="/TrabajadorTurno" element={<TrabajadorTurno />} />
        <Route path="/TrabajadorPerfil" element={<TrabajadorPerfil />} />
        <Route path="/GestionarBuses" element={<GestionarBuses />} />
        <Route path="/GestionarRuta" element={<GestionarRuta />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;