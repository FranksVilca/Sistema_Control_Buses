import React from "react";
import PropTypes from "prop-types";
import style from "./VistaChofer.module.css";
import { useNavigate } from "react-router-dom";

const VistaChofer = ({ className = "" }) => {
  const navigate = useNavigate();
  return (
    <div className={style.fondo}>
      <header className={style.header}>
        <nav className={style.nav}>
          <ul className={style.ul}>
            <li className={style.li}>
              <a className={style.aopciones}
              onClick={() => navigate("/")}>
                Marcar Asistencia
              </a>
            </li>
            <li className={style.li}>
              <a className={style.acrear}
              onClick={() => navigate("/")}>
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <div className={style.container}>
        <div className={style.titulo}>
          <h1 className={style.tit}>Bienvenido Chofer</h1>
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

VistaChofer.propTypes = {
  className: PropTypes.string,
};

export default VistaChofer;
