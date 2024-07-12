import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrimerComponente from "./components/PrimerComponente";
import ComponenteUsuario from "./components/ComponenteUsuario";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrimerComponente />} />
        <Route path="/usuarios" element={<ComponenteUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
