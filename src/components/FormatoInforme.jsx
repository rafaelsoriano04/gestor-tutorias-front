import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './css/Informe.css';
import TablaInformes from './TablaInformes';


function FormatoInforme() {
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
          <span className="navbar-text text-white">
            Universidad Técnica de Ambato
          </span>
          <div
            className="d-flex align-items-center text-custom logout"
            style={{ cursor: 'pointer' }}
            onClick={handleNavigation}
          >
            <span className="logout-text ms-2 pe-3">Cerrar Sesion</span>
            <i className="fas fa-user mr-2"></i>
            
          </div>
        </div>
      </nav>
      <TablaInformes id_estudiante={idEstudiante} refresh={false} />
    </div>
    );
}

export default FormatoInforme;
