import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ComponenteGestorBuses = () => {
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/buses");
      if (!response.ok) {
        throw new Error("Error al obtener los buses");
      }
      const data = await response.json();
      setBuses(data);
    } catch (error) {
      console.error("Error al obtener la lista de buses:", error);
    }
  };

  const handleDelete = async (idBus) => {
    console.log("ID del bus a eliminar:", idBus);
    if (window.confirm("¿Estás seguro que deseas eliminar este bus?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/delete/bus/${idBus}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Error al eliminar el bus");
        }
        fetchBuses();
      } catch (error) {
        console.error("Error al eliminar el bus:", error);
      }
    }
  };

  const handleEdit = (idBus) => {
    navigate(`/editar/bus/${idBus}`);
  };

  return (
    <div>
      <button onClick={() => navigate("/InsertarBus")}>
        Insertar Bus
      </button>
      <h2>Lista de Buses</h2>
      <table>
        <thead>
          <tr>
            <th>ID de Bus</th>
            <th>Número de Asientos</th>
            <th>Estado de Registro</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Placa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus.IDBus}>
              <td>{bus.IDBus}</td>
              <td>{bus.Num_Asientos}</td>
              <td>{bus.EstadoRegistro}</td>
              <td>{bus.Modelo}</td>
              <td>{bus.Marca}</td>
              <td>{bus.Placa}</td>
              <td>
                <button onClick={() => handleDelete(bus.IDBus)}>
                  Eliminar
                </button>
                <button onClick={() => handleEdit(bus.IDBus)}>
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

export default ComponenteGestorBuses;
