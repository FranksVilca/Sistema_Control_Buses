import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ComponenteGestorRutas = () => {
  const [rutas, setRutas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRutas();
  }, []);

  const fetchRutas = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/rutas");
      if (!response.ok) {
        throw new Error("Error al obtener las rutas");
      }
      const data = await response.json();
      setRutas(data);
    } catch (error) {
      console.error("Error al obtener la lista de rutas:", error);
    }
  };

  const handleDelete = async (idRuta) => {
    console.log("ID de la ruta a eliminar:", idRuta);
    if (window.confirm("¿Estás seguro que deseas eliminar esta ruta?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/delete/ruta/${idRuta}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Error al eliminar la ruta");
        }
        fetchRutas();
      } catch (error) {
        console.error("Error al eliminar la ruta:", error);
      }
    }
  };

  const handleEdit = (idRuta) => {
    navigate(`/editar/ruta/${idRuta}`);
  };

  return (
    <div>
      <button onClick={() => navigate("/InsertarRuta")}>
        Insertar Ruta
      </button>
      <h2>Lista de Rutas</h2>
      <table>
        <thead>
          <tr>
            <th>ID de Ruta</th>
            <th>Punto de Salida</th>
            <th>Punto de Llegada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rutas.map((ruta) => (
            <tr key={ruta.IDRuta}>
              <td>{ruta.IDRuta}</td>
              <td>{ruta.PuntoSalida}</td>
              <td>{ruta.PuntoLlegada}</td>
              <td>
                <button onClick={() => handleDelete(ruta.IDRuta)}>
                  Eliminar
                </button>
                <button onClick={() => handleEdit(ruta.IDRuta)}>
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

export default ComponenteGestorRutas;
