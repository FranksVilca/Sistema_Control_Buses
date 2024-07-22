import React from 'react';
import PropTypes from "prop-types";
import { useParams } from 'react-router-dom';
import "./VistaAdmin.css";

const VistaAdmin = ({ className = "" }) => {
  const { codigoUsuario } = useParams(); // Obtén el parámetro de la URL

  return (
    <div className={`fondo ${className}`}>
      <header>
        <nav>
          <ul>
            <li><a href="#" className="opciones">Horario</a></li>
            <li><a href="#" className="opciones">Bus</a></li>
            <li><a href="#" className="opciones">Ruta</a></li>
            <li><a href="#" className="crear">Crear Turno</a></li>
            <li><a href="#" className="crear">Crear Usuario</a></li>
          </ul>
        </nav>
      </header>
      <div className="container">
        <div className="titulo">
          <h1 className="tit">Bienvenido Administrador</h1>
          <p className="subtit"><strong>Crear un Turno Nuevo:</strong> Requiere de los elementos de abajo</p>
          <div className="botones">
            <button className="crear" type="submit">Crear Turno</button>
            <button className="crear" type="submit">Crear Usuario</button>
          </div>
        </div>
        <div className="opcion1">
          <div className="opcion1-1">
            <h3>Horario</h3>
            <p>Para crear es necesario: Dia, Fecha y Hora</p>
            <div className="botones">
              <button className="crear" type="submit">Crear</button>
              <button className="gestionar" type="submit">Gestionar</button>
            </div>
          </div>
          <div className="imghorario"></div>
        </div>
        <div className="opcion2">
          <h3>Ruta</h3>
          <p>Para crear es necesario: Lugar de Partida, Lugar de Llegada</p>
          <div className="botones">
            <button className="crear" type="submit">Crear</button>
            <button className="gestionar" type="submit">Gestionar</button>
          </div>
        </div>
        <div className="opcion3">
          <h3>Bus</h3>
          <p>Para crear es necesario: Modelo, Matricula</p>
          <div className="botones">
            <button className="crear" type="submit">Crear</button>
            <button className="gestionar" type="submit">Gestionar</button>
          </div>
        </div>
      </div>
      <footer>
        <p className="codigo-usuario">Código de Usuario: {codigoUsuario}</p>
      </footer>
    </div>
  );
};

VistaAdmin.propTypes = {
  className: PropTypes.string,
};

export default VistaAdmin;
