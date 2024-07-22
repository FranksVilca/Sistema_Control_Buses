import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from './PaginaEdicionRuta.module.css';

const PaginaEdicionRuta = () => {
  const { idRuta } = useParams();
  const [ruta, setRuta] = useState({
    PuntoSalida: "",
    PuntoLlegada: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/ruta/${idRuta}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setRuta(data))
      .catch((error) => console.error("Error al obtener la ruta:", error));
  }, [idRuta]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRuta((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/api/update/ruta/${idRuta}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ruta),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar la ruta");
      }
      alert("Ruta actualizada exitosamente");
      navigate("/GestionarRutas");
    } catch (error) {
      console.error("Error al actualizar la ruta:", error);
    }
  };

  // Verificar si la ruta está cargada completamente antes de renderizar el formulario
  if (!ruta.PuntoSalida && !ruta.PuntoLlegada) {
    return <p>Cargando...</p>;
  }

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
      <div className={style.edicionRuta}>
      <form className={style.formEdicionRuta} onSubmit={handleSubmit}>
      <h2 className={style.titulo}>Editar Ruta</h2>
      <div className={style.campos}>
        <label className={style.label1}>
          Punto de Salida:
          <input className={style.input}
            type="text"
            name="PuntoSalida"
            value={ruta.PuntoSalida || ""}
            onChange={handleChange}
            required
          />
        </label>
        <label className={style.label1}>
          Punto de Llegada:
          <input className={style.input}
            type="text"
            name="PuntoLlegada"
            value={ruta.PuntoLlegada || ""}
            onChange={handleChange}
            required
          />
        </label>
        </div>
        <div className={style.botones}>
        <button className={style.boton1} type="submit">Actualizar</button>
        <button className={style.boton2} type="submit">Cancelar</button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default PaginaEdicionRuta;
