import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const TrabajadorRuta = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />

      <div className="container py-4 px-3 px-md-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <button
            className="btn btn-link text-decoration-none text-muted p-0"
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left me-1"></i> Regresar
          </button>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-info bg-opacity-10 text-info px-2 py-1 rounded">
                <i className="fa-solid fa-map-location-dot me-1"></i> Mapa de Operaciones
              </span>
            </div>
            <h1 className="h3 fw-bold text-dark mb-0">Ruta y Trayecto en Vivo</h1>
          </div>
        </div>

        <div className="airova-card p-3 overflow-hidden shadow-sm">
          <div className="ratio ratio-16x9 rounded-3 overflow-hidden border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d62632.74746947446!2d-71.57516557285229!3d-16.409735718684317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x91424a59aaaaaab7%3A0x44b6fb3baca5b97e!2sTerminal%20Terrestre%20Arequipa%2C%20Avenida%20Andr%C3%A9s%20Avelino%20C%C3%A1ceres%2C%20Arequipa!3m2!1d-16.4094139!2d-71.5290033!4m5!1s0x91424a58f4f059ff%3A0xf3b9b3e0a1d5a14c!2sPolobaya%2C%20Peru!3m2!1d-16.5584178!2d-71.3781451!5e0!3m2!1sen!2sus!4v1690901200000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ruta de Buses AIROVA"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrabajadorRuta;
