import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import style from './TrabajadorPerfil.module.css';

const TrabajadorPerfil = () => {
    // Datos del trabajador (simulación)
    const trabajador = {
        nombre: 'Juan Pérez',
        edad: 45,
        ubicacion: 'Arequipa, Perú',
        idTrabajador: 'TR-012345',
        empresa: 'Ferreiros',
        cargo: 'Construcción civil',
        dni: '12345678',
        vivienda: 'Calle Principal 123',
        estadoCivil: 'Casado',
        tipoSangre: 'O+',
        categoriaLaboral: 'Contratista',
    };

    return (
        <div className={style.fondo}>
            <header className={style.header}>
                <nav className={style.nav}>
                    <ul className={style.ul}>
                        <li className={style.li}><a href="/TrabajadorPerfil" className={style.aopciones}>Perfil</a></li>
                        <li className={style.li}><a href="/TrabajadorTurno" className={style.aopciones}>Turno</a></li>
                        <li className={style.li}><a href="/TrabajadorRuta" className={style.aopciones}>Ruta</a></li>
                        <li className={style.li}><a href="/" className={style.acrear}>Login</a></li>
                    </ul>
                </nav>
            </header>
            <div className={style.profileContainer}>
                <div className={style.profileContent}>
                    <div className={style.profileAbout}>
                        <img 
                            src={trabajador.img ? `data:image/jpeg;base64,${trabajador.img}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5jQBCUrSznF87uovPNohqPnO6Kr-maYEge54VLk0_BKg2UlxW1_lG4FfZkZ7eLKn13Ko&usqp=CAU"} 
                            alt="Trabajador" 
                            className={style.profileImage} 
                        />
                        <p><strong>Empresa:</strong> Airova</p>
                        <p><strong>Cargo:</strong> {trabajador.Cargo}</p>
                        <p><strong>ID Trabajador:</strong> {trabajador.Codigo_Usuario}</p>
                    </div>
                    <div className={style.profileDetails}>
                        <h2>Datos Personales</h2>
                        <p><strong>Nombre:</strong> {trabajador.Nombre}</p>
                        <p><strong>Edad:</strong> {trabajador.Edad} años</p>
                        <p><strong>Ubicación:</strong> {trabajador.Direccion}</p>
                        <p><strong>DNI:</strong> {trabajador.DNI}</p>
                        <p><strong>Sexo:</strong> {trabajador.Sexo ? 'Masculino' : 'Femenino'}</p>
                        <p><strong>Vivienda:</strong> {trabajador.Direccion}</p>
                        <p><strong>Correo Electrónico:</strong> {trabajador.Email}</p>
                        <p><strong>Número de Celular:</strong> {trabajador.Celular}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrabajadorPerfil;
