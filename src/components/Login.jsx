// src/components/Login.jsx
import React, { useState } from 'react';
import './Login.css';  // Asegúrate de que el path del CSS es correcto
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({ onRegisterClick }) {
  const [formData, setFormData] = useState({
    username: '',  // Cambiado de nombre_usuario a username
    password: ''   // Cambiado de contrasenia a password
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre_usuario: formData.username,  
          contrasenia: formData.password      
        })
      });
      console.log("Raw Response:", response);
      const data = await response.json();
      if (response.ok) {
        console.log('Login Successful:', data);
        localStorage.setItem('token', data.token); // Guarda el token en localStorage
        alert('Login successful!');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: ' + error.message);
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label>Usuario:
            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label>Contraseña:
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
        <button type="button" className="btn btn-link" onClick={onRegisterClick}>Register</button>
      </form>
    </div>
  );
}

export default Login;
