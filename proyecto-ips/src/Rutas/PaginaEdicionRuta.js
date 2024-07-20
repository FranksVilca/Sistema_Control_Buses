import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PaginaEdicionRuta = () => {
  const { idRuta } = useParams();
  const [ruta, setRuta] = useState({
    PuntoSalida: "",
    PuntoLlegada: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/ruta/${idRuta}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setRuta(data))
      .catch((error) => console.error("Error al obtener la ruta:", error));
  }, [idRuta]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRuta((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/api/update/ruta/${idRuta}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ruta),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar la ruta");
      }
      alert("Ruta actualizada exitosamente");
      navigate("/GestionarRutas");
    } catch (error) {
      console.error("Error al actualizar la ruta:", error);
    }
  };

  // Verificar si la ruta está cargada completamente antes de renderizar el formulario
  if (!ruta.PuntoSalida && !ruta.PuntoLlegada) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2>Editar Ruta</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Punto de Salida:
          <input
            type="text"
            name="PuntoSalida"
            value={ruta.PuntoSalida || ""}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Punto de Llegada:
          <input
            type="text"
            name="PuntoLlegada"
            value={ruta.PuntoLlegada || ""}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default PaginaEdicionRuta;
