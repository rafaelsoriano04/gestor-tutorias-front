// src/components/Login.jsx
import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import "./css/Login.css"; // Asegúrate de que el path del CSS es correcto
import "bootstrap/dist/css/bootstrap.min.css";
import logoUsuario from "../assets/logoUsuario.png"
import { useNavigate } from 'react-router-dom';


function Login({ onRegisterClick }) {
  const [jwtToken, setJwtToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
    
    if (token) { 
      setJwtToken(token);
      navigate('/principal'); 
    } else {
      alert('Login Fallido');
    }

  };
  

  return (
    <form onSubmit={handleSubmit} className="login container-fluid d-flex flex-column justify-content-center align-items-center p-5 m-5" style={{ height: '100vh' }}>
      <img className="img-fluid mb-3" src={logoUsuario} alt="User Logo" style={{ maxHeight: '110px' }} />
      <p className="font-weight-bold fs-1">Login</p>
      <p><a className="link-opacity-25-hover text-white" onClick={onRegisterClick}>Crear una cuenta</a></p>
      <div className="mt-4" style={{ width: '100%', maxWidth: '400px' }}>
        <label className="fs-5 pb-2">Nombre de usuario:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Usuario"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div className="mt-4" style={{ width: '100%', maxWidth: '400px' }}>
        <label className="fs-5 pb-2">Ingrese la contraseña:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Contraseña"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <p className="mt-3">
        <a onClick={onRegisterClick} className="link-underline-light link-offset-2 text-white">Olvidé mi contraseña</a>
      </p>
      <a ><button type="submit" className="btnInicio btn btn-secondary mt-4 btn-lg pe-4 ps-4">Iniciar sesión</button></a>
    </form>
  );

}

export default Login;
