import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PaginaEdicionBus = () => {
  const { codigoBus } = useParams();
  const [bus, setBus] = useState({
    Num_Asientos: "",
    EstadoRegistro: "",
    Modelo: "",
    Marca: "",
    Placa: "",
  });
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/bus/${codigoBus}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setBus(data))
      .catch((error) => console.error("Error al obtener el bus:", error));
  }, [codigoBus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBus((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/api/update/bus/${codigoBus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bus),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar el bus");
      }
      alert("Bus actualizado exitosamente");
      navigate("/GestionarBuses");
    } catch (error) {
      console.error("Error al actualizar el bus:", error);
    }
  };

  return (
    <div>
      <h2>Editar Bus</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Número de Asientos:
          <input
            type="number"
            name="Num_Asientos"
            value={bus.Num_Asientos}
            min="0"
            max="50"
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <label>
          Estado de Registro:
          <select
            name="EstadoRegistro"
            value={bus.EstadoRegistro}
            onChange={handleChange}
            required // Campo obligatorio
          >
            <option value="">Selecciona un estado</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="En Mantenimiento">En Mantenimiento</option>
          </select>
        </label>
        <label>
          Modelo:
          <input
            type="text"
            name="Modelo"
            value={bus.Modelo}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <label>
          Marca:
          <input
            type="text"
            name="Marca"
            value={bus.Marca}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <label>
          Placa (formato AAA-123):
          <input
            type="text"
            name="Placa"
            value={bus.Placa}
            pattern="[A-Za-z]{3}-[0-9]{3}"
            title="Debe tener formato AAA-123 (3 letras seguidas de un guion y 3 números)"
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default PaginaEdicionBus;
