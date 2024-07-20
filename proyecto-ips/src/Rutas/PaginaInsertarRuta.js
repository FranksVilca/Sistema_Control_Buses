import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaginaInsertarRuta = () => {
  const [ruta, setRuta] = useState({
    PuntoSalida: "",
    PuntoLlegada: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRuta((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getMaxCodigoRuta = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/maxCodigoRuta`
      );
      if (!response.ok) {
        throw new Error("Error al obtener el máximo código de ruta");
      }
      const data = await response.json();
      return data.maxCodigoRuta;
    } catch (error) {
      console.error("Error al obtener el máximo código de ruta:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ruta.PuntoSalida || !ruta.PuntoLlegada) {
      alert("Todos los campos deben estar llenos.");
      return;
    }
    try {
      const maxCodigoRuta = await getMaxCodigoRuta();
      if (maxCodigoRuta !== null) {
        const nuevoCodigoRuta = maxCodigoRuta + 1;
        const rutaConCodigo = {
          ...ruta,
          IDRuta: nuevoCodigoRuta,
        };
        const response = await fetch(`http://localhost:3001/api/insert/ruta`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rutaConCodigo),
        });
        if (!response.ok) {
          throw new Error("Error al insertar la ruta");
        }
        alert("Ruta insertada exitosamente");
        navigate("/GestionarRutas");
      }
    } catch (error) {
      console.error("Error al insertar la ruta:", error);
    }
  };

  return (
    <div>
      <h2>Insertar Nueva Ruta</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Punto de Salida:
          <input
            type="text"
            name="PuntoSalida"
            value={ruta.PuntoSalida}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Punto de Llegada:
          <input
            type="text"
            name="PuntoLlegada"
            value={ruta.PuntoLlegada}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Insertar</button>
      </form>
    </div>
  );
};

export default PaginaInsertarRuta;
