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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
