// src/components/Register.jsx
import React, { useState } from 'react';
import './Register.css';  // Asegúrate de que el path del CSS es correcto
import 'bootstrap/dist/css/bootstrap.min.css';

function Register({ onLoginClick }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''  // Agrego campo para confirmar contraseña
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

    // Agregar validación de las contraseñas que coincidan
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/usuarios/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Registration Successful:', data);
        alert('Registration successful!');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        <div className="form-group">
          <label>Username:
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
          <label>Password:
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label>Confirm Password:
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
        <button type="button" className="btn btn-link" onClick={onLoginClick}>Login</button>
      </form>
    </div>
  );
}

export default Register;
