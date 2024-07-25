import React, { useState, useRef } from 'react';
import style from './DashboardLogin.module.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const DashboardLogin = ({ className = "" }) => {
  const [captchavalido, cambiarcaptchavalido] = useState(null);
  const [usuariovalido, cambiarusuariovalido] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const captcha = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onChange = () => {
    if (captcha.current.getValue()) {
      cambiarcaptchavalido(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (captcha.current.getValue()) {
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
          cambiarusuariovalido(false);
          alert(data.error);
        } else {
          const { Codigo_Cargo, Codigo_Usuario, token } = data.user; // Asegúrate de que los datos están correctos
          if (Codigo_Cargo && Codigo_Usuario) {
            login(data.user);
            if (document.getElementById('checkbox').checked) {
              localStorage.setItem('token', token); // Usa el token del servidor
              localStorage.setItem('user', JSON.stringify(data.user));
            } else {
              sessionStorage.setItem('token', token); // Usa el token del servidor
              sessionStorage.setItem('user', JSON.stringify(data.user));
            }
            redirectToPage(Codigo_Cargo, Codigo_Usuario);
          } else {
            alert('Error: Datos incompletos recibidos del servidor');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }
    } else {
      cambiarcaptchavalido(false);
    }
  };

  const redirectToPage = (Codigo_Cargo, Codigo_Usuario) => {
    switch (Codigo_Cargo) {
      case 1:
        navigate(`/VistaAdmin/${Codigo_Usuario}` , { state: { Codigo_Usuario } });
        break;
      case 2:
        navigate(`/VistaUsuario/${Codigo_Usuario}`, { state: { Codigo_Usuario } });
        break;
      case 3:
        navigate(`/VistaChofer/${Codigo_Usuario}`, { state: { Codigo_Usuario } });
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
            <form onSubmit={handleLogin}>
              <img className="imgIngreso" alt="imgIngreso" src="/undraw-login-re-4vu2-1.svg"/>
              <div className={style.formusername}>
                <img className={style.icon} alt="icon" src="/user.svg" />
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
                <input className={style.sino} type="checkbox" id="checkbox" />
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
              <a className={style.a} href="url">Olvidaste tu contraseña?</a>
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default DashboardLogin;
