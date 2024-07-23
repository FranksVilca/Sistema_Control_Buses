import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./PaginaInsertarTurno.module.css";

const PaginaInsertarTurno = () => {
  const [turno, setTurno] = useState({
    IDRuta: "",
    IDHorario: "",
    IDBus: "",
    IDChofer: "",
  });
  const [buses, setBuses] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [conductores, setConductores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/buses`)
      .then((response) => response.json())
      .then((data) => setBuses(data))
      .catch((error) => console.error("Error al obtener los buses:", error));

    fetch(`http://localhost:3001/api/horarios`)
      .then((response) => response.json())
      .then((data) => setHorarios(data))
      .catch((error) => console.error("Error al obtener los horarios:", error));

    fetch(`http://localhost:3001/api/rutas`)
      .then((response) => response.json())
      .then((data) => setRutas(data))
      .catch((error) => console.error("Error al obtener las rutas:", error));

    fetch(`http://localhost:3001/api/conductores`)
      .then((response) => response.json())
      .then((data) => setConductores(data))
      .catch((error) =>
        console.error("Error al obtener los conductores:", error)
      );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTurno((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !turno.IDRuta ||
        !turno.IDHorario ||
        !turno.IDBus ||
        !turno.IDChofer
      ) {
        throw new Error("Por favor complete todos los campos");
      }

      const response = await fetch(`http://localhost:3001/api/insertarTurno`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(turno),
      });

      if (!response.ok) {
        throw new Error("Error al insertar el turno");
      }
      alert("Turno insertado exitosamente");
      navigate("/GestionarTurnos");
    } catch (error) {
      alert(`Error al insertar el turno: ${error.message}`);
      console.error("Error al insertar el turno:", error);
    }
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
      <div className={style.insertarTurno}>
        <form className={style.formInsertarTurno} onSubmit={handleSubmit}>
          <h2 className={style.titulo}>Insertar Nuevo Turno</h2>
          <div className={style.campos}>
            <label className={style.label1}>
              Bus:
              <select
                className={style.select}
                name="IDBus"
                value={turno.IDBus}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un bus</option>
                {buses.map((bus) => (
                  <option key={bus.IDBus} value={bus.IDBus}>
                    {bus.Placa} - {bus.Num_Asientos} asientos
                  </option>
                ))}
              </select>
            </label>
            <label className={style.label1}>
              Horario:
              <select
                className={style.select}
                name="IDHorario"
                value={turno.IDHorario}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un horario</option>
                {horarios.map((horario) => (
                  <option key={horario.IDHorario} value={horario.IDHorario}>
                    {horario.Fecha} - {horario.Hora_Salida}
                  </option>
                ))}
              </select>
            </label>
            <label className={style.label1}>
              Ruta:
              <select
                className={style.select}
                name="IDRuta"
                value={turno.IDRuta}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una ruta</option>
                {rutas.map((ruta) => (
                  <option key={ruta.IDRuta} value={ruta.IDRuta}>
                    {ruta.PuntoSalida} - {ruta.PuntoLlegada}
                  </option>
                ))}
              </select>
            </label>
            <label className={style.label1}>
              Conductor:
              <select
                className={style.select}
                name="IDChofer"
                value={turno.IDChofer}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un conductor</option>
                {conductores.map((conductor) => (
                  <option
                    key={conductor.Codigo_Usuario}
                    value={conductor.Codigo_Usuario}
                  >
                    {conductor.Nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={style.botones}>
            <button className={style.boton1} type="submit">
              Insertar
            </button>
            <button
              className={style.boton2}
              type="button"
              onClick={() => navigate("/GestionarTurno")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaginaInsertarTurno;
