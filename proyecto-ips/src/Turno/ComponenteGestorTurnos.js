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
    console.log("Código de turno a marcar como inactivo:", codigoTurno);
    if (
      window.confirm(
        "¿Estás seguro que deseas marcar este turno como inactivo?"
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/turnos/inactivar/${codigoTurno}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al marcar el turno como inactivo");
        }
        fetchData(); // Vuelve a obtener la lista de turnos después de la actualización
      } catch (error) {
        console.error("Error al marcar el turno como inactivo:", error);
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
        <div className={style.gestorUsuariosBotonInsertar}>
          <button
            className={style.gestorUsuariosBoton}
            onClick={() => navigate("/InsertarTurno")}
          >
            InsertarTurno
          </button>
        </div>
        <h2 className={style.gestorTurnosTitulo}>Lista de Turnos Activos</h2>
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr key={turno.Codigo_Turno}>
                <td>{turno.Codigo_Turno}</td>
                <td>{turno.PuntoSalida}</td>
                <td>{turno.PuntoLlegada}</td>
                <td>{turno.Hora_Salida}</td>
                <td>{turno.Hora_Llegada}</td>
                <td>{turno.Fecha}</td>
                <td>{turno.Placa}</td>
                <td>{turno.Num_Asientos}</td>
                <td>
                  <button onClick={() => handleDelete(turno.Codigo_Turno)}>
                    Marcar como Inactivo
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
