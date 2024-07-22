import React from 'react';
import PropTypes from "prop-types";
import "./VistaAdmin.css";

const VistaAdmin = ({ className = "" }) => {
  return (   
    <div className={`fondo ${className}`}>
    <header>
    <nav>
        <ul>
		<li><a href="#" class="opciones">Horario</a></li>
		<li><a href="#" class="opciones">Bus</a></li>
		<li><a href="#" class="opciones">Ruta</a></li>
		<li><a href="#" class="crear">Crear Turno</a></li>
		<li><a href="#" class="crear">Crear Usuario</a></li>
	 </ul>
    </nav>
</header>
<div class="container">
            <div class="titulo">
              <h1 class= "tit">Bienvenido Administrador</h1>
              <p class= "subtit"><strong>Crear un Turno Nuevo:</strong> Requiere de los elementos de abajo</p>
              <div class="botones">
            <button class="crear" type="submit">Crear Turno</button>
            <button class="crear" type="submit">Crear Usuario</button>
            </div>
            </div>
            <div class="opcion1">
                <div class="opcion1-1">
                <h3>Horario</h3>
                <p>Para crear es necesario: Dia, Fecha y Hora</p>
                <div class="botones">
            <button class="crear" type="submit">Crear</button>
            <button class="gestionar" type="submit">Gestionar</button>
            </div>
            </div>
            <div class="imghorario"></div>
            </div>
            <div class="opcion2">
                <h3>Ruta</h3>
                <p>Para crear es necesario: Lugar de Partida, Lugar de Llegada</p>
                <div class="botones">
                <button class="crear" type="submit">Crear</button>
                <button class="gestionar" type="submit">Gestionar</button>
            </div>

            </div>
            <div class="opcion3">
                <h3>Bus</h3>
                <p>Para crear es necesario: Modelo, Matricula</p>
                <div class="botones">
                <button class="crear" type="submit">Crear</button>
                <button class="gestionar" type="submit">Gestionar</button>
            </div>

            </div>
       </div>
    </div>
  );
};

VistaAdmin.propTypes = {
  className: PropTypes.string,
};

export default VistaAdmin;