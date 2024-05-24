import "./css/Register.css";

import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import logoUsuario from "../assets/logoUsuario.png";

const Register = () => {
  const [jwtToken, setJwtToken] = useState("");
  const [usuario, setUsuario] = useState({
    nombre_usuario: "",
    contrasenia: "",
    cargo: "Docente",
    persona: {
      nombre: "",
      apellido: "",
      identificacion: "",
      telefono: "",
      email: "",
    },
  });

  const validarDatos = async () => {
    
    return await axios
      .post("http://localhost:3000/docente", usuario)
      .then((resp) => resp.data)
      .catch((error) => {
        if (error.response) {
            //control de validaciones
            if (error.response.status === 400) {
              // Puedes verificar mensajes específicos si tu API los envía de manera consistente
              if (error.response.data.message.includes("identificacion no es valido")) {
                alert("El número de identificación no es válido. Debe tener 10 caracteres.");
              } else if (error.response.data.message.includes("Datos faltantes")) {
                alert("Por favor completa todos los campos requeridos.");
              } else {
                alert(error.response.data.message);  // Mensaje general si no cumple las condiciones anteriores
              }
            } else {
              // Manejar otros códigos de estado aquí si es necesario
              alert("Error en el servidor, por favor intenta más tarde.");
            }}
      });
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
    const token = await validarDatos();
    //Alerta de que se creo un nuevo usuario
    
  };

  return (
    (
      <head>
        <meta charset="UTF-8" />
        <link
          rel="icon"
          type="image/x-icon"
          href="src/assets/ventanaIcon.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Registro Reportes</title>
      </head>
    ),
    (
      <div className="formulario">
        <img className="logo" src={logoUsuario} alt="LogoUsuario" />
        <p className="titulo">Crea un usuario</p>
        <p>Es rápido y fácil</p>
        <form action="#" onSubmit={handleSubmit}>
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
            type="text"
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
            type="text"
            className="contraseña"
            placeholder="Contraseña"
            name="contrasenia"
            value={usuario.contrasenia}
            onChange={handleChange}
          />
          <input
            type="text"
            className="contraseña"
            placeholder="Repita Contraseña"
            name="repitaContraseña"
          />
          <div className="botones">
            <input
              type="submit"
              value="Regístrate"
              className="botonRegistrate"
            />
            <input
              type="submit"
              value="Cancelar"
              className="botonRegistrate"
              href="#"
            />
          </div>
        </form>
      </div>
    )
  );
};

export default Register;
