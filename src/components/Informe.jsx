import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./css/Informe.css";
import { jwtDecode } from "jwt-decode";
import TablaInformes from "./TablaInformes";
import { Dropdown } from "react-bootstrap";
import axios from "axios";

function Informe() {
    const navigate = useNavigate();
    const { idEstudiante } = useParams();
    const [persona, setPersona] = useState({});
    const token = localStorage.getItem("jwtToken");

    const handleNavigation = () => {
        localStorage.removeItem("jwtToken");
        navigate("/");
    };

    const obtenerDocente = async (id) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/docente/${id}`
            );
            if (response.data) {
                setPersona(response.data.persona);
            }
        } catch (error) {
            console.error("Error fetching docente:", error);
            handleNavigation();
        }
    };

    useEffect(() => {
        let decoded;
        try {
            decoded = jwtDecode(token);
            if (decoded?.id) {
                obtenerDocente(decoded.id);
            }
        } catch (error) {
            //
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]); // Dependencia sobre token

    return (
        <div>
            <nav className="navbar bg-custom">
                <div className="container-fluid d-flex justify-content-between">
                    <span className="navbar-text text-white">
                        Universidad Técnica de Ambato
                    </span>
                    <div
                        className="d-flex align-items-center text-custom logout"
                        style={{ cursor: "pointer" }}
                    >
                        <span className="logout-text ms-2 pe-3">
                            {persona.nombre} {persona.apellido}
                        </span>

                        <Dropdown>
                            <Dropdown.Toggle
                                variant="primary"
                                id="dropdown-basic"
                            >
                                <i className="fa fa-user fa-2"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleNavigation}>
                                    Cerrar Sesión
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </nav>
            <TablaInformes id_estudiante={idEstudiante} refresh={false} />
        </div>
    );
}

export default Informe;
