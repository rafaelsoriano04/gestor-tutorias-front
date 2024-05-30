import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import TablaEstudiantes from './TablaEstudiantes';
import './css/Principal.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

function Principal() {
  const [userName, setUserName] = useState('');
  const [id_docente, setId_docente]= useState('');
  const [persona, setPersona] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');
  
  let decoded;

  const obtenerDocente = async (id) => {
    
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      handleNavigation(); // Navegar a la página de login si hay un error con el token
    }

    
    try {
      const response = await axios.get(`http://localhost:3000/docente/${id}`);
      setId_docente(decoded.id)
      return response.data;
    } catch (error) {
      console.log(error.response ? error.response.data.message : error.message);
      throw error;
    }
  };

  // Asignar los datos de la persona, aqui se obtiene la informacion de la persona docente
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
            Universidad Técnica de Ambato {persona.nombre} {persona.apellido}
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
      <TablaEstudiantes id_docente={id_docente}/>
      <div className='contenedorBotones'>
        <button className="botonTabla">Asignar Estudiante</button>
        <button className="botonTabla">Informes</button>
      </div>
    </div>
  );
}

export default Principal;
