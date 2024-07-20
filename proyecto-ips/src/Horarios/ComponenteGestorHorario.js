import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ComponenteGestorHorarios = () => {
  const [horarios, setHorarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHorarios();
  }, []);

  const fetchHorarios = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/horarios");
      if (!response.ok) {
        throw new Error("Error al obtener los horarios");
      }
      const data = await response.json();
      setHorarios(data);
    } catch (error) {
      console.error("Error al obtener la lista de horarios:", error);
    }
  };

  const handleDelete = async (idHorario) => {
    console.log("ID del horario a eliminar:", idHorario);
    if (window.confirm("¿Estás seguro que deseas eliminar este horario?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/delete/horario/${idHorario}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Error al eliminar el horario");
        }
        fetchHorarios();
      } catch (error) {
        console.error("Error al eliminar el horario:", error);
      }
    }
  };

  const handleEdit = (idHorario) => {
    navigate(`/editar/horario/${idHorario}`);
  };

  return (
    <div>
      <button onClick={() => navigate("/InsertarHorario")}>
        Insertar Horario
      </button>
      <h2>Lista de Horarios</h2>
      <table>
        <thead>
          <tr>
            <th>ID de Horario</th>
            <th>Fecha</th>
            <th>Hora de Salida</th>
            <th>Hora de Llegada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {horarios.map((horario) => (
            <tr key={horario.IDHorario}>
              <td>{horario.IDHorario}</td>
              <td>{horario.Fecha}</td>
              <td>{horario.Hora_Salida}</td>
              <td>{horario.Hora_Llegada}</td>
              <td>
                <button onClick={() => handleDelete(horario.IDHorario)}>
                  Eliminar
                </button>
                <button onClick={() => handleEdit(horario.IDHorario)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComponenteGestorHorarios;