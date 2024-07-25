import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "./PaginaEdicionHorario.module.css";

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
      const response = await fetch(
        `http://localhost:3001/api/horario/${idHorario}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener el horario");
      }
      const data = await response.json();
      // Extraer solo la parte de la fecha en formato YYYY-MM-DD
      const fecha = data.Fecha ? data.Fecha.split("T")[0] : "";
      setHorario({
        Fecha: fecha,
        Hora_Salida: data.Hora_Salida || "",
        Hora_Llegada: data.Hora_Llegada || "",
      });
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
      navigate("/ComponenteGestorHorarios");
    } catch (error) {
      console.error("Error al actualizar el horario:", error);
    }
  };

  // Verificar si el horario está cargado completamente antes de renderizar el formulario
  if (!horario.Fecha) {
    return <p>Cargando...</p>;
  }

  return (
    <div className={style.fondo}>
      <header className={style.header}>
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
                className={style.acrear}
                onClick={() => navigate("/InsertarTurno")}
              >
                Crear Turno
              </a>
            </li>
            <li className={style.li}>
              <a
                className={style.acrear}
                onClick={() => navigate("/InsertarUsuario")}
              >
                Crear Usuario
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <div className={style.EdicionHorario}>
        <form className={style.formEdicionRuta} onSubmit={handleSubmit}>
          <h2 className={style.titulo}>Editar Horario</h2>
          <div className={style.campos}>
            <label className={style.label1}>
              Fecha:
              <input
                className={style.input}
                type="date"
                name="Fecha"
                value={horario.Fecha || ""}
                onChange={handleChange}
                required // Campo obligatorio
              />
            </label>
            <label className={style.label1}>
              Hora de Salida:
              <input
                className={style.input}
                type="time"
                name="Hora_Salida"
                value={horario.Hora_Salida || ""}
                onChange={handleChange}
                required // Campo obligatorio
              />
            </label>
            <label className={style.label1}>
              Hora de Llegada:
              <input
                className={style.input}
                type="time"
                name="Hora_Llegada"
                value={horario.Hora_Llegada || ""}
                onChange={handleChange}
                required // Campo obligatorio
              />
            </label>
          </div>
          <div className={style.botones}>
            <button className={style.boton1} type="submit">
              Actualizar
            </button>
            <button
              className={style.boton2}
              type="button"
              onClick={() => navigate("/ComponenteGestorHorarios")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaginaEdicionHorario;
