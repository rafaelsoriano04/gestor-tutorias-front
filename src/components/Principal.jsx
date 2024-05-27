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

  let ListaEstudiantes = [
    { id: 1, nombre: 'Juan Pérez',estado:'En proceso', porcentaje: 70, carrera: 'Software' },
    { id: 2, nombre: 'Ana Sánchez',estado:'En proceso', porcentaje: 85, carrera: 'Industrial' },
    { id: 3, nombre: 'Carlos García',estado:'En proceso', porcentaje: 90, carrera: 'Telecomunicaciones' },
    { id: 4, nombre: 'María Rodríguez',estado:'Graduado', porcentaje: 100, carrera: 'Software' },
    { id: 5, nombre: 'Pedro Gómez',estado:'Graduado', porcentaje: 100, carrera: 'Software' },
    { id: 6, nombre: 'Laura Martínez',estado:'Graduado', porcentaje: 100, carrera: 'Industrial' },
    { id: 7, nombre: 'Luis Torres',estado:'Dado de baja', porcentaje: 10, carrera: 'Telecomunicaciones' }
  ];

  const llenarEstudiantes = () => {

    return ListaEstudiantes.map((estudiante) => (
        <option key={estudiante.id}>{estudiante.nombre}</option>

    ));
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

      <div className='contenedorFiltros'>
      <p></p>
      <label className="fw-bold">Estudiante:</label>
          <select
            className="filtro form-control bg-light border rounded"
            id="prioridad"
          >
            {llenarEstudiantes()}
          </select>
          <label className="fw-bold">Estado:</label>
          <select
            className="filtro form-control bg-light border rounded"
            id="prioridad"
          >
            <option>En proceso</option>
            <option>Graduado</option>
            <option>Dado de baja</option>
          </select>
          <label className="fw-bold">Carrera:</label>
          <select
            className="filtro form-control bg-light border rounded"
            id="prioridad"
          >
            <option>Software</option>
            <option>Industrial</option>
            <option>Telecomunicaciones</option>
            <option>Tecnologías de la Información</option>
            <option>Robótica</option>
          </select>
      </div>
      <div className='contenedorTabla'>
        <TablaEstudiantes />
      </div>
      <div className='contenedorBotones'>
        <button className="botonTabla">Asignar Estudiante</button>
        <button className="botonTabla">Informes</button>
      </div>
    </div>
  );
}

export default Principal;
