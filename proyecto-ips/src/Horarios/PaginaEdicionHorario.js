import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PaginaEdicionHorario = () => {
  const { idHorario } = useParams();
  const [horario, setHorario] = useState({
    Fecha: "",
    Hora_Salida: "",
    Hora_Llegada: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchHorario();
  }, [idHorario]);

  const fetchHorario = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/horario/${idHorario}`);
      if (!response.ok) {
        throw new Error("Error al obtener el horario");
      }
      const data = await response.json();
      setHorario(data);
    } catch (error) {
      console.error("Error al obtener el horario:", error);
    }
  };

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
      const response = await fetch(
        `http://localhost:3001/api/update/horario/${idHorario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(horario),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar el horario");
      }
      alert("Horario actualizado exitosamente");
      navigate("/GestionarHorarios");
    } catch (error) {
      console.error("Error al actualizar el horario:", error);
    }
  };

  // Verificar si el horario está cargado completamente antes de renderizar el formulario
  if (!horario.Fecha) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2>Editar Horario</h2>
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
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default PaginaEdicionHorario;
