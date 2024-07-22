import React from 'react';
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
                        <li className={style.li}><a href="#perfil" className={style.aopciones}>Perfil</a></li>
                        <li className={style.li}><a href="#turno" className={style.aopciones}>Turno</a></li>
                        <li className={style.li}><a href="#ruta" className={style.aopciones}>Ruta</a></li>
                        <li className={style.li}><a href="#login" className={style.acrear}>Login</a></li>
                    </ul>
                </nav>
            </header>
            
        </div>
    );
}

export default TrabajadorPerfil;