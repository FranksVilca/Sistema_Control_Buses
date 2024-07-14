//D:\Nueva carpeta\Sistema_Control_Buses\proyecto-ips\src\App.js
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrimerComponente from "./components/PrimerComponente";
import ComponenteUsuario from "./components/ComponenteUsuario";
import ComponenteGestorUsuarios from "./components/ComponenteGestorUsuarios";
import PaginaEdicionUsuario from "./components/PaginaEdicionUsuario"; // Importa la página de edición

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrimerComponente />} />
        <Route path="/usuarios" element={<ComponenteUsuario />} />
        <Route
          path="/GestionarUsuarios"
          element={<ComponenteGestorUsuarios />}
        />
        <Route
          path="/editar/:codigoUsuario"
          element={<PaginaEdicionUsuario />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
