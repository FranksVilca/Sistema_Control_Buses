import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrimerComponente from "./components/PrimerComponente";
import ComponenteUsuario from "./components/ComponenteUsuario";
import ComponenteGestorUsuarios from "./components/ComponenteGestorUsuarios";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
