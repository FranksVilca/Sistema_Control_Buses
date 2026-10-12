import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const VistaUsuario = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />

      <div className="container py-5 px-3 px-md-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            {/* User Hero Card */}
            <div className="airova-card p-4 p-md-5 mb-4 text-center text-md-start">
              <div className="row align-items-center">
                <div className="col-md-3 text-center mb-3 mb-md-0">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "90px",
                      height: "90px",
                      background: "linear-gradient(135deg, rgba(8, 145, 178, 0.15), rgba(6, 182, 212, 0.05))",
                      color: "#0891b2",
                      fontSize: "2.5rem",
                      border: "2px solid rgba(8, 145, 178, 0.2)"
                    }}
                  >
                    <i className="fa-solid fa-user-tie"></i>
                  </div>
                </div>
                <div className="col-md-9">
                  <span className="badge bg-info bg-opacity-10 text-info px-3 py-1 rounded-pill mb-2 fw-semibold">
                    <i className="fa-solid fa-briefcase me-1"></i> Panel de Trabajador
                  </span>
                  <h1 className="h3 fw-bold text-dark mb-1">Bienvenido al Portal AIROVA</h1>
                  <p className="text-muted mb-0">
                    Consulta tu información laboral, tus asignaciones de turnos de viaje y datos de tu perfil.
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
                      style={{ width: "48px", height: "48px", background: "rgba(37, 99, 235, 0.1)", color: "#2563eb", fontSize: "1.3rem" }}
                    >
                      <i className="fa-solid fa-id-card"></i>
                    </div>
                    <h3 className="h5 fw-bold text-dark mb-2">Mi Perfil Laboral</h3>
                    <p className="text-muted small mb-3">
                      Revisa tus datos personales, DNI, datos de contacto y estado de tu registro.
                    </p>
                  </div>
                  <button
                    className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold"
                    onClick={() => navigate("/TrabajadorPerfil")}
                  >
                    <i className="fa-solid fa-user"></i> Ver Mi Perfil
                  </button>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="airova-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div
                      className="rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "48px", height: "48px", background: "rgba(234, 88, 12, 0.1)", color: "#ea580c", fontSize: "1.3rem" }}
                    >
                      <i className="fa-solid fa-calendar-check"></i>
                    </div>
                    <h3 className="h5 fw-bold text-dark mb-2">Turnos Asignados</h3>
                    <p className="text-muted small mb-3">
                      Visualiza tus horarios de viaje, buses asignados y fechas de partida.
                    </p>
                  </div>
                  <button
                    className="btn btn-outline-warning text-dark d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold"
                    onClick={() => navigate("/TrabajadorTurno")}
                  >
                    <i className="fa-solid fa-calendar-days"></i> Ver Mis Turnos
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

export default VistaUsuario;