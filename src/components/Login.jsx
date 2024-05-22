// src/components/Login.jsx
import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import "./Login.css"; // Asegúrate de que el path del CSS es correcto
import "bootstrap/dist/css/bootstrap.min.css";

function Login({ onRegisterClick }) {
  const [jwtToken, setJwtToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const validarDatos = async () => {
    return await axios
      .post("http://localhost:3000/auth/login", {
        nombre_usuario: username,
        contrasenia: password,
      })
      .then((resp) => resp.data)
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = await validarDatos();
    console.log(token);
    setJwtToken(token);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label>
            Usuario:
            <input
              type="text"
              name="username"
              className="form-control"
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Contraseña:
            <input
              type="password"
              name="password"
              className="form-control"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <button
          type="button"
          className="btn btn-link"
          onClick={onRegisterClick}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Login;
