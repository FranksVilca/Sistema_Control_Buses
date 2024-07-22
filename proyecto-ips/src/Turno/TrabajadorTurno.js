import React from 'react';
import PropTypes from "prop-types";
import style from './TrabajadorTurno.module.css';

const TrabajadorTurno = () => {
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
            <div className={style.workerView}>
                <header className={style.turnoHeader}>
                    <h1>Turno 1A</h1>
                    <p>Domingo 17 Mayo 07:00 am - 8:30 am</p>
                </header>
                <section className={style.infoSection}>
                    <div className={style.infoCard}>
                        <h2>Información</h2>
                        <p><strong>Destino:</strong> Polobaya - Arequipa</p>
                        <p><strong>D. Turno:</strong> 1A</p>
                        <p><strong>Fecha:</strong> 17 de mayo del 2023</p>
                        <p><strong>Bus:</strong> ABC-123</p>
                    </div>
                    <div className={style.driverCard}>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7I7HyE4katbJHadjFl6NyQF9oFqqnBHbGGA&s" alt="Conductor" className={style.driverImage} />
                        <h2>José Manuel Jaita Chura</h2>
                        <p><strong>ID:</strong> 088213213</p>
                    </div>
                </section>
                <section className={style.busInfo}>
                    <p><strong>Placa de Bus:</strong> ABC-123</p>
                    <p><strong>ID Bus:</strong> Tr09287</p>
                </section>
            </div>
        </div>
    );
}

TrabajadorTurno.propTypes = {
    className: PropTypes.string,
};

export default TrabajadorTurno;