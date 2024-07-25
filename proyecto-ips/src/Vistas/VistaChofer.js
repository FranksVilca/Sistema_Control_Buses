import React from "react";
import PropTypes from "prop-types";
import style from "./VistaChofer.module.css";
import { useParams,useNavigate } from "react-router-dom";

const VistaChofer = ({ className = "" }) => {
  const { Codigo_Usuario } = useParams();
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/VistaChofer/${Codigo_Usuario}");
  };

  return (
    <div className={style.fondo}>
      <header className={style.header}>
      <div className={style.logoairova} onClick={handleLogoClick}></div>
        <nav className={style.nav}>
          <ul className={style.ul}>
            <li className={style.li}>
              <a className={style.aopciones}
              onClick={() => navigate("/Asistencia/1")}>
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
              <button className={style.gestionar} type="submit"
              onClick={() => navigate("/Asistencia/1")}>
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
