import { useState } from "react";
import axios from "axios";
import "./css/Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logoUsuario from "../assets/logoUsuario.png";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [mensajeError, setMensajeError] = useState("");

    const validarDatos = async () => {
        if (!username || !password) {
            setMensajeError("Completa todos los campos...");
        } else {
            try {
                const response = await axios.post(
                    "http://localhost:3000/auth/login",
                    {
                        nombre_usuario: username,
                        contrasenia: password,
                    }
                );
                return response.data;
            } catch (error) {
                setMensajeError("Usuario o contraseña incorrectos...");
            }
        }
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = await validarDatos();

        if (token) {
            localStorage.setItem("jwtToken", token);
            navigate("/principal");
            setMensajeError("");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="login container-fluid d-flex flex-column justify-content-center align-items-center p-5 m-5"
            style={{ height: "100vh" }}
        >
            <img
                className="img-fluid mb-2"
                src={logoUsuario}
                alt="User Logo"
                style={{ maxHeight: "110px" }}
            />
            <p className="font-weight-bold fs-1 mb-1">Login</p>
            <div className="mt-2" style={{ width: "100%", maxWidth: "400px" }}>
                <label className="fs-5 pb-2">Nombre de usuario:</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Usuario"
                    value={username}
                    onChange={handleUsernameChange}
                    maxLength={35}
                />
            </div>
            <div className="mt-4" style={{ width: "100%", maxWidth: "400px" }}>
                <label className="fs-5 pb-2">Ingrese la contraseña:</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="Contraseña"
                    value={password}
                    onChange={handlePasswordChange}
                    maxLength={35}
                />
            </div>
            {mensajeError && (
                <p className="text-white mb-0 mt-2 fst-italic">
                    {mensajeError}
                </p>
            )}
            <button
                type="submit"
                className="btnInicio btn btn-light mt-3 btn-lg pe-4 ps-4"
            >
                Iniciar sesión
            </button>
        </form>
    );
};

export default Login;
