import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/Informe.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";

const NuevoInforme = () => {
    const navigate = useNavigate();
    const [actividades, setActividades] = useState([]);
    const [firmado, setFirmado] = useState(false);
    const [estadoFirmado, setEstadoFirmado] = useState("No Firmado");
    const [nombreEstudiante, setNombreEstudiante] = useState("");
    const [idEstudiante, setIdEstudiante] = useState("");
    const [idTitulacion, setIdTitulacion] = useState("");
    const [carreraEstudiante, setCarreraEstudiante] = useState("");
    const [fechaAprobacion, setFechaAprobacion] = useState("");
    const [porcentajeAvance, setPorcentajeAvance] = useState("");
    const [fechaCreacionInforme, setFechaCreacionInforme] = useState("");
    const [avance_total, setAvanceTotal] = useState(0);
    const [temaTitulacion, setTemaTitulacion] = useState("");
    const [value, setValue] = useState("");
    const token = localStorage.getItem("jwtToken");
    const [persona, setPersona] = useState({});

    //obtiene la fecha actual en formato YYYY-MM-DD.
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const day = today.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const currentDate = getCurrentDate();

    const eliminarActividad = (index) => {
        const nuevasActividades = actividades.filter((_, i) => i !== index);
        setActividades(nuevasActividades);
    };

    // Navegación para cerrar sesión y manejo del botón de cancelar
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

    // Agrega una nueva actividad a la lista de actividades
    const agregarActividad = () => {
        for (let actividad of actividades) {
            if (!actividad.descripcion || !actividad.fecha_actividad) {
                Swal.fire({
                    title: "Operación no permitida",
                    text: "Todos los campos de las actividades deben estar llenos.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                return;
            }
        }
        setActividades([
            ...actividades,
            { descripcion: "", fecha_actividad: "" },
        ]);
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
        newActividades[index].fecha_actividad = event.target.value;
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

    const handleRegresar = async () => {
        if (actividades.length != 0) {
            const confirmacion = await Swal.fire({
                title: "¿Está seguro?",
                text: "¿Quiere salir sin guardar el informe?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sí quiero salir",
                cancelButtonText: "Cancelar",
            });
            if (confirmacion.isConfirmed) {
                const estu = localStorage.getItem("idPersona");
                if (estu == undefined) {
                    navigate("/");
                } else {
                    navigate(`/informes/${estu}`);
                }
            }
        } else {
            const estu = localStorage.getItem("idPersona");
            if (estu == undefined) {
                navigate("/");
            } else {
                navigate(`/informes/${estu}`);
            }
        }
    };

    // Maneja la acción de cancelar y regresa a la página anterior o al inicio
    const handleCancelar = () => {
        const estu = localStorage.getItem("idPersona");
        if (estu == undefined) {
            navigate("/");
        } else {
            navigate(`/informes/${estu}`);
        }
    };

    // Metodo que verifica el numero de porcentaje de avance
    const handleChange = (e) => {
        const newValue = e.target.value;
        if (
            /^\d*$/.test(newValue) &&
            (newValue === "" ||
                (Number(newValue) >= 1 &&
                    Number(newValue) <=
                        100)) /*&& (Number(newValue+avance_total)>100)*/
        ) {
            setValue(newValue);
            setPorcentajeAvance(newValue);
        }
    };

    // Función para cargar datos del estudiante
    useEffect(() => {
        getDatosEstudiante();
    }, []);

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

    const getDatosEstudiante = async () => {
        try {
            const estudiante = localStorage.getItem("idPersona");
            if (estudiante) {
                const response = await axios.get(
                    `http://localhost:3000/estudiante/info/${estudiante}`
                );
                if (response.data) {
                    setIdEstudiante(response.data.id || "");
                    setIdTitulacion(response.data.titulacion.id || "");
                    setNombreEstudiante(
                        response.data.persona.nombre +
                            " " +
                            response.data.persona.apellido
                    );
                    setTemaTitulacion(response.data.titulacion.tema || "");
                    setCarreraEstudiante(response.data.carrera || "");
                    setFechaAprobacion(
                        response.data.titulacion.fecha_aprobacion || ""
                    );
                    setAvanceTotal(response.data.titulacion.avance_total);
                }
            }
        } catch (error) {
            console.error("Error fetching student data:", error);
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
                confirmButtonText: "OK",
            });
            return;
        }

        if (actividades.length === 0) {
            Swal.fire({
                title: "Operación no permitida",
                text: "Debe ingresar al menos una actividad.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        for (let actividad of actividades) {
            if (!actividad.descripcion || !actividad.fecha_actividad) {
                Swal.fire({
                    title: "Operación no permitida",
                    text: "Todos los campos de las actividades deben estar llenos.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                return;
            }
        }

        if (!porcentajeAvance) {
            Swal.fire({
                title: "Operación no permitida",
                text: "Debe ingresar el porcentaje de avance.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        if (porcentajeAvance === null) {
            Swal.fire({
                title: "Operación no permitida",
                text: "Ingrese un porcentaje de avance",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }
        const informe = {
            anexo: "5",
            porcentaje_avance: Number(porcentajeAvance),
            fecha: fechaCreacionInforme,
            id_titulacion: idTitulacion,
            id_estudiante: idEstudiante,
            estado: estadoFirmado,
            actividades,
        };

        try {
            await axios.post("http://localhost:3000/informes", informe);
            Swal.fire({
                toast: true,
                position: "top-end",
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                },
                icon: "success",
                title: "Informe guardado",
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
            });
            handleCancelar();
        } catch (error) {
            if (error.response) {
                if (error.response.data.message == "Porcenteje no valido")
                    Swal.fire({
                        title: "Oops...",
                        text: "El porcentaje de avance no puede ser menor al último informe",
                        icon: "error",
                    });
                return;
            }

            console.error("Error al guardar el informe:", error);
        }
    };

    return (
        <div>
            <Navbar nombre={persona.nombre} apellido={persona.apellido} />

            <div className="container mt-4 mb-4">
                <div className="row mb-4">
                    <div className="col d-flex justify-content-start align-items-center">
                        <button
                            type="button"
                            className="btn btn-primary btn-floating"
                            onClick={handleRegresar}
                        >
                            <i className="fa fa-arrow-left fa-2"></i>
                        </button>
                    </div>
                    <div className="col d-flex justify-content-center align-items-center">
                        <h1>Nuevo Informe</h1>
                    </div>
                    <div className="col"></div>
                </div>

                <div className="row container mb-3">
                    <div className="col-4">
                        <label htmlFor="studentName" className="form-label">
                            Carrera del Estudiante:
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="studentName"
                            value={carreraEstudiante}
                            disabled
                        />
                    </div>
                    <div className="col-8">
                        <label htmlFor="thesisTopic" className="form-label">
                            Tema:
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="thesisTopic"
                            value={temaTitulacion}
                            disabled
                        />
                    </div>
                </div>
                <div className="row mb-3 d-flex justify-content-center">
                    <div className="col-3">
                        <label htmlFor="studentName" className="form-label">
                            Estudiante:
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="studentName"
                            value={nombreEstudiante}
                            disabled
                        />
                    </div>
                    <div className="col-2">
                        <label htmlFor="studentName" className="form-label">
                            Fecha de Aprobación:
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="studentName"
                            value={fechaAprobacion}
                            disabled
                        />
                    </div>
                    <div className="col-2">
                        <label htmlFor="number-input" className="form-label">
                            Porcentaje Titulación:
                        </label>
                        <div className="input-group">
                            <input
                                type="text"
                                value={avance_total}
                                onChange={handleChange}
                                className="form-control"
                                id="number-input"
                                disabled
                            />
                            <span className="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                <div className="row d-flex justify-content-center">
                    <div className="col-2">
                        <label
                            htmlFor="notificationDate"
                            className="form-label"
                        >
                            Fecha del Informe:
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="notificationDate"
                            value={fechaCreacionInforme}
                            min={fechaAprobacion}
                            max={currentDate} //No permite que ingrese una fecha futura
                            onChange={(e) =>
                                setFechaCreacionInforme(e.target.value)
                            }
                        />
                    </div>
                    <div className="col-md-2">
                        <label
                            htmlFor="porcentaje-avance-input"
                            className="form-label"
                        >
                            Porcentaje de avance:
                        </label>
                        <div className="input-group">
                            <input
                                type="text"
                                value={value}
                                onChange={handleChange}
                                className="form-control"
                                id="porcentaje-avance-input"
                            />
                            <span className="input-group-text">%</span>
                        </div>
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
                <table className="table table-hover table-bordered">
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Fecha</th>
                            <th>Eliminar</th>
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
                                        onChange={(e) =>
                                            handleDescripcionChange(index, e)
                                        }
                                        className="form-control"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={actividad.fecha_actividad}
                                        onChange={(e) =>
                                            handleFechaChange(index, e)
                                        }
                                        className="form-control"
                                        max={fechaCreacionInforme}
                                    />
                                </td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-danger btn-circle"
                                        onClick={() => eliminarActividad(index)}
                                    >
                                        &times;
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="d-flex justify-content-end">
                    <button
                        className="btn btn-primary"
                        onClick={agregarActividad}
                    >
                        Agregar Actividad
                    </button>
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <button className="btn btn-primary" onClick={handleGuardar}>
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NuevoInforme;
