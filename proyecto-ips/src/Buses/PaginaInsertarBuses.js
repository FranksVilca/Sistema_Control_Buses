import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from './PaginaInsertarBuses.module.css';

const PaginaInsertarBus = () => {
  const [bus, setBus] = useState({
    Num_Asientos: "",
    EstadoRegistro: "",
    Modelo: "",
    Marca: "",
    Placa: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBus((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/insert/bus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bus),
      });
      if (!response.ok) {
        throw new Error("Error al insertar el bus");
      }
      alert("Bus insertado exitosamente");
      navigate("/ComponenteGestorBuses");
    } catch (error) {
      console.error("Error al insertar el bus:", error);
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
      <div className={style.insertarBus}>
      <form className={style.formInsertarBus} onSubmit={handleSubmit}>
      <h2 className={style.titulo}>Insertar Nuevo Bus</h2>
      <div className={style.campos}>
      <div className={style.campo1}>
        <label className={style.label1}>
          Número de Asientos:
          <input className={style.input}
            type="number"
            name="Num_Asientos"
            value={bus.Num_Asientos}
            onChange={handleChange}
            required // Campo obligatorio
            min="0"
            max="50"
          />
        </label>
        <label className={style.label2}>
          Estado de Registro:
          <select className={style.select} 
            name="EstadoRegistro"
            value={bus.EstadoRegistro}
            onChange={handleChange}
            required // Campo obligatorio
          >
            <option value="">Selecciona un estado</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="En Mantenimiento">En Mantenimiento</option>
          </select>
        </label>
        </div>
        <label className={style.label1}>
          Modelo:
          <input className={style.input}
            type="text"
            name="Modelo"
            value={bus.Modelo}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <div className={style.campo1}>
        <label className={style.label1}>
          Marca:
          <input className={style.input}
            type="text"
            name="Marca"
            value={bus.Marca}
            onChange={handleChange}
            required // Campo obligatorio
          />
        </label>
        <label className={style.label2}>
          Placa (formato AAA-123):
          <input className={style.input}
            type="text"
            name="Placa"
            value={bus.Placa}
            onChange={handleChange}
            pattern="[A-Za-z]{3}-[0-9]{3}"
            title="Debe tener formato AAA-123 (3 letras seguidas de un guion y 3 números)"
            required // Campo obligatorio
          />
        </label>
        </div>
        </div>
        <div className={style.botones}>
        <button className={style.boton1} type="submit">Insertar</button>
        <button className={style.boton2} type="button" onClick={() => navigate("/ComponenteGestorBuses")}>
            Cancelar
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default PaginaInsertarBus;
