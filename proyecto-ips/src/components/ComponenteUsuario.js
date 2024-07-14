// src/components/ComponenteUsuario.js
import React, { useState } from "react";
import "./PrimerComponente.css";
import ReCAPTCHA from "react-google-recaptcha";

const ComponenteUsuario = () => {
  const onChange = () => {
    console.log("Hubo un Cambio");
  }
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login:", { username, password });
  };

  return (
    <div className="login-container">
      <h1>Este es el segundo Compoenente</h1>
      <form onSubmit={handleLogin}>
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
            sitekey="6Lf0ew8qAAAAAC8TIhRBOmlUgkbESMIu655rY2_W"
            onChange={onChange}
          />,
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default ComponenteUsuario;
