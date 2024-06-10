import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Informe.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function FormatoInforme() {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState([]);
  const [firmado, setFirmado] = useState(false);
  const [estadoFirmado, setEstadoFirmado] = useState("No Firmado");
  const [nombreEstudiante, setNombreEstudiante] = useState('');
  const [idEstudiante, setIdEstudiante] = useState('');
  const [idTitulacion, setIdTitulacion] = useState('');
  const [carreraEstudiante, setCarreraEstudiante] = useState('');
  const [fechaAprobacion, setFechaAprobacion] = useState('');
  const [porcentajeAvance, setPorcentajeAvance] = useState('');
  const [fechaCreacionInforme, setFechaCreacionInforme] = useState('');
  const [avance_total, setAvanceTotal] = useState('');
  const [temaTitulacion, setTemaTitulacion] = useState('');
  const [value, setValue] = useState('');

  //obtiene la fecha actual en formato YYYY-MM-DD.
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const currentDate = getCurrentDate();
  
  // Navegación para cerrar sesión y manejo del botón de cancelar
  const handleNavigation = () => {
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  // Agrega una nueva actividad a la lista de actividades
  const agregarActividad = () => {
    for (let actividad of actividades) {
      if (!actividad.descripcion || !actividad.fecha) {
        Swal.fire({
          title: "Operación no permitida",
          text: "Todos los campos de las actividades deben estar llenos.",
          icon: "error",
          confirmButtonText: 'OK'
        });
        return;
      }
    }
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
    setFirmado((prevFirmado) => {
      const newFirmado = !prevFirmado;
      setEstadoFirmado(newFirmado ? "Firmado" : "No Firmado");
      return newFirmado;
    });
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

  // Metodo que verifica el numero de porcentaje de avance
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue) && (newValue === '' || (Number(newValue) >= 1 && Number(newValue) <= 100) /*&& (Number(newValue+avance_total)>100)*/)) {
      setValue(newValue);
      setPorcentajeAvance(newValue);
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
          setIdEstudiante(response.data.id || '');
          setIdTitulacion(response.data.titulacion.id||'');
          setNombreEstudiante(response.data.persona.nombre || '');
          setTemaTitulacion(response.data.titulacion.tema || '');
          setCarreraEstudiante(response.data.carrera || '');
          setFechaAprobacion(response.data.titulacion.fecha_aprobacion || '')
          setAvanceTotal(response.data.titulacion.avance_total ||  '')
        }
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };



  // Metodo guardar la información del informe
  const handleGuardar = async () => {
    // Validaciones
  if (!fechaCreacionInforme) {
    Swal.fire({
      title: "Operación no permitida",
      text: "Debe ingresar la fecha de creación del informe.",
      icon: "error",
      confirmButtonText: 'OK'
    });
    return;
  }

  if (actividades.length === 0) {
    Swal.fire({
      title: "Operación no permitida",
      text: "Debe ingresar al menos una actividad.",
      icon: "error",
      confirmButtonText: 'OK'
    });
    return;
  }

  for (let actividad of actividades) {
    if (!actividad.descripcion || !actividad.fecha) {
      Swal.fire({
        title: "Operación no permitida",
        text: "Todos los campos de las actividades deben estar llenos.",
        icon: "error",
        confirmButtonText: 'OK'
      });
      return;
    }
  }

  if (!porcentajeAvance) {
    Swal.fire({
      title: "Operación no permitida",
      text: "Debe ingresar el porcentaje de avance.",
      icon: "error",
      confirmButtonText: 'OK'
    });
    return;
  }

  if (Number(porcentajeAvance) + Number(avance_total) > 100) {
    Swal.fire({
      title: "Operación no permitida",
      text: "La suma del porcentaje de avance y el avance total no puede ser mayor a 100.",
      icon: "error",
      confirmButtonText: 'OK'
    });
    return;
  }
    if (porcentajeAvance === null) {
      Swal.fire({
        title: "Operación no permitida",
        text: "Ingrese un porcentaje de avance",
        icon: "error",
        confirmButtonText: 'OK'
      });
      return;
    }
    const informe = {
      anexo: '5' ,
      porcentaje_avance: Number(porcentajeAvance),
      fecha: fechaCreacionInforme, 
      id_titulacion: idTitulacion, 
      id_estudiante: idEstudiante,
      estado:estadoFirmado,
    };
    console.log(informe);
    try {
      const response = await axios.post('http://localhost:3000/informes', informe);
      const informeId = response.data.id;

      // Guardar actividades relacionadas
      for (let actividad of actividades) {
        await axios.post('http://localhost:3000/actividades', {
          descripcion: actividad.descripcion,
          fecha_actividad: actividad.fecha,
          informe: informeId // Se usa el ID del informe recién creado
        });
      }
      
      console.log('Informe y actividades guardados');
      handleCancelar();
    } catch (error) {
      console.error('Error al guardar el informe:', error);
    }
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
        <div className="row container mb-3">
          <div className="col-md-4">
            <label htmlFor="studentName" className="form-label">Nombre del Estudiante:</label>
            <input type="text" className="form-control" id="studentName" value={nombreEstudiante} readOnly />
          </div>
          <div className="col-md-4">
            <label htmlFor="studentName" className="form-label">Carrera del Estudiante:</label>
            <input type="text" className="form-control" id="studentName" value={carreraEstudiante} readOnly />
          </div>
          <div className="col-md-4">
            <label htmlFor="studentName" className="form-label">Fecha de Aprobacion</label>
            <input type="text" className="form-control" id="studentName" value={fechaAprobacion} readOnly />
          </div>
          </div>
          <div className="row container">
            <div className="col-md-4">
              <label htmlFor="thesisTopic" className="form-label">Tema:</label>
              <input type="text" className="form-control" id="thesisTopic" value={temaTitulacion} readOnly />
            </div>
            <div className="col-md-4">
              <label htmlFor="notificationDate" className="form-label">Fecha de Creación del Informe:</label>
              <input type="date" 
              className="form-control" 
              id="notificationDate" 
              value={fechaCreacionInforme} 
              max={currentDate}//No permite que ingrese una fecha futura
              onChange={(e) => setFechaCreacionInforme(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label htmlFor="number-input" className="form-label">Porcentaje de avance:</label>
              <input type="text" value={value} onChange={handleChange} className="form-control" id="number-input"  />
            </div>
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
            {estadoFirmado}
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
                    maxLength={100}
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
                    max={currentDate}
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
