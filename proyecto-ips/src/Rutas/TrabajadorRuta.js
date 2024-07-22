import React from 'react';
import style from './TrabajadorRuta.module.css';

const TrabajadorRuta = () => {
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
            <div className={style.mapContainer}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d62632.74746947446!2d-71.57516557285229!3d-16.409735718684317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x91424a59aaaaaab7%3A0x44b6fb3baca5b97e!2sTerminal%20Terrestre%20Arequipa%2C%20Avenida%20Andr%C3%A9s%20Avelino%20C%C3%A1ceres%2C%20Arequipa!3m2!1d-16.4094139!2d-71.5290033!4m5!1s0x91424a58f4f059ff%3A0xf3b9b3e0a1d5a14c!2sPolobaya%2C%20Peru!3m2!1d-16.5584178!2d-71.3781451!5e0!3m2!1sen!2sus!4v1690901200000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bus Route"
                ></iframe>
            </div>
        </div>
    );
}

export default TrabajadorRuta;
