import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import './css/Principal.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Principal() {
  const navigate = useNavigate();
  //decodificar el token
  const token = localStorage.getItem('jwtToken');
  const decoded = jwtDecode(token);
  const handleNavigation = () => {
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  const userName = decoded.nombre_usuario;
  return (
    <div>
      <nav className="navbar bg-custom">
        <div className="container-fluid d-flex justify-content-between">
          <span className="navbar-text text-custom">
            Bienvenido {userName}
          </span>
          <div
            className="d-flex align-items-center text-custom logout"
            style={{ cursor: 'pointer' }}
            onClick={handleNavigation}
          >
            <i className="fas fa-user fa-2x mr-2"></i> {/* fa-2x hace el icono más grande */}
            <span className="logout-text">Cerrar sesión</span>
          </div>
        </div>
      </nav>
       
      <table>
        <tr>
          <th>Estudiante</th>
        </tr>
        <tr>
          Numero 1
        </tr>
      </table>
    </div>

  );
}

export default Principal;
