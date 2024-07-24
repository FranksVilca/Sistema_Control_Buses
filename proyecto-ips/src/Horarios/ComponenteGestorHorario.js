import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from './ComponenteGestorHorario.module.css';

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
      console.log("Horarios recibidos:", data);
      setHorarios(data);
    } catch (error) {
      console.error("Error al obtener la lista de horarios:", error);
    }
  };

  const handleDelete = async (idHorario) => {
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
    navigate(`/PaginaEdicionHorarios/${idHorario}`);
  };

  return (
    <div className={style.fondo}>
      <header className={style.header}>
        <nav className={style.nav}>
          <ul className={style.ul}>
            <li className={style.li}><a className={style.aopciones} href="#">Horario</a></li>
            <li className={style.li}><a className={style.aopciones} href="#">Bus</a></li>
            <li className={style.li}><a className={style.aopciones} href="#">Ruta</a></li>
            <li className={style.li}><a className={style.acrear} href="#">Crear Turno</a></li>
            <li className={style.li}><a className={style.acrear} href="#">Crear Usuario</a></li>
          </ul>
        </nav>
      </header>
      <div className={style.gestorHorario}>
        <div className={style.gestorHorarioBotonInsertar}>
          <button className={style.gestorHorarioBoton} onClick={() => navigate("/PaginaInsertarHorarios")}>
            Insertar Horario
          </button>
        </div>
        <h2 className={style.gestorHorarioTitulo}>Lista de Horarios</h2>
        <table className={style.gestorHorarioTabla}>
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
                <td>{horario.Hora_Salida ? horario.Hora_Salida : 'N/A'}</td>
                <td>{horario.Hora_Llegada ? horario.Hora_Llegada : 'N/A'}</td>
                <td>
                  <button onClick={() => handleDelete(horario.IDHorario)}>Eliminar</button>
                  <button onClick={() => handleEdit(horario.IDHorario)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComponenteGestorHorarios;