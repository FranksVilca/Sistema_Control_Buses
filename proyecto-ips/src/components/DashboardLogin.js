import React, { useState, useRef } from 'react';
import style from './DashboardLogin.module.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import Swal from 'sweetalert2';

const DashboardLogin = ({ className = "" }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaValido, setCaptchaValido] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const captcha = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaValido(true);
      setCaptchaError(false);
    } else {
      setCaptchaValido(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Verificación de captcha
    const captchaValue = captcha.current ? captcha.current.getValue() : null;
    if (!captchaValue && !captchaValido) {
      setCaptchaError(true);
      Swal.fire({
        icon: 'warning',
        title: 'Verificación requerida',
        text: 'Por favor, marca la casilla del reCAPTCHA para continuar.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Nombre_Usuario: username, Contrasena: password })
      });
      const data = await response.json();

      if (data.error) {
        Swal.fire({
          icon: 'error',
          title: 'Acceso Denegado',
          text: data.error,
          confirmButtonColor: '#2563eb'
        });
      } else {
        const { Codigo_Cargo, Codigo_Usuario, token } = data.user;
        if (Codigo_Cargo && Codigo_Usuario) {
          login(data.user);
          const remember = document.getElementById('rememberCheckbox')?.checked;
          
          if (remember) {
            localStorage.setItem('token', token || 'active_token');
            localStorage.setItem('user', JSON.stringify(data.user));
          } else {
            sessionStorage.setItem('token', token || 'active_token');
            sessionStorage.setItem('user', JSON.stringify(data.user));
          }
          localStorage.setItem('IDUSER', Codigo_Usuario);

          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: `Sesión iniciada como ${data.user.Nombre || data.user.Nombre_Usuario}`,
            timer: 1500,
            showConfirmButton: false
          });

          setTimeout(() => {
            redirectToPage(Codigo_Cargo, Codigo_Usuario);
          }, 1200);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de servidor',
            text: 'Datos incompletos recibidos del servidor.',
            confirmButtonColor: '#2563eb'
          });
        }
      }
    } catch (error) {
      console.error('Error de red:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor (puerto 3001). Asegúrate de que node Server.js esté corriendo.',
        confirmButtonColor: '#2563eb'
      });
    } finally {
      setLoading(false);
    }
  };

  const redirectToPage = (Codigo_Cargo, Codigo_Usuario) => {
    switch (Codigo_Cargo) {
      case 1:
        navigate(`/VistaAdmin/${Codigo_Usuario}`, { state: { Codigo_Usuario } });
        break;
      case 2:
        navigate(`/VistaUsuario/${Codigo_Usuario}`, { state: { Codigo_Usuario } });
        break;
      case 3:
        navigate(`/VistaChofer/${Codigo_Usuario}`, { state: { Codigo_Usuario } });
        break;
      default:
        Swal.fire({
          icon: 'warning',
          title: 'Rol desconocido',
          text: 'Tu usuario no tiene un rol configurado en el sistema.'
        });
    }
  };

  return (
    <div className={style.loginBackground}>
      <div className={style.loginCard}>
        {/* Top bar with theme toggle */}
        <div className="d-flex justify-content-end mb-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
            style={{ width: "36px", height: "36px" }}
            onClick={toggleTheme}
            title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
          >
            {isDark ? (
              <i className="fa-solid fa-sun text-warning"></i>
            ) : (
              <i className="fa-solid fa-moon text-info"></i>
            )}
          </button>
        </div>

        {/* Brand header */}
        <div className={style.brandHeader}>
          <div className={style.brandIconCircle}>
            <i className="fa-solid fa-bus text-primary fs-3"></i>
          </div>
          <h1 className={style.brandTitle}>AIROVA</h1>
          <p className={style.brandSubtitle}>Sistema de Control y Gestión de Buses</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className={style.form}>
          <div className="mb-3">
            <label className={style.inputLabel} htmlFor="username">
              Usuario
            </label>
            <div className={style.inputGroup}>
              <span className={style.inputIcon}>
                <i className="fa-solid fa-user text-muted"></i>
              </span>
              <input
                id="username"
                type="text"
                className={style.formInput}
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className={style.inputLabel} htmlFor="password">
              Contraseña
            </label>
            <div className={style.inputGroup}>
              <span className={style.inputIcon}>
                <i className="fa-solid fa-lock text-muted"></i>
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={style.formInput}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className={style.togglePasswordBtn}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-muted`}></i>
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberCheckbox"
              />
              <label className={`form-check-label ${style.checkboxLabel}`} htmlFor="rememberCheckbox">
                Recordar sesión
              </label>
            </div>
          </div>

          {/* reCAPTCHA */}
          <div className="d-flex justify-content-center mb-3">
            <div className={style.recaptchaContainer}>
              <ReCAPTCHA
                ref={captcha}
                sitekey="6Lf0ew8qAAAAAC8TIhRBOmlUgkbESMIu655rY2_W"
                onChange={handleCaptchaChange}
              />
            </div>
          </div>
          {captchaError && (
            <div className="alert alert-danger py-2 px-3 small text-center mb-3">
              <i className="fa-solid fa-circle-exclamation me-1"></i> Completa el reCAPTCHA para ingresar.
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className={style.submitButton}
            disabled={loading}
          >
            {loading ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <i className="fa-solid fa-spinner fa-spin"></i>
                Verificando...
              </span>
            ) : (
              <span className="d-flex align-items-center justify-content-center gap-2">
                Iniciar Sesión
                <i className="fa-solid fa-arrow-right-to-bracket"></i>
              </span>
            )}
          </button>
        </form>

        <div className={style.cardFooter}>
          <small className="text-muted">
            <i className="fa-solid fa-shield-halved me-1"></i> Acceso protegido y encriptado
          </small>
        </div>
      </div>
    </div>
  );
};

export default DashboardLogin;
