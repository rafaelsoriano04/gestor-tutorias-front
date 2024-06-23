import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./css/Informe.css";
import { jwtDecode } from "jwt-decode";
import TablaInformes from "./TablaInformes";
import axios from "axios";
import Navbar from "./Navbar";

const Informes = () => {
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
            <Navbar nombre={persona.nombre} apellido={persona.apellido} />
            <TablaInformes id_estudiante={idEstudiante} refresh={false} />
        </div>
    );
};

export default Informes;
