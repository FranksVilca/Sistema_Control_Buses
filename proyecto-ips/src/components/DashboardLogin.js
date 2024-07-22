import React, { useState, useRef } from 'react';
import PropTypes from "prop-types";
import style from './DashboardLogin.module.css';
import ReCAPTCHA from "react-google-recaptcha";
import CryptoJS from "crypto-js";
import { useNavigate } from 'react-router-dom';

const DashboardLogin = ({ className = "" }) => {
  const [captchavalido, cambiarcaptchavalido] = useState(null);
  const [usuariovalido, cambiarusuariovalido] = useState(false);
  const captcha = useRef(null);
  const navigate = useNavigate();

  const onChange = () => {
    if (captcha.current.getValue()) {
      console.log("El usuario es valido");
      cambiarcaptchavalido(true);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (captcha.current.getValue()) {
      console.log("El usuario es valido");
      cambiarusuariovalido(true);
      cambiarcaptchavalido(true);
    } else {
      console.log('Por favor acepta el captcha');
      cambiarusuariovalido(false);
      cambiarcaptchavalido(false);
    }
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const encryptedPassword = CryptoJS.AES.encrypt(password, 'your-secret-key').toString();
  
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Nombre_Usuario: username, Contrasena: encryptedPassword })
      });
      const data = await response.json();
      
      if (data.error) {
        alert(data.error);
        cambiarusuariovalido(false);
      } else {
        localStorage.setItem('token', 'your-token-value'); // Puedes usar el token del servidor si lo devuelves
        redirectToPage(data.Codigo_Cargo, data.Codigo_Usuario);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  const redirectToPage = (Codigo_Cargo, Codigo_Usuario) => {
    switch(Codigo_Cargo) {
      case 1:
        navigate(`/VistaAdmin/${Codigo_Usuario}`); // Redirige a la vista de administrador con el ID del usuario
        break;
      case 2:
        navigate(`/VistaChofer/${Codigo_Usuario}`); // Redirige a la vista del chofer con el ID del usuario
        break;
      case 3:
        navigate(`/VistaUsuario/${Codigo_Usuario}`); // Redirige a la vista del usuario con el ID del usuario
        break;
      default:
        alert('Código de cargo no reconocido');
    }
  };

  return (
    <div className={`${style.dashboard} ${className}`}>
      <div className={style.bgcontainer}>
        <img className={style.bgicon} alt="" src="/bg.svg" />
      </div>
      <div className={style.container}>
        {!usuariovalido &&
          <>
            <form onSubmit={(e) => {handleLogin(e); submit(e); }}>
              <img className="imgIngreso" alt="imgIngreso" src="/undraw-login-re-4vu2-1.svg"/>
              <div className={style.formusername}>
                <img className={style.icon}alt="icon" src="/user.svg" />
                <input
                  className={style.username}
                  type="text"
                  placeholder="USERNAME"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className={style.formpassword}>
                <img className={style.icon} alt="icon" src="/lock.svg" />
                <input
                  className={style.password}
                  type="password"
                  placeholder="PASSWORD"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={style.divCB}>
                <input className={style.sino} type="checkbox" id="checkbox" value="Mantener tu cuenta iniciada" />
                <label htmlFor="checkbox">Mantener tu cuenta iniciada</label>
              </div>
              <div className={style.recaptcha}>
                <ReCAPTCHA
                  ref={captcha}
                  sitekey="6Lf0ew8qAAAAAC8TIhRBOmlUgkbESMIu655rY2_W"
                  onChange={onChange}
                />
              </div>
              {captchavalido === false && <div className='error-captcha'>Por favor acepta el captcha</div>}
              <button className={style.login} type="submit">LOGIN</button>
            </form>
            <div className={style.olvContraseña}>
              <div className={style.dashboardloginitem}></div>
              <a className={style.a} href="url">Olvidaste tu contraseña?</a>
              <div className={style.dashboardlogininner}></div>
            </div>
          </>
        }
      </div>
    </div>
  );
};

DashboardLogin.propTypes = {
  className: PropTypes.string,
};

export default DashboardLogin;
