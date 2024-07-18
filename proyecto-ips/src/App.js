import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLogin from "./components/DashboardLogin";
import ComponenteUsuario from "./components/ComponenteUsuario";
import ComponenteGestorUsuarios from "./components/ComponenteGestorUsuarios";
import PaginaInsertarUsuario from "./components/PaginaInsertarUsuario";
import ComponenteGestorBuses from "./components/ComponenteGestorBuses";
import PaginaInsertarBuses from "./components/PaginaInsertarBuses";
import PaginaEdicionBus from "./components/PaginaEdicionBuses";
import ComponenteGestorRuta from "./components/ComponenteGestorRuta";
import PaginaInsertarRuta from "./components/PaginaInsertarRuta";
import PaginaEdicionRuta from "./components/PaginaEdicionRuta";
import ComponenteGestorHorarios from "./components/ComponenteGestorHorario";
import PaginaInsertarHorarios from "./components/PaginaInsertarHorario";
import PaginaEdicionHorarios from "./components/PaginaEdicionHorario";
import TrabajadorTurno from "./components/TrabajadorTurno";
import TrabajadorPerfil from './components/TrabajadorPerfil';
import GestionarBuses from './willy/GestionarBuses';
import GestionarRuta from './willy/GestionarRuta';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLogin />} />
        <Route path="/usuarios" element={<ComponenteUsuario />} />
        <Route
          path="/GestionarUsuarios"
          element={<ComponenteGestorUsuarios />}
        />
        <Route path="/InsertarUsuario" element={<PaginaInsertarUsuario />} />
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