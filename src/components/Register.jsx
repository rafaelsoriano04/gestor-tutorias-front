import "./css/Register.css";
import { useState } from "react";
import axios from "axios";
import logoUsuario from "../assets/logoUsuario.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// eslint-disable-next-line react/prop-types
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
    const [mensajeError, setMensajeError] = useState("");

    const login = async (nombre_usuario, contrasenia) => {
        try {
            const { data: token } = await axios.post(
                "http://localhost:3000/auth/login",
                {
                    nombre_usuario,
                    contrasenia,
                }
            );
            localStorage.setItem("jwtToken", token);
            navigate("/principal");
            onLoginClick();
        } catch (error) {
            Swal.fire({
                html: "<i>Usuario creado, pero no se pudo iniciar la aplicación</i>",
                icon: "error",
            });
            onLoginClick();
        }
    };

    const validarDatos = async () => {
        // eslint-disable-next-line no-unused-vars
        const { repitaContrasenia, ...usuarioDTO } = usuario;
        try {
            const { data } = await axios.post(
                "http://localhost:3000/docente",
                usuarioDTO
            );
            login(data.nombre_usuario, usuario.contrasenia);
            return true;
        } catch ({ response }) {
            if (
                response.data.message ===
                "El nombre de usuario ya está en uso. Por favor, utiliza otro."
            )
                setMensajeError("El nombre de usuario ya está en uso.");
            if (response.data.message === "La cédula ya está en uso.")
                setMensajeError(response.data.message);
            return false;
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
                setMensajeError("Completa todos los campos...");
                return;
            }
        }

        // Validación de campos completos generales
        if (
            !usuario.nombre_usuario ||
            !usuario.contrasenia ||
            !usuario.cargo ||
            !usuario.repitaContrasenia
        ) {
            setMensajeError("Completa todos los campos...");
            return;
        }

        // Validación específica para el campo de identificación
        if (usuario.persona.identificacion.length !== 10) {
            setMensajeError(
                "La identificación debe tener exactamente 10 dígitos."
            );
            return;
        }

        // Validación de longitud mínima de contraseña
        if (usuario.contrasenia.length < 8) {
            setMensajeError(
                "La contraseña debe tener al menos 8 caracteres..."
            );
            return;
        }

        // Validación de coincidencia de contraseñas
        if (usuario.contrasenia !== usuario.repitaContrasenia) {
            setMensajeError("Las contraseñas no coinciden...");
            return;
        }

        // Intenta enviar los datos si todas las validaciones son exitosas
        if (await validarDatos()) {
            Swal.fire({
                html: `<i>Usuario creado, bienvenid@ ${usuario.nombre_usuario}</i>`,
                icon: "success",
            });
        }
    };

    return (
        <div className="formulario">
            <img className="logo" src={logoUsuario} alt="LogoUsuario" />
            <p className="titulo">Crea un usuario</p>
            <p>Es rápido y fácil</p>
            <p>
                ¿Ya tienes cuenta?{" "}
                <a className="text-white" onClick={onLoginClick}>
                    Inicia sesión
                </a>
            </p>
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
                    <p className="text-white mb-0 mt-2 fst-italic">
                        {mensajeError}
                    </p>
                )}
                <button
                    type="submit"
                    className="btnInicio btn btn-secondary mt-4 btn-lg pe-4 ps-4"
                >
                    Crear cuenta
                </button>
            </form>
        </div>
    );
};

export default Register;
