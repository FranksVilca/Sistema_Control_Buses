import React, { useState, useRef } from 'react';
import PropTypes from "prop-types";
import './DashboardLogin.css';
import ReCAPTCHA from "react-google-recaptcha";
import CryptoJS from "crypto-js";

const DashboardLogin = ({ className = "" }) => {
  const [captchavalido, cambiarcaptchavalido] = useState(null);
  const [usuariovalido, cambiarusuariovalido] = useState(false);
  const captcha = useRef(null);

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
    // Aquí puedes almacenar el token en localStorage en lugar de cookies
    localStorage.setItem('token', 'your-token-value');
    // Lógica adicional para manejar el inicio de sesión con username y encryptedPassword
  };

  return (
    <div className={`dashboard ${className}`}>
      <div className="bg-container">
        <img className="bg-icon" alt="" src="/bg.svg" />
      </div>
      <div className="container">
        {!usuariovalido &&
          <>
            <form className="login-form" onSubmit={(e) => { handleLogin(e); submit(e); }}>
              <img className="imgIngreso" alt="imgIngreso" src="/undraw-login-re-4vu2-1.svg"/>
              <div className="form-username">
                <img className="icon" alt="icon" src="/user.svg" />
                <input
                  className="username"
                  type="text"
                  placeholder="USERNAME"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-password">
                <img className="icon" alt="icon" src="/lock.svg" />
                <input
                  className="password"
                  type="password"
                  placeholder="PASSWORD"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="divCB">
                <input className="sino" type="checkbox" id="checkbox" value="Mantener tu cuenta iniciada" />
                <label htmlFor="checkbox">Mantener tu cuenta iniciada</label>
              </div>
              <div className="recaptcha">
                <ReCAPTCHA
                  ref={captcha}
                  sitekey="6Lf0ew8qAAAAAC8TIhRBOmlUgkbESMIu655rY2_W"
                  onChange={onChange}
                />
              </div>
              {captchavalido === false && <div className='error-captcha'>Por favor acepta el captcha</div>}
              <button className="login" type="submit">LOGIN</button>
            </form>
            <div className="olvContraseña">
              <div className="dashboard-login-item"></div>
              <a href="url">Olvidaste tu contraseña?</a>
              <div className="dashboard-login-inner"></div>
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
