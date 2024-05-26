import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import './css/Principal.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

function Principal() {
  const [userName, setUserName] = useState('');
  const [persona, setPersona] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Decodificar el token
  const token = localStorage.getItem('jwtToken');
  let decoded;
  try {
    decoded = jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    handleNavigation(); // Navegar a la página de login si hay un error con el token
  }

  const obtenerDocente = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/docente/${id}`);
      return response.data;
    } catch (error) {
      console.log(error.response ? error.response.data.message : error.message);
      throw error;
    }
  };

  //asignar los datos de la persona, aqui se obtiene la informacion de la persona docente
  useEffect(() => {
    if (decoded?.id) {
      obtenerDocente(decoded.id)
        .then((docente) => {
          setUserName(docente.persona.nombre);
          setPersona(docente.persona);
        })
        .catch((error) => {
          setError(error);
          handleNavigation();
        });
    }
  }, [decoded]);


  const handleNavigation = () => {
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar bg-custom">
        <div className="container-fluid d-flex justify-content-between">
          <span className="navbar-text text-custom">
            Bienvenido {persona.nombre} {persona.apellido}
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


    </div>

  );
}

export default Principal;
