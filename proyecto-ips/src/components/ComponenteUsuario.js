import React, { useState } from "react";
import "./PrimerComponente.css";
import CryptoJS from "crypto-js";

const ComponenteUsuario = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const encryptedPassword = CryptoJS.AES.encrypt(password, 'your-secret-key').toString();
    console.log("Login:", { username, password: encryptedPassword });
  };

  return (
    <div className="login-container">
      <h1>Este es el segundo Componente</h1>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default ComponenteUsuario;
