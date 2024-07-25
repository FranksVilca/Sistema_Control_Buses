import React from "react";
import PropTypes from "prop-types";
import style from "./VistaAdmin.module.css";
import { useParams,useNavigate } from "react-router-dom";

const VistaAdmin = ({ className = "" }) => {
  const { Codigo_Usuario } = useParams();
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/VistaAdmin/${Codigo_Usuario}");
  };

  return (
    <div className={style.fondo}>
      <header className={style.header}>
        <div className={style.logoairova} onClick={handleLogoClick}>
        </div>
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
                className={style.aopciones}
                onClick={() => navigate("/GestionarUsuarios")}
              >
                Usuarios
              </a>
            </li>
            <li className={style.li}>
              <a
                className={style.aopciones}
                onClick={() => navigate("/GestionarTurno")}
              >
                Turnos
              </a>
            </li>
            <li className={style.li}>
              <a
                className={style.acrear}
                onClick={() => navigate("/")}
              >
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <div className={style.container}>
        <div className={style.titulo}>
          <h1 className={style.tit}>Bienvenido Administrador</h1>
        </div>
        <div className={style.opcion1}>
          <div className={style.opcion11}>
            <h3>Horario</h3>
            <p>Para crear es necesario: Dia, Fecha y Hora</p>
            <div className={style.botones}>
              <button
                className={style.crear}
                type="submit"
                onClick={() => navigate("/PaginaInsertarHorarios")}
              >
                Crear
              </button>
              <button
                className={style.gestionar}
                type="submit"
                onClick={() => navigate("/ComponenteGestorHorarios")}
              >
                Gestionar
              </button>
            </div>
          </div>
          <div className={style.imghorario}></div>
        </div>
        <div className={style.opcion2}>
          <div className={style.opcion21}>
            <h3>Ruta</h3>
            <p>Para crear es necesario: Lugar de Partida, Lugar de Llegada</p>
            <div className={style.botones}>
              <button
                className={style.crear}
                type="submit"
                onClick={() => navigate("/PaginaInsertarRuta")}
              >
                Crear
              </button>
              <button
                className={style.gestionar}
                type="submit"
                onClick={() => navigate("/ComponenteGestorRuta")}
              >
                Gestionar
              </button>
            </div>
          </div>
          <div className={style.imgrutas}></div>
        </div>
        <div className={style.opcion3}>
          <div className={style.opcion31}>
            <h3>Bus</h3>
            <p>Para crear es necesario: Modelo, Matricula</p>
            <div className={style.botones}>
              <button
                className={style.crear}
                type="submit"
                onClick={() => navigate("/InsertarBus")}
              >
                Crear
              </button>
              <button
                className={style.gestionar}
                type="submit"
                onClick={() => navigate("/ComponenteGestorBuses")}
              >
                Gestionar
              </button>
            </div>
          </div>
          <div className={style.imgbuses}></div>
        </div>
        <div className={style.opcion4}>
          <div className={style.opcion41}>
            <h3>Usuarios</h3>
            <p>Puede crear y visualizar a todos los usuarios</p>
            <div className={style.botones}>
              <button
                className={style.crear}
                type="submit"
                onClick={() => navigate("/InsertarUsuario")}
              >
                Crear
              </button>
              <button
                className={style.gestionar}
                type="submit"
                onClick={() => navigate("/GestionarUsuarios")}
              >
                Gestionar
              </button>
            </div>
          </div>
          <div className={style.imgusuario}></div>
        </div>
        <div className={style.opcion5}>
          <div className={style.opcion51}>
            <h3>Turno</h3>
            <p>Puede crear y visualizar a todos los usuarios</p>
            <div className={style.botones}>
              <button
                className={style.crear}
                type="submit"
                onClick={() => navigate("/InsertarTurno")}
              >
                Crear
              </button>
              <button
                className={style.gestionar}
                type="submit"
                onClick={() => navigate("/GestionarTurno")}
              >
                Gestionar
              </button>
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
