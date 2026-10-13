import React from "react";
import style from "./VistaAdmin.module.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const VistaAdmin = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: "buses",
      title: "Flota de Buses",
      tag: "Unidades de Transporte",
      description: "Administra las unidades vehiculares, número de asientos, modelo, placas y estado de mantenimiento.",
      icon: "fa-bus",
      color: "#40DE41",
      bgGradient: "linear-gradient(135deg, rgba(64, 222, 65, 0.15), rgba(64, 222, 65, 0.05))",
      primaryAction: { label: "Ver Buses", path: "/ComponenteGestorBuses", icon: "fa-list" },
      secondaryAction: { label: "Registrar Bus", path: "/InsertarBus", icon: "fa-plus" }
    },
    {
      id: "rutas",
      title: "Rutas y Destinos",
      tag: "Trayectos",
      description: "Define y gestiona los puntos de salida y llegada para todos los recorridos del sistema de transporte.",
      icon: "fa-route",
      color: "#0891b2",
      bgGradient: "linear-gradient(135deg, rgba(8, 145, 178, 0.12), rgba(6, 182, 212, 0.04))",
      primaryAction: { label: "Ver Rutas", path: "/ComponenteGestorRuta", icon: "fa-list" },
      secondaryAction: { label: "Nueva Ruta", path: "/PaginaInsertarRuta", icon: "fa-plus" }
    },
    {
      id: "horarios",
      title: "Horarios e Itinerarios",
      tag: "Programación",
      description: "Controla las fechas, horas de salida y horas de llegada programadas para las diferentes rutas.",
      icon: "fa-clock",
      color: "#7c3aed",
      bgGradient: "linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(139, 92, 246, 0.04))",
      primaryAction: { label: "Ver Horarios", path: "/ComponenteGestorHorarios", icon: "fa-list" },
      secondaryAction: { label: "Nuevo Horario", path: "/PaginaInsertarHorarios", icon: "fa-plus" }
    },
    {
      id: "turnos",
      title: "Asignación de Turnos",
      tag: "Operaciones",
      description: "Vincula en un viaje activo: la ruta correspondiente, el horario establecido, el bus y el chofer asignado.",
      icon: "fa-calendar-days",
      color: "#ea580c",
      bgGradient: "linear-gradient(135deg, rgba(234, 88, 12, 0.12), rgba(249, 115, 22, 0.04))",
      primaryAction: { label: "Gestionar Turnos", path: "/GestionarTurno", icon: "fa-list" },
      secondaryAction: { label: "Programar Turno", path: "/InsertarTurno", icon: "fa-plus" }
    },
    {
      id: "usuarios",
      title: "Personal y Usuarios",
      tag: "Equipo de Trabajo",
      description: "Gestiona cuentas de usuarios, choferes y administradores con roles, credenciales y perfiles.",
      icon: "fa-users-gear",
      color: "#059669",
      bgGradient: "linear-gradient(135deg, rgba(5, 150, 105, 0.12), rgba(16, 185, 129, 0.04))",
      primaryAction: { label: "Ver Usuarios", path: "/GestionarUsuarios", icon: "fa-list" },
      secondaryAction: { label: "Registrar Usuario", path: "/InsertarUsuario", icon: "fa-plus" }
    }
  ];

  return (
    <div className={style.pageWrapper}>
      <Navbar />

      <div className="container py-4 px-3 px-md-4">
        {/* Welcome Hero Banner */}
        <div className={style.heroBanner}>
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span className={style.heroBadge}>
                <i className="fa-solid fa-crown me-1 text-warning"></i> Panel de Administración
              </span>
              <h1 className={style.heroTitle}>Bienvenido, Administrador</h1>
              <p className={style.heroSubtitle}>
                Monitorea y gestiona centralizadamente la flota de buses, rutas, itinerarios y equipo de conductores de AIROVA.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <div className={style.statusPill}>
                <span className={style.pulseDot}></span>
                <span>Sistema Operativo en Línea</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section title */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="fs-4 fw-bold text-dark mb-1">Módulos de Gestión</h2>
            <p className="text-muted small mb-0">Selecciona un área para consultar registros o crear nuevos</p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="row g-4">
          {modules.map((mod) => (
            <div className="col-12 col-md-6 col-xl-4" key={mod.id}>
              <div className={style.moduleCard}>
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div
                    className={style.moduleIconBox}
                    style={{ background: mod.bgGradient, color: mod.color, borderColor: `${mod.color}33` }}
                  >
                    <i className={`fa-solid ${mod.icon}`}></i>
                  </div>
                  <span className={style.moduleTag}>{mod.tag}</span>
                </div>

                <h3 className={style.moduleTitle}>{mod.title}</h3>
                <p className={style.moduleDesc}>{mod.description}</p>

                <div className="d-flex gap-2 pt-3 border-top border-light mt-auto">
                  <button
                    className={`btn flex-grow-1 ${style.btnPrimaryCustom}`}
                    style={{ background: mod.color, borderColor: mod.color }}
                    onClick={() => navigate(mod.primaryAction.path)}
                  >
                    <i className={`fa-solid ${mod.primaryAction.icon} me-2`}></i>
                    {mod.primaryAction.label}
                  </button>
                  <button
                    className={`btn ${style.btnSecondaryCustom}`}
                    onClick={() => navigate(mod.secondaryAction.path)}
                    title={mod.secondaryAction.label}
                  >
                    <i className={`fa-solid ${mod.secondaryAction.icon}`}></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VistaAdmin;
