import "./css/Register.css";
import { useState } from "react";
import axios from "axios";
import logoUsuario from "../assets/logoUsuario.png";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const Register = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    nombre_usuario: "",
    contrasenia: "",
    repitaContrasenia: "",
    cargo: "Docente",
    persona: {
      nombre: "",
      apellido: "",
      identificacion: "",
      telefono: "099123456",
      email: "",
    },
  });
  const [mensajeError, setMensajeError] = useState('');

  const login = async (nombre_usuario, contrasenia) => {
    try {
      const { data: token } = await axios.post("http://localhost:3000/auth/login", {
        nombre_usuario,
        contrasenia,
      });
      localStorage.setItem("jwtToken", token);
      navigate("/principal");
      onLoginClick();
    } catch (error) {
      Swal.fire({
        html: '<i>Usuario creado, pero no se pudo iniciar la aplicación</i>',
        icon: 'error',
      });
      onLoginClick();
    }
  };

  const validarDatos = async () => {
    const { repitaContrasenia, ...usuarioDTO } = usuario;
  
    try {
      const { data } = await axios.post("http://localhost:3000/docente", usuarioDTO);
      login(data.nombre_usuario, usuario.contrasenia);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
  
        switch (status) {
          case 400:  // Bad Request
            setMensajeError('Completa todos los campos...');
            break;
          case 409:  // Conflict
            Swal.fire({
              title: 'Error',
              html: 'El usuario ya está en uso. Por favor, utiliza otro.',
              icon: 'error'
            });
            break;
          case 500:  // Internal Server Error
            Swal.fire({
              title: 'Error',
              html: '<i>Error interno del servidor. Inténtelo de nuevo más tarde.</i>',
              icon: 'error',
            });
            break;
          default:
            // Manejar otros códigos de estado no especificados
            Swal.fire({
              title: 'Error',
              html: `<i>${data.message || 'Error al conectar con el servidor.'}</i>`,
              icon: 'error',
            });
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        Swal.fire({
          title: 'Error',
          html: '<i>No se pudo obtener respuesta del servidor.</i>',
          icon: 'error',
        });
      } else {
        // Algo sucedió al configurar la solicitud que disparó un error
        Swal.fire({
          title: 'Error',
          html: '<i>Error al configurar la solicitud.</i>',
          icon: 'error',
        });
      }
      throw error;
    }
  };
  



  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in usuario.persona) {
      setUsuario((prevState) => ({
        ...prevState,
        persona: {
          ...prevState.persona,
          [name]: value,
        },
      }));
    } else {
      setUsuario((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validación de campos completos en la sección de persona
    for (let key in usuario.persona) {
      if (!usuario.persona[key]) {
        setMensajeError('Completa todos los campos...');
        return;
      }
    }
  
    // Validación de campos completos generales
    if (!usuario.nombre_usuario || !usuario.contrasenia || !usuario.cargo || !usuario.repitaContrasenia) {
      setMensajeError('Completa todos los campos...');
      return;
    }
  
    // Validación específica para el campo de identificación
    if (usuario.persona.identificacion.length !== 10) {
      setMensajeError('La identificación debe tener exactamente 10 dígitos.');
      return;
    }
  
    // Validación de longitud mínima de contraseña
    if (usuario.contrasenia.length < 8) {
      setMensajeError('La contraseña debe tener al menos 8 caracteres...');
      return;
    }
  
    // Validación de coincidencia de contraseñas
    if (usuario.contrasenia !== usuario.repitaContrasenia) {
      setMensajeError('Las contraseñas no coinciden...');
      return;
    }
  
    // Intenta enviar los datos si todas las validaciones son exitosas
    try {
      await validarDatos();
      setMensajeError('');
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="formulario">
      <img className="logo" src={logoUsuario} alt="LogoUsuario" />
      <p className="titulo">Crea un usuario</p>
      <p>Es rápido y fácil</p>
      <p>¿Ya tienes cuenta? <a className="text-white" onClick={onLoginClick}>Inicia sesión</a></p>
      <form onSubmit={handleSubmit}>
        <div className="cajaTexto">
          <input
            type="text"
            className="ingreso"
            placeholder="Nombre"
            name="nombre"
            value={usuario.persona.nombre}
            onChange={handleChange}
          />
          <input
            type="text"
            className="ingreso"
            placeholder="Apellido"
            name="apellido"
            value={usuario.persona.apellido}
            onChange={handleChange}
          />
        </div>
        <input
          type="email"
          className="email"
          placeholder="Correo Electronico"
          name="email"
          value={usuario.persona.email}
          onChange={handleChange}
        />
        <div className="cajaTexto">
          <input
            type="text"
            className="ingreso"
            placeholder="Usuario"
            name="nombre_usuario"
            value={usuario.nombre_usuario}
            onChange={handleChange}
          />
          <input
            type="text"
            className="ingreso"
            placeholder="Cédula"
            name="identificacion"
            value={usuario.persona.identificacion}
            onChange={handleChange}
          />
        </div>
        <input
          type="password"
          className="contraseña"
          placeholder="Contraseña"
          name="contrasenia"
          value={usuario.contrasenia}
          onChange={handleChange}
        />
        <input
          type="password"
          className="contraseña mb-3"
          placeholder="Repita Contraseña"
          name="repitaContrasenia"
          value={usuario.repitaContrasenia}
          onChange={handleChange}
        />
        {mensajeError && (
          <p className="text-white mb-0 mt-2 fst-italic">{mensajeError}</p>
        )}
        <button type="submit" className="btnInicio btn btn-secondary mt-4 btn-lg pe-4 ps-4">Crear cuenta</button>
      </form>
    </div>
  );
};

export default Register;
