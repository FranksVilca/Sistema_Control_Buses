import React from 'react';
import PropTypes from "prop-types";
import "./DashboardLogin.css";

const DashboardLogin = ({ className = "" }) => {
  return (
    <div class="dashboard">
        <div class="bg-container">
          <img class="bg-icon" alt="" src="/bg.svg" />
        </div>
        <div class="container">
        <form class="login-form">
            <img class="imgIngreso" alt="imgIngreso" src="/undraw-login-re-4vu2-1.svg"/>
            <div class="form-username">
                <img class="icon" alt="icon" src="/user.svg" />
              <input class= "username" type="text" placeholder="USERNAME" id="username" name="username" required/>
            </div>
            <div class="form-password">
                <img class="icon" alt="icon" src="/lock.svg" />
              <input class= "password" type="password" placeholder="PASSWORD" id="password" name="password" required/>
            </div>
            <div class="divCB">
            <input class="sino" type="checkbox" id="checkbox" value="Mantener tu cuenta iniciada" />
            <label for="checkbox">Mantener tu cuenta iniciada</label>
            </div>
            <button class="login" type="submit">LOGIN</button>
          </form>
        <div class="olvContraseña">
                <div class="dashboard-login-item" ></div>
                <a href="url">Olvidaste tu contraseña?</a>
                <div class="dashboard-login-inner" ></div>
        </div>
       </div>
    </div>
  );
};

DashboardLogin.propTypes = {
  className: PropTypes.string,
};

export default DashboardLogin;
