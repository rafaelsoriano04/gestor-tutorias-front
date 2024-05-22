// src/components/Login.js
import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    contrasenia: ''
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${formData.token}` // Assuming you are handling tokens
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log('Success:', data);
      localStorage.setItem('token', data.token); // Save token to localStorage
      alert('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.nombre_usuario}
          onChange={handleChange}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.contrasenia}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
