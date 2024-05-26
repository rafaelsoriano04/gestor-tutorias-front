import "./css/Register.css";
import { useState } from "react";
import axios from "axios";
import logoUsuario from "../assets/logoUsuario.png";
import { useNavigate } from 'react-router-dom';

const Register = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    nombre_usuario: "",
    contrasenia: "",
    cargo: "Docente",
    persona: {
      nombre: "",
      apellido: "",
      identificacion: "",
      telefono: "099123456",
      email: "",
    },
  });

  const login = async (nombre_usuario, contrasenia) => {
    const token = await axios
      .post("http://localhost:3000/auth/login", {
        nombre_usuario,
        contrasenia,
      })
      .then((resp) => resp.data)
      .catch((error) => {
        console.log(error.response.data.message);
      });

    if (token) {
      localStorage.setItem("jwtToken", token); // Guarda el token en el localStorage con la clave 'jwtToken'
      navigate("/principal");
      onLoginClick()
    } else {
      alert("Login Fallido");
    }
  };

  const validarDatos = async () => {
    console.log(usuario);
    try {
      const { data } = await axios.post(
        "http://localhost:3000/docente",
        usuario
      );
      console.log(data.nombre_usuario, usuario.contrasenia);
      login(data.nombre_usuario, usuario.contrasenia)
      return data;
    } catch (error) {
      if (error.response) {
        // Control de validaciones
        if (error.response.status === 400) {
          alert(error.response.data.message); // Mensaje general si no cumple las condiciones anteriores
        } else {
          // Manejar otros códigos de estado aquí si es necesario
          alert("Error en el servidor, por favor intenta más tarde.");
        }
      }
      throw error;
    }
  };

  // Función para manejar el cambio en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in usuario.persona) {
      // Si el campo pertenece a la subestructura 'persona'
      setUsuario((prevState) => ({
        ...prevState,
        persona: {
          ...prevState.persona,
          [name]: value,
        },
      }));
    } else {
      // Para los campos en el nivel superior del objeto 'usuario'
      setUsuario((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificación de campos vacíos
    for (let key in usuario.persona) {
      if (!usuario.persona[key]) {
        alert("Todos los campos de la persona son obligatorios.");
        return;
      }
    }
    if (!usuario.nombre_usuario || !usuario.contrasenia || !usuario.cargo) {
      alert("Todos los campos del usuario son obligatorios.");
      return;
    }

    try {
      await validarDatos();
      alert("Usuario creado exitosamente");
      // Puedes redirigir al usuario o limpiar el formulario aquí si es necesario
    } catch (error) {
      // El manejo del error ya se hace en validarDatos
    }
  };

  return (
    <div className="formulario">
      <img className="logo" src={logoUsuario} alt="LogoUsuario" />
      <p className="titulo">Crea un usuario</p>
      <p>Es rápido y fácil</p>
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
          className="contraseña"
          placeholder="Repita Contraseña"
          name="repitaContraseña"
        />
        <div className="botones">
          <input type="submit" value="Regístrate" className="botonRegistrate" />
          <input
            type="button"
            value="Regresar"
            className="botonRegistrate"
            onClick={onLoginClick}
          />
        </div>
      </form>
    </div>
  );
};

export default Register;
