import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";

const TrabajadorTurno = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />

      <div className="container py-5 px-3 px-md-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <button
            className="btn btn-link text-decoration-none text-muted p-0"
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left me-1"></i> Regresar
          </button>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="airova-card p-4 p-md-5">
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: "48px", height: "48px", background: "rgba(234, 88, 12, 0.1)", color: "#ea580c", fontSize: "1.3rem" }}
                >
                  <i className="fa-solid fa-calendar-check"></i>
                </div>
                <div>
                  <h2 className="h4 fw-bold text-dark mb-0">Mi Turno Asignado</h2>
                  <p className="text-muted small mb-0">Detalles del itinerario y bus programado para tu viaje</p>
                </div>
              </div>

              {/* Shift Information Card */}
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="p-4 bg-light rounded-3 border h-100">
                    <span className="badge bg-primary px-3 py-1 rounded-pill mb-3">Turno Activo 1A</span>
                    <h3 className="h5 fw-bold text-dark mb-3">
                      <i className="fa-solid fa-route text-primary me-2"></i> Cusco - Sicuani
                    </h3>
                    <ul className="list-unstyled text-secondary small mb-0 d-flex flex-column gap-2">
                      <li>
                        <strong><i className="fa-solid fa-calendar-day me-2 text-muted"></i>Fecha:</strong> Próxima salida programada
                      </li>
                      <li>
                        <strong><i className="fa-solid fa-clock me-2 text-muted"></i>Horario:</strong> 07:00 AM - 08:30 AM
                      </li>
                      <li>
                        <strong><i className="fa-solid fa-bus me-2 text-muted"></i>Unidad:</strong> Bus Paradiso G7 (ABC-123)
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="p-4 bg-light rounded-3 border h-100 text-center d-flex flex-column align-items-center justify-content-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mb-3 bg-white border"
                      style={{ width: "70px", height: "70px", color: "#2563eb", fontSize: "1.8rem" }}
                    >
                      <i className="fa-solid fa-id-card"></i>
                    </div>
                    <span className="badge bg-warning bg-opacity-10 text-dark px-2 py-1 rounded small mb-1">
                      Conductor Asignado
                    </span>
                    <h4 className="h6 fw-bold text-dark mb-1">José Manuel Jaita Chura</h4>
                    <p className="text-muted small mb-0">DNI: 088213213</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrabajadorTurno;