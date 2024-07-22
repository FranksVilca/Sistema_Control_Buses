import React from 'react';
import PropTypes from "prop-types";

const GestionarRuta = ({ className = "" }) => {
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
        <form class="bus-form">
            <div class="titulo">
              <h1 class= "tit">Gestionar Ruta</h1>
              <p class= "subtit">Ingrese los datos en los campos</p>
            </div>
            <div class="form-contenedor">
                <h4>Datos generales</h4>
            <div class="form-1">
                <div class="modelo-div">
                <label>Ruta de Salida</label>
                <input class= "modelo" type="text" id="modelo" name="modelo" required/>
                </div>
                <div class="asientos-div">
                <label>Ruta de Llegada</label>
                <input class= "asientos" type="number" id="asientos" name="asientos" required/>
                </div>
            </div>
            <div class="form-2">
                <div class="conductor-div">
                    <label>Distancia</label>
                    <input class= "conductor" type="text" id="conductor" name="conductor" required/>
                </div>
            </div>
            <div class="form-3">
                <div class="bus-div">
                <label>Bus</label>
                <select class="select" name="select">
                <option value="value1">BUS 1</option>
                <option value="value2">BUS 2</option>
                <option value="value3">BUS 3</option>
                </select>
                </div>
                <div class="estado-div">
                <label>Estado</label>
                <select class="select" name="select" required>
                <option value="value1">EN RUTA</option>
                <option value="value2" selected>DISPONIBLE</option>
                <option value="value3">INHABILITADO</option>
                </select>
                </div>
            </div>
            <div class="botones">
            <button class="registrar" type="submit">REGISTRAR</button>
            <button class="cancelar" type="submit">CANCELAR</button>
            </div>
            </div>
          </form>
       </div>
    </div>
  );
};

GestionarRuta.propTypes = {
  className: PropTypes.string,
};

export default GestionarRuta;