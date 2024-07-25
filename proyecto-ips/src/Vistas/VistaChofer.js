import React from "react";
import PropTypes from "prop-types";
import style from "./VistaAdmin.module.css";

const VistaAdmin = ({ className = "" }) => {
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
      <div className={style.container}>
        <div className={style.titulo}>
          <h1 className={style.tit}>Bienvenido Chofer</h1>
          <p className={style.subtit}>
            <strong>Crear un Turno Nuevo:</strong> Requiere de los elementos de
            abajo
          </p>
          <div className={style.botones}>
            <button className={style.crear} type="submit">
              Crear Turno
            </button>
            <button className={style.crear} type="submit">
              Crear Usuario
            </button>
          </div>
        </div>
        <div className={style.opcion1}>
          <div className={style.opcion11}>
            <h3>Marcar Asistencia</h3>
            <div className={style.botones}>
              <button className={style.gestionar} type="submit">
                Marcar
              </button>
            </div>
          </div>
          <div className={style.imghorario}></div>
        </div>
      </div>
    </div>
  );
};

VistaAdmin.propTypes = {
  className: PropTypes.string,
};

export default VistaAdmin;
