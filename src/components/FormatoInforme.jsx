import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Informe.css';
import "bootstrap/dist/css/bootstrap.min.css";

function FormatoInforme() {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState([]);
  const [firmado, setFirmado] = useState(false);
  const [nombreEstudiante, setNombreEstudiante] = useState('');
  const [temaTitulacion, setTemaTitulacion] = useState('');

  // Navegación para cerrar sesión y manejo del botón de cancelar
  const handleNavigation = () => {
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  // Agrega una nueva actividad a la lista de actividades
  const agregarActividad = () => {
    setActividades([...actividades, { descripcion: '', fecha: '' }]);
  };

  // Actualiza la descripción de una actividad específica
  const handleDescripcionChange = (index, event) => {
    const newActividades = [...actividades];
    newActividades[index].descripcion = event.target.value;
    setActividades(newActividades);
  };

  // Actualiza la fecha de una actividad específica
  const handleFechaChange = (index, event) => {
    const newActividades = [...actividades];
    newActividades[index].fecha = event.target.value;
    setActividades(newActividades);
  };

  // Cambia el estado de firmado/no firmado
  const toggleFirmado = () => {
    setFirmado(!firmado);
  };

  // Maneja la acción de cancelar y regresa a la página anterior o al inicio
  const handleCancelar = () => {
    const estu = localStorage.getItem('idPersona');
    if (estu == undefined) {
      navigate('/');
    } else {
      navigate(`/informes/${estu}`);
    }
  };

  // Función para cargar datos del estudiante
  useEffect(() => {
    getDatosEstudiante();
  }, []);

  const getDatosEstudiante = async () => {
    try {
      const estu = localStorage.getItem('idPersona');
      console.log(estu)
      if (estu) {
        const response = await axios.get(`http://localhost:3000/estudiante/info/${estu}`);
        if (response.data) {
          setNombreEstudiante(response.data.persona.nombre || '');
          setTemaTitulacion(response.data.titulacion.tema || '');
        }
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  // Simula guardar la información
  const handleGuardar = () => {
    console.log('Información guardada');
  };

  return (
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
            <span className="logout-text ms-2 pe-3">Cerrar Sesión</span>
            <i className="fas fa-user mr-2"></i>
          </div>
        </div>
      </nav>
      

      <div className="container mt-4">
        <h1 className="text-center mb-4">Nuevo Informe</h1>
        <div className="mb-3">
          <label htmlFor="studentName" className="form-label">Nombre del Estudiante:</label>
          <input type="text" className="form-control" id="studentName" value={nombreEstudiante} readOnly />
        </div>
        <div className="mb-3">
          <label htmlFor="thesisTopic" className="form-label">Tema:</label>
          <input type="text" className="form-control" id="thesisTopic" value={temaTitulacion} readOnly />
        </div>
        <div className="mb-3">
          <label htmlFor="notificationDate" className="form-label">Fecha de Creación del Informe:</label>
          <input type="date" className="form-control" id="notificationDate" />
        </div>

        <div className="form-check form-switch mt-3 py-3 ">
          <input
            className="form-check-input"
            type="checkbox"
            id="firmadoToggle"
            checked={firmado}
            onChange={toggleFirmado}
          />
          <label className="form-check-label" htmlFor="firmadoToggle">
            {firmado ? 'Firmado' : 'No Firmado'}
          </label>
        </div>

        <h3>Actividades</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((actividad, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={actividad.descripcion}
                    onChange={(e) => handleDescripcionChange(index, e)}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={actividad.fecha}
                    onChange={(e) => handleFechaChange(index, e)}
                    className="form-control"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={agregarActividad}>Agregar Actividad</button>

        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary me-2" onClick={handleCancelar}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleGuardar}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default FormatoInforme;
