import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const VistaChofer = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />

      <div className="container py-5 px-3 px-md-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            {/* Driver Hero Card */}
            <div className="airova-card p-4 p-md-5 mb-4 text-center text-md-start">
              <div className="row align-items-center">
                <div className="col-md-3 text-center mb-3 mb-md-0">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "90px",
                      height: "90px",
                      background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(59, 130, 246, 0.05))",
                      color: "#2563eb",
                      fontSize: "2.5rem",
                      border: "2px solid rgba(37, 99, 235, 0.2)"
                    }}
                  >
                    <i className="fa-solid fa-id-card"></i>
                  </div>
                </div>
                <div className="col-md-9">
                  <span className="badge bg-warning bg-opacity-10 text-dark px-3 py-1 rounded-pill mb-2 fw-semibold">
                    <i className="fa-solid fa-steering-wheel me-1"></i> Perfil Conductor
                  </span>
                  <h1 className="h3 fw-bold text-dark mb-1">Panel del Chofer</h1>
                  <p className="text-muted mb-0">
                    Bienvenido al sistema. Registra tu asistencia diaria y mantente al tanto de tus turnos de viaje asignados.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <div className="airova-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div
                      className="rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "48px", height: "48px", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", fontSize: "1.3rem" }}
                    >
                      <i className="fa-solid fa-clipboard-check"></i>
                    </div>
                    <h3 className="h5 fw-bold text-dark mb-2">Marcar Asistencia</h3>
                    <p className="text-muted small mb-3">
                      Confirma tu presencia para el turno de ruta programado el día de hoy.
                    </p>
                  </div>
                  <button
                    className="btn btn-success d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold"
                    onClick={() => navigate("/Asistencia/1")}
                  >
                    <i className="fa-solid fa-check"></i> Marcar Asistencia
                  </button>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="airova-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div
                      className="rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "48px", height: "48px", background: "rgba(37, 99, 235, 0.1)", color: "#2563eb", fontSize: "1.3rem" }}
                    >
                      <i className="fa-solid fa-route"></i>
                    </div>
                    <h3 className="h5 fw-bold text-dark mb-2">Rutas y Paradas</h3>
                    <p className="text-muted small mb-3">
                      Consulta la información de origen, destino e itinerarios programados de las unidades.
                    </p>
                  </div>
                  <button
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold"
                    onClick={() => navigate("/TrabajadorRuta")}
                  >
                    <i className="fa-solid fa-map-location-dot"></i> Ver Rutas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaChofer;
