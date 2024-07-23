import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./ComponenteGestorTurnos.module.css"; // Ajusta el nombre del archivo CSS según corresponda

const ComponenteGestorTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/turnos");
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      setTurnos(data);
    } catch (error) {
      console.error("Error al obtener la lista de turnos:", error);
    }
  };

  const handleDelete = async (codigoTurno) => {
    console.log("Código de turno a eliminar:", codigoTurno);
    if (window.confirm("¿Estás seguro que deseas eliminar este turno?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/turnos/${codigoTurno}`,
          {
            method: "PUT", // Suponiendo que utilizas PUT para marcar como inactivo
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ estado: "inactivo" }), // Ajusta según cómo manejes el estado
          }
        );
        if (!response.ok) {
          throw new Error("Error al eliminar el turno");
        }
        fetchData();
      } catch (error) {
        console.error("Error al eliminar el turno:", error);
      }
    }
  };

  const handleAssign = (codigoTurno) => {
    navigate(`/asignarTurno/${codigoTurno}`);
  };

  return (
    <div className={style.fondo}>
      <header className={style.header}>
        <nav className={style.nav}>
          <ul className={style.ul}>
            <li className={style.li}>
              <a className={style.aopciones} href="#">
                Horario
              </a>
            </li>
            <li className={style.li}>
              <a className={style.aopciones} href="#">
                Bus
              </a>
            </li>
            <li className={style.li}>
              <a className={style.aopciones} href="#">
                Ruta
              </a>
            </li>
            <li className={style.li}>
              <a className={style.acrear} href="#">
                Crear Turno
              </a>
            </li>
            <li className={style.li}>
              <a className={style.acrear} href="#">
                Crear Usuario
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <div className={style.gestorTurnos}>
        <h2 className={style.gestorTurnosTitulo}>Lista de Turnos</h2>
        <table className={style.gestorTurnosTabla}>
          <thead>
            <tr>
              <th>Código de Turno</th>
              <th>Punto de Salida</th>
              <th>Punto de Llegada</th>
              <th>Hora de Salida</th>
              <th>Hora de Llegada</th>
              <th>Fecha</th>
              <th>Placa del Bus</th>
              <th>Número de Asientos</th>
              <th>Nombre del Chofer</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr key={turno.Codigo_Turno}>
                <td>{turno.Codigo_Turno}</td>
                <td>{turno.PuntoSalida}</td>
                <td>{turno.PuntoLlegada}</td>
                <td>{turno.HoraSalida}</td>
                <td>{turno.HoraLlegada}</td>
                <td>{turno.Fecha}</td>
                <td>{turno.PlacaBus}</td>
                <td>{turno.NumeroAsientos}</td>
                <td>{turno.NombreChofer}</td>
                <td>
                  <button onClick={() => handleDelete(turno.Codigo_Turno)}>
                    Eliminar
                  </button>
                  <button onClick={() => handleAssign(turno.Codigo_Turno)}>
                    Asignar Turno
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComponenteGestorTurnos;
