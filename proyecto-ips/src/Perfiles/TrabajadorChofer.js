import React from 'react';
import style from './TrabajadorPerfil.module.css';
import { useParams,useNavigate } from "react-router-dom";

const TrabajadorPerfil = () => {
    const handleLogoClick = () => {
        navigate("/VistaChofer/${Codigo_Usuario}");
      };
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
    };5

    return (
        <div className={style.fondo}>
            <header className={style.header}>
            <div className={style.logoairova} onClick={handleLogoClick}></div>
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
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5jQBCUrSznF87uovPNohqPnO6Kr-maYEge54VLk0_BKg2UlxW1_lG4FfZkZ7eLKn13Ko&usqp=CAU" alt="Trabajador" className={style.profileImage} />
                        <p><strong>Empresa:</strong> {trabajador.empresa}</p>
                        <p><strong>Cargo:</strong> {trabajador.cargo}</p>
                        <p><strong>ID Trabajador:</strong> {trabajador.idTrabajador}</p>
                        <p><strong>Categoría Laboral:</strong> {trabajador.categoriaLaboral}</p>
                    </div>
                    <div className={style.profileDetails}>
                        <h2>Datos Personales</h2>
                        <p><strong>Nombre:</strong> {trabajador.nombre}</p>
                        <p><strong>Edad:</strong> {trabajador.edad} años</p>
                        <p><strong>Ubicación:</strong> {trabajador.ubicacion}</p>
                        <p><strong>DNI:</strong> {trabajador.dni}</p>
                        <p><strong>Vivienda:</strong> {trabajador.vivienda}</p>
                        <p><strong>Estado Civil:</strong> {trabajador.estadoCivil}</p>
                        <p><strong>Tipo de Sangre:</strong> {trabajador.tipoSangre}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrabajadorPerfil;