import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./ComponenteGestorBuses.module.css";

const ComponenteGestorBuses = () => {
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/VistaAdmin/${Codigo_Usuario}");
  };
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
    navigate(`/PaginaEdicionBus/${idBus}`);
  };

  return (
    <div className={style.fondo}>
      <header className={style.header}>
        <div className={style.logoairova} onClick={handleLogoClick}>
        </div>
        <nav className={style.nav}>
          <ul className={style.ul}>
            <li className={style.li}>
              <a
                className={style.aopciones}
                onClick={() => navigate("/ComponenteGestorHorarios")}
              >
                Horario
              </a>
            </li>
            <li className={style.li}>
              <a
                className={style.aopciones}
                onClick={() => navigate("/ComponenteGestorBuses")}
              >
                Bus
              </a>
            </li>
            <li className={style.li}>
              <a
                className={style.aopciones}
                onClick={() => navigate("/ComponenteGestorRuta")}
              >
                Ruta
              </a>
            </li>
            <li className={style.li}>
              <a
                className={style.aopciones}
                onClick={() => navigate("/GestionarUsuarios")}
              >
                Usuarios
              </a>
            </li>
            <li className={style.li}>
              <a
                className={style.aopciones}
                onClick={() => navigate("/GestionarTurno")}
              >
                Turnos
              </a>
            </li>
            <li className={style.li}>
              <a
                className={style.acrear}
                onClick={() => navigate("/")}
              >
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <div className={style.gestorBus}>
        <div className={style.gestorBusBotonInsertar}>
          <button
            className={style.gestorBusBoton}
            onClick={() => navigate("/InsertarBus")}
          >
            Insertar Bus
          </button>
        </div>
        <h2 className={style.gestorBusTitulo}>Lista de Buses</h2>
        <table className={style.gestorBusTabla}>
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
                  <button
                    className={style.botonEliminar}
                    onClick={() => handleDelete(bus.IDBus)}
                  >
                    Eliminar
                  </button>
                  <button
                    className={style.botonEditar}
                    onClick={() => handleEdit(bus.IDBus)}
                  >
                    Editar
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

export default ComponenteGestorBuses;
