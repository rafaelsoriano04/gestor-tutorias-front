import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './css/Informe.css';
function Informe() {
    const navigate = useNavigate();
    const { idEstudiante } = useParams();
    const handleNavigation = () => {
        localStorage.removeItem('jwtToken');
        navigate('/');
      };
   
    return(
        <div>
      <nav className="navbar bg-custom">
        <div className="container-fluid d-flex justify-content-between">
          <span className="navbar-text text-custom">
            Universidad Técnica de Ambato 
          </span>
          <div
            className="d-flex align-items-center text-custom logout"
            style={{ cursor: 'pointer' }}
            onClick={handleNavigation}
          >
            <i className="fas fa-user mr-2"></i>
            <span className="logout-text ms-2">Cerrar sesión</span>
          </div>
        </div>
      </nav>
      {/*AQUI SE LLAMA A LA TABLA, TOMAR COMO EJEMPLO A PRINCIPAL PARA SABER COMO SE LLAMA A LA TABLA
      ENVIAR EL PARAMETRO QUE SE OBTIENE DEL CONTRUCTOR COMO idEstudiantes  */}
      ESTOY EN INFORMES
    </div>
    );
}

export default Informe;
