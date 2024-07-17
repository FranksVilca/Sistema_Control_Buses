import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaginaInsertarHorario = () => {
  const [horario, setHorario] = useState({
    Fecha: "",
    Hora_Salida: "",
    Hora_Llegada: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHorario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0]; // Obtener la fecha actual en formato ISO (YYYY-MM-DD)

    // Validar que la Fecha seleccionada no sea más antigua que la fecha actual
    if (horario.Fecha < today) {
      alert("La fecha no puede ser más antigua que el día actual.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/insert/horario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(horario),
      });
      if (!response.ok) {
        throw new Error("Error al insertar el horario");
      }
      alert("Horario insertado exitosamente");
      navigate("/GestionarHorarios");
    } catch (error) {
      console.error("Error al insertar el horario:", error);
    }
  };

  return (
    <div>
      <h2>Insertar Nuevo Horario</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Fecha:
          <input
            type="date"
            name="Fecha"
            value={horario.Fecha}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <label>
          Hora de Salida:
          <input
            type="time"
            name="Hora_Salida"
            value={horario.Hora_Salida}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <label>
          Hora de Llegada:
          <input
            type="time"
            name="Hora_Llegada"
            value={horario.Hora_Llegada}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <button type="submit">Insertar</button>
      </form>
    </div>
  );
};

export default PaginaInsertarHorario;
