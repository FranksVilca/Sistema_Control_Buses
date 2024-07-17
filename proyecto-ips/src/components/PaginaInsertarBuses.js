import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaginaInsertarBus = () => {
  const [bus, setBus] = useState({
    Num_Asientos: "",
    EstadoRegistro: "",
    Modelo: "",
    Marca: "",
    Placa: "",
  });

  const navigate = useNavigate();

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
      const response = await fetch(`http://localhost:3001/api/insert/bus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bus),
      });
      if (!response.ok) {
        throw new Error("Error al insertar el bus");
      }
      alert("Bus insertado exitosamente");
      navigate("/GestionarBuses");
    } catch (error) {
      console.error("Error al insertar el bus:", error);
    }
  };

  return (
    <div>
      <h2>Insertar Nuevo Bus</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Número de Asientos:
          <input
            type="number"
            name="Num_Asientos"
            value={bus.Num_Asientos}
            onChange={handleChange}
            required // Campo obligatorio
            min="0"
            max="50"
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
            onChange={handleChange}
            pattern="[A-Za-z]{3}-[0-9]{3}"
            title="Debe tener formato AAA-123 (3 letras seguidas de un guion y 3 números)"
            required // Campo obligatorio
          />
        </label>
        <button type="submit">Insertar</button>
      </form>
    </div>
  );
};

export default PaginaInsertarBus;
