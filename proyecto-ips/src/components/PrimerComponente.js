import React, { useState, useRef } from 'react';
import './PrimerComponente.css';
import ReCAPTCHA from "react-google-recaptcha";
import CryptoJS from "crypto-js";

const PrimerComponente = () => {
  const [captchavalido, cambiarcaptchavalido] = useState(null);
  const [usuariovalido, cambiarusuariovalido] = useState(false);

  const captcha = useRef(null);

  const onChange = () => {
    if (captcha.current.getValue()) {
      console.log("El usuario es valido");
      cambiarcaptchavalido(true);
    }
  }

  const submit = (e) => {
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
  
  const handleLogin = (e) => {
    e.preventDefault();
    const encryptedPassword = CryptoJS.AES.encrypt(password, 'your-secret-key').toString();
  };

  return (
    <div className="login-container">
      { !usuariovalido &&
        <>
          <h1>ARIOVA S.A.C.</h1>
          <form onSubmit={(e) => { handleLogin(e); submit(e); }}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="recaptcha">
              <ReCAPTCHA
                ref={captcha}
                sitekey="6Lf0ew8qAAAAAC8TIhRBOmlUgkbESMIu655rY2_W"
                onChange={onChange}
              />
            </div>
            {captchavalido === false && <div className='error-captcha'>
              Por favor acepta el captcha
            </div>}
            <button type="submit">Login</button>
          </form>
        </>
      }  
    </div>
  );
};

export default PrimerComponente;
