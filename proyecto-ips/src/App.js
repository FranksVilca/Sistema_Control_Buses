import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLogin from "./components/DashboardLogin";
import ComponenteUsuario from "./components/ComponenteUsuario";
import ComponenteGestorUsuarios from "./components/ComponenteGestorUsuarios";
import PaginaEdicionUsuario from "./components/PaginaEdicionUsuario"; // Importa la página de edición
import PaginaInsertarUsuario from "./components/PaginaInsertarUsuario";

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
        <Route
          path="/editar/:codigoUsuario"
          element={<PaginaEdicionUsuario />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
