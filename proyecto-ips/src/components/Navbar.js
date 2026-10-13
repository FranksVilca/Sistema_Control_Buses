import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleName = (cargoId) => {
    switch (cargoId) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Trabajador';
      case 3:
        return 'Chofer';
      default:
        return 'Usuario';
    }
  };

  const getHomePath = () => {
    if (!user) return '/';
    if (user.Codigo_Cargo === 1) return `/VistaAdmin/${user.Codigo_Usuario}`;
    if (user.Codigo_Cargo === 2) return `/VistaUsuario/${user.Codigo_Usuario}`;
    if (user.Codigo_Cargo === 3) return `/VistaChofer/${user.Codigo_Usuario}`;
    return '/';
  };

  const isActive = (path) => {
    return location.pathname.toLowerCase().startsWith(path.toLowerCase());
  };

  return (
    <nav className="airova-navbar navbar navbar-expand-lg">
      <div className="container-fluid px-4">
        {/* Brand Logo & Title */}
        <div 
          className="navbar-brand d-flex align-items-center gap-2 cursor-pointer" 
          onClick={() => navigate(getHomePath())}
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-logo-wrapper">
            <img 
              src="/logoairova.png" 
              alt="AIROVA" 
              className="brand-logo" 
              onError={(e) => {
                e.target.style.display = 'none';
              }} 
            />
          </div>
          <div className="d-flex flex-column">
            <span className="brand-name">AIROVA</span>
            <span className="brand-tagline">Control de Buses</span>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="navbar-toggler border-0 shadow-none text-light" 
          type="button" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} fs-4`}></i>
        </button>

        {/* Nav Links */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 gap-lg-2">
            {user?.Codigo_Cargo === 1 && (
              <>
                <li className="nav-item">
                  <button 
                    className={`nav-link nav-btn ${isActive('/ComponenteGestorHorarios') || isActive('/PaginaInsertarHorarios') ? 'active' : ''}`}
                    onClick={() => { setMobileMenuOpen(false); navigate('/ComponenteGestorHorarios'); }}
                  >
                    <i className="fa-solid fa-clock me-2"></i>
                    Horarios
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link nav-btn ${isActive('/ComponenteGestorBuses') || isActive('/InsertarBus') ? 'active' : ''}`}
                    onClick={() => { setMobileMenuOpen(false); navigate('/ComponenteGestorBuses'); }}
                  >
                    <i className="fa-solid fa-bus-simple me-2"></i>
                    Buses
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link nav-btn ${isActive('/ComponenteGestorRuta') || isActive('/PaginaInsertarRuta') ? 'active' : ''}`}
                    onClick={() => { setMobileMenuOpen(false); navigate('/ComponenteGestorRuta'); }}
                  >
                    <i className="fa-solid fa-route me-2"></i>
                    Rutas
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link nav-btn ${isActive('/GestionarUsuarios') || isActive('/InsertarUsuario') ? 'active' : ''}`}
                    onClick={() => { setMobileMenuOpen(false); navigate('/GestionarUsuarios'); }}
                  >
                    <i className="fa-solid fa-users me-2"></i>
                    Usuarios
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link nav-btn ${isActive('/GestionarTurno') || isActive('/InsertarTurno') ? 'active' : ''}`}
                    onClick={() => { setMobileMenuOpen(false); navigate('/GestionarTurno'); }}
                  >
                    <i className="fa-solid fa-calendar-days me-2"></i>
                    Turnos
                  </button>
                </li>
              </>
            )}

            {user?.Codigo_Cargo === 3 && (
              <>
                <li className="nav-item">
                  <button 
                    className={`nav-link nav-btn ${isActive('/Asistencia') ? 'active' : ''}`}
                    onClick={() => { setMobileMenuOpen(false); navigate('/Asistencia/1'); }}
                  >
                    <i className="fa-solid fa-clipboard-check me-2"></i>
                    Marcar Asistencia
                  </button>
                </li>
              </>
            )}

            {user?.Codigo_Cargo === 2 && (
              <>
                <li className="nav-item">
                  <button 
                    className={`nav-link nav-btn ${isActive('/TrabajadorTurno') ? 'active' : ''}`}
                    onClick={() => { setMobileMenuOpen(false); navigate('/TrabajadorTurno'); }}
                  >
                    <i className="fa-solid fa-calendar-check me-2"></i>
                    Mi Turno
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link nav-btn ${isActive('/TrabajadorPerfil') ? 'active' : ''}`}
                    onClick={() => { setMobileMenuOpen(false); navigate('/TrabajadorPerfil'); }}
                  >
                    <i className="fa-solid fa-id-card me-2"></i>
                    Mi Perfil
                  </button>
                </li>
              </>
            )}
          </ul>

          {/* User Profile & Theme Toggle & Logout */}
          <div className="d-flex align-items-center gap-2 gap-lg-3 pt-3 pt-lg-0 ">
            {/* Dark Mode Toggle Button */}
            <button
              className="btn btn-theme-toggle d-flex align-items-center justify-content-center"
              onClick={toggleTheme}
              title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
              type="button"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <i className="fa-solid fa-sun text-warning fs-5"></i>
              ) : (
                <i className="fa-solid fa-moon text-info fs-5"></i>
              )}
            </button>

            <div className="user-info-pill d-flex align-items-center gap-2">
              <div className="user-avatar">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="d-flex flex-column text-start">
                <span className="user-name">{user?.Nombre || user?.Nombre_Usuario || 'Usuario'}</span>
                <span className="user-role-badge">{getRoleName(user?.Codigo_Cargo)}</span>
              </div>
            </div>

            <button 
              className="btn btn-outline-danger btn-logout d-flex align-items-center gap-2 px-3 py-2"
              onClick={handleLogout}
              title="Cerrar Sesión"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span className="d-none d-sm-inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
