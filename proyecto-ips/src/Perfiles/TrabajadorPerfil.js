import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../components/AuthContext';
import IdBadge from '../components/IdBadge';

const TrabajadorPerfil = () => {
  const { codigoUsuario: paramId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const codigoUsuario = paramId || user?.Codigo_Usuario;

  const [trabajador, setTrabajador] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrabajador = async () => {
      try {
        if (!codigoUsuario) return;
        const response = await fetch(`http://localhost:3001/api/usuario/${codigoUsuario}`);
        if (!response.ok) throw new Error("Error al cargar perfil");
        const data = await response.json();
        setTrabajador(data);
      } catch (error) {
        console.error('Error al obtener los datos del trabajador:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrabajador();
  }, [codigoUsuario]);

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
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="text-muted mt-2">Cargando perfil laboral...</p>
                </div>
              ) : !trabajador ? (
                <div className="text-center py-5">
                  <div className="fs-1 text-muted mb-2">
                    <i className="fa-solid fa-user-xmark opacity-50"></i>
                  </div>
                  <h5 className="fw-semibold text-secondary">No se encontró la información del perfil</h5>
                  <p className="text-muted small">Inicia sesión nuevamente o verifica tu código de usuario.</p>
                </div>
              ) : (
                <div>
                  {/* User Profile Header */}
                  <div className="d-flex flex-column flex-sm-row align-items-center gap-4 pb-4 mb-4 border-bottom text-center text-sm-start">
                    <div
                      className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center border border-3 border-primary shadow-sm"
                      style={{ width: "110px", height: "110px", minWidth: "110px", background: "#f1f5f9" }}
                    >
                      {trabajador.img ? (
                        <img
                          src={`data:image/jpeg;base64,${trabajador.img}`}
                          alt="Foto de perfil"
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <i className="fa-solid fa-user text-primary" style={{ fontSize: "3.5rem" }}></i>
                      )}
                    </div>
                    <div>
                      <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill mb-2 fw-semibold">
                        {trabajador.Cargo || "Colaborador AIROVA"}
                      </span>
                      <h2 className="h4 fw-bold text-dark mb-1">{trabajador.Nombre}</h2>
                      <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-2 text-muted small">
                        <IdBadge prefix="USR" id={trabajador.Codigo_Usuario} />
                        <span>• @{trabajador.Nombre_Usuario}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <h3 className="h6 fw-bold text-uppercase text-secondary letter-spacing-1 mb-3">
                    Información Personal & Contacto
                  </h3>
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <div className="p-3 bg-light rounded-3 border">
                        <span className="text-muted small d-block mb-1">
                          <i className="fa-solid fa-address-card me-1 text-primary"></i> DNI / Documento
                        </span>
                        <span className="fw-semibold text-dark font-monospace">{trabajador.DNI || "No registrado"}</span>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6">
                      <div className="p-3 bg-light rounded-3 border">
                        <span className="text-muted small d-block mb-1">
                          <i className="fa-solid fa-cake-candles me-1 text-primary"></i> Edad
                        </span>
                        <span className="fw-semibold text-dark">{trabajador.Edad ? `${trabajador.Edad} años` : "No registrada"}</span>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6">
                      <div className="p-3 bg-light rounded-3 border">
                        <span className="text-muted small d-block mb-1">
                          <i className="fa-solid fa-phone me-1 text-primary"></i> Celular
                        </span>
                        <span className="fw-semibold text-dark">{trabajador.Celular || "No registrado"}</span>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6">
                      <div className="p-3 bg-light rounded-3 border">
                        <span className="text-muted small d-block mb-1">
                          <i className="fa-solid fa-envelope me-1 text-primary"></i> Correo Electrónico
                        </span>
                        <span className="fw-semibold text-dark">{trabajador.Email || "No registrado"}</span>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="p-3 bg-light rounded-3 border">
                        <span className="text-muted small d-block mb-1">
                          <i className="fa-solid fa-location-dot me-1 text-primary"></i> Dirección
                        </span>
                        <span className="fw-semibold text-dark">{trabajador.Direccion || "No registrada"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrabajadorPerfil;
