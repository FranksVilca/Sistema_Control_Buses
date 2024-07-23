import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import style from './TrabajadorPerfil.module.css';

const TrabajadorPerfil = () => {
    const { codigo_usuario } = useParams(); // Obtiene el código del usuario desde la URL
    const [trabajador, setTrabajador] = useState(null);

    useEffect(() => {
        const fetchTrabajador = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/usuario/${codigo_usuario}`);
                const data = await response.json();
                setTrabajador(data);
            } catch (error) {
                console.error('Error fetching trabajador data:', error);
            }
        };

        fetchTrabajador();
    }, [codigo_usuario]);

    if (!trabajador) {
        return <div>Loading...</div>;
    }

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
