import React from 'react';
import PropTypes from "prop-types";
import style from './VistaUsuario.module.css';
import { useParams,useNavigate } from "react-router-dom";

const VistaAdmin = ({ className = "" }) => {
  const { Codigo_Usuario } = useParams();
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/VistaUsuario/${Codigo_Usuario}");
  };
  return (   
    <div className={style.fondo}>
      <header className={style.header}>
      <div className={style.logoairova} onClick={handleLogoClick}></div>
        <nav className={style.nav}>
          <ul className={style.ul}>
          <li className={style.li}>
              <a className={style.aopciones}
              onClick={() => navigate("/TrabajadorTurno")}>
                Ver Turno
              </a>
            </li>
          <li className={style.li}>
              <a className={style.aopciones}
              onClick={() => navigate("/TrabajadorPerfil")}>
                Ver Perfil
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
              <h1 className={style.tit}>Bienvenido Trabajador</h1>
            </div>
            <div className={style.opcion1}>
                <div className={style.opcion11}>
                <h3>Ver Perfil</h3>
                <p>Se visualiza el perfil del trabajador.</p>
                <div className={style.botones}>
            <button 
            className={style.crear} 
            type="submit" 
            onClick={() => navigate("/TrabajadorPerfil")}>Visualizar</button>
            </div>
            </div>
            <div className={style.imgperfil}></div>
            </div>
            <div className={style.opcion2}>
          <div className={style.opcion21}>
            <h3>Ver Turno</h3>
            <p>Se visualiza el turno del trabajador</p>
            <div className={style.botones}>
            <button 
            className={style.crear} 
            type="submit" 
            onClick={() => navigate("/TrabajadorTurno")}>Visualizar</button>
            </div>
          </div>
          <div className={style.imgturno}></div>
        </div>
       </div>
    </div>
  );
};

VistaAdmin.propTypes = {
  className: PropTypes.string,
};

export default VistaAdmin;