import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import TablaEstudiantes from './Estudiantes';
import './css/Principal.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap'; 
import Swal from "sweetalert2";

function Principal() {
  const [userName, setUserName] = useState('');
  const [id_docente, setId_docente] = useState('');
  const [persona, setPersona] = useState({});
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');
  const [refreshTable, setRefreshTable] = useState(false);


  const obtenerDocente = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/docente/${id}`);
      if (response.data) {
        setPersona(response.data.persona);
        setUserName(response.data.persona.nombre); // Asumiendo que la respuesta tiene este formato
      }
    } catch (error) {
      console.error('Error fetching docente:', error);
      setError(error);
      handleNavigation();
    }
  };

  useEffect(() => {
    let decoded;
    try {
      decoded = jwtDecode(token);
      if (decoded?.id) {
        setId_docente(decoded.id);
        obtenerDocente(decoded.id);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      handleNavigation();
    }
  }, [token]); // Dependencia sobre token

  const handleNavigation = () => {
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const studentData = {
      fecha_aprobacion: formData.get('fechaAprobacion'),
      carrera: formData.get('carrera'),
      tema: formData.get('tema'),
      estado: "Activo",
      porcentaje: 0,
      id_docente: id_docente,
      persona: {
        identificacion: formData.get('identificacion'),
        nombre: formData.get('nombre'),
        apellido: formData.get('apellido'),
        telefono: "00000",
        email: formData.get('correoElectronico')
      }
    };
    console.log(studentData);
    try {
      const response = await axios.post('http://localhost:3000/estudiante', studentData);
      console.log('Estudiante creado:', response.data);
      Swal.fire({
        html: '<i>Estudiante Asignado Correctamente</i>',
        icon: 'success',
      });
      handleCloseModal();
      setRefreshTable(prev => !prev);
    } catch (error) {
      /*
      CONTROLAR LOS ERRORES DE CEDULA DUPLICADA PARA QUE NO SE CAIGA EN EL BACK
      Y MUESTRE EL MENSAJE EN EL FRONT
      Swal.fire({
        html: '<i>Error al c</i>',
        icon: 'error',
      });
      setError('Error al crear estudiante.');*/

    }
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
      <TablaEstudiantes id_docente={id_docente} refresh={refreshTable} />
      <div className='contenedorBotones'>
        <button className="botonTabla" onClick={handleShowModal}>Asignar Estudiante</button>
        <button className="botonTabla">Informes</button>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Asignar Estudiante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Ingrese el nombre" name="nombre" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicApellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control type="text" placeholder="Ingrese el apellido" name="apellido" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicIdentificacion">
              <Form.Label>Identificación</Form.Label>
              <Form.Control type="text" placeholder="Ingrese la identificación" name="identificacion" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCarrera">
              <Form.Label>Carrera</Form.Label>
              <Form.Control as="select" defaultValue="Seleccione una opción" name="carrera">
                <option>Seleccione una opción</option>
                <option>Ingeniería en Software</option>
                <option>Ingeniería en Telecomunicaciones</option>
                <option>Ingeniería Industrial</option>
                <option>Ingeniería en Automatización y Robotica</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicTema">
              <Form.Label>Tema</Form.Label>
              <Form.Control type="text" placeholder="Ingrese el tema" name="tema" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicFechaAprobacion">
              <Form.Label>Fecha Aprobación</Form.Label>
              <Form.Control type="date" name="fechaAprobacion" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCorreoElectronico">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control type="email" placeholder="Ingrese el correo electrónico" name="correoElectronico" required />
            </Form.Group>
            <Button variant="danger" type="submit">
              Asignar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Principal;
