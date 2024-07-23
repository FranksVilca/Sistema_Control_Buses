import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from './PaginaInsertarRuta.module.css';

const PaginaInsertarRuta = () => {
  const [ruta, setRuta] = useState({
    PuntoSalida: "",
    PuntoLlegada: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRuta((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getMaxCodigoRuta = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/rutas/max`);
      if (!response.ok) {
        throw new Error("Error al obtener el máximo código de ruta");
      }
      const data = await response.json();
      return data.maxCodigoRuta;
    } catch (error) {
      console.error("Error al obtener el máximo código de ruta:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ruta.PuntoSalida || !ruta.PuntoLlegada) {
      alert("Todos los campos deben estar llenos.");
      return;
    }
    try {
      const maxCodigoRuta = await getMaxCodigoRuta();
      if (maxCodigoRuta !== null) {
        const nuevoCodigoRuta = maxCodigoRuta + 1;
        const rutaConCodigo = {
          ...ruta,
          IDRuta: nuevoCodigoRuta,
        };
        const response = await fetch(`http://localhost:3001/api/ruta`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rutaConCodigo),
        });
        if (!response.ok) {
          throw new Error("Error al insertar la ruta");
        }
        alert("Ruta insertada exitosamente");
        navigate("/GestionarRutas");
      }
    } catch (error) {
      console.error("Error al insertar la ruta:", error);
    }
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
      <div className={style.insertarRuta}>
        <form className={style.formInsertarRuta} onSubmit={handleSubmit}>
          <h2 className={style.titulo}>Insertar Nueva Ruta</h2>
          <div className={style.campos}>
            <label className={style.label1}>
              Punto de Salida:
              <input className={style.input}
                type="text"
                name="PuntoSalida"
                value={ruta.PuntoSalida}
                onChange={handleChange}
                required
              />
            </label>
            <label className={style.label1}>
              Punto de Llegada:
              <input className={style.input}
                type="text"
                name="PuntoLlegada"
                value={ruta.PuntoLlegada}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={style.botones}>
            <button className={style.boton1} type="submit">Insertar</button>
            <button className={style.boton2} type="button" onClick={() => navigate("/ComponenteGestorRuta")}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaginaInsertarRuta;
