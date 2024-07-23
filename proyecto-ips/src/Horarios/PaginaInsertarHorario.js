import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from './PaginaInsertarHorario.module.css';

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
      navigate("/ComponenteGestorHorarios");
    } catch (error) {
      console.error("Error al insertar el horario:", error);
    }
  };

  return (
    <div className={style.fondo}>
      <header className={style.header}>
        <nav className={style.nav}>
          <ul className={style.ul}>
          <li className={style.li}><a className={style.aopciones} href="#" >Horario</a></li>
          <li className={style.li}><a className={style.aopciones} href="#" >Bus</a></li>
          <li className={style.li}><a className={style.aopciones} href="#" >Ruta</a></li>
          <li className={style.li}><a className={style.acrear} href="#" >Crear Turno</a></li>
          <li className={style.li}><a className={style.acrear} href="#" >Crear Usuario</a></li>
          </ul>
        </nav>
      </header>
      <div className={style.insertarHorario}>
      <form className={style.formInsertarHorario} onSubmit={handleSubmit}>
      <h2 className={style.titulo}>Insertar Nuevo Horario</h2>
      <div className={style.campos}>
        <label className={style.label1}>
          Fecha:
          <input className={style.input}
            type="date"
            name="Fecha"
            value={horario.Fecha}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <label className={style.label1}>
          Hora de Salida:
          <input className={style.input}
            type="time"
            name="Hora_Salida"
            value={horario.Hora_Salida}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <label className={style.label1}>
          Hora de Llegada:
          <input className={style.input}
            type="time"
            name="Hora_Llegada"
            value={horario.Hora_Llegada}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        </div>
        <div className={style.botones}>
        <button className={style.boton1} type="submit">Insertar</button>
        <button className={style.boton2} type="submit">Cancelar</button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default PaginaInsertarHorario;
