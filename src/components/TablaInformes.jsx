import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/TablaInformes.css";
import Swal from "sweetalert2";

// eslint-disable-next-line react/prop-types
const TablaInformes = ({ id_estudiante, refresh }) => {
    const [informes, setInformes] = useState([]);
    const [itemsPorPagina, setItemsPorPagina] = useState(10);
    const [paginaActual, setPaginaActual] = useState(1);
    const [selectedRow, setSelectedRow] = useState(null);
    const [estudiante, setEstudiante] = useState(null);
    const navigate = useNavigate();
    const [contextMenuPosition, setContextMenuPosition] = useState({
        top: 0,
        left: 0,
    });
    const [showContextMenu, setShowContextMenu] = useState(false);

    useEffect(() => {
        getDatosEstudiante();
        getInformes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh, id_estudiante, paginaActual, itemsPorPagina]);

    const getInformes = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/informes/estudiante/${id_estudiante}`
            );
            setInformes(response.data);
        } catch (error) {
            console.error("Error fetching informes:", error);
        }
    };
    const handleShowInforme = (id) => {
        console.log(id);
        navigate(`/informes/${id}`);
    };

    const redirigirInforme = () => {
        if (estudiante.titulacion.avance_total == 100) {
            Swal.fire({
                title: "Error",
                text: "Su porcentaje ya esta completo, no se puede agregar mas informes",
                icon: "error",
            });
            return;
        } else {
            let id = estudiante.titulacion.id;
            if (estudiante === undefined) {
                navigate(`/`);
            } else {
                navigate(`/nuevo-informe/${id}`);
            }
        }
    };

    const getDatosEstudiante = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/estudiante/info/${id_estudiante}`
            );
            setEstudiante(response.data);
        } catch (error) {
            console.error("Error fetching informes:", error);
        }
    };

    const mostrarInformes = () => {
        const lastIndex = paginaActual * itemsPorPagina;
        const firstIndex = lastIndex - itemsPorPagina;
        return informes.slice(firstIndex, lastIndex).map((informe, index) => (
            <tr
                key={informe.id}
                className={informe.id === selectedRow ? "table-active" : ""}
                onClick={(e) => handleRowClick(e, informe.id)}
                onDoubleClick={() => handleShowInforme(informe.id)}
                style={{ cursor: "pointer" }}
            >
                <th scope="row">{firstIndex + index + 1}</th>
                <td>{informe.anexo}</td>
                <td>{informe.fecha}</td>
                <td className="align-middle">
                    <div className="progress">
                        <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: `${informe.porcentaje_avance}%` }}
                            aria-valuenow={informe.porcentaje_avance}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            {informe.porcentaje_avance}%
                        </div>
                    </div>
                </td>
                <td>{informe.estado}</td>
            </tr>
        ));
    };

    const paginate = (pageNumber) => setPaginaActual(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(informes.length / itemsPorPagina); i++) {
        pageNumbers.push(i);
    }

    const handleRowClick = (e, id) => {
        e.stopPropagation();
        setSelectedRow(id);
        setContextMenuPosition({ top: e.pageY, left: e.pageX });
        setShowContextMenu(true);
    };

    const handleDocumentClick = (e) => {
        if (!e.target.closest(".context-menu")) {
            setShowContextMenu(false);
            setSelectedRow(null);
        }
    };
    useEffect(() => {
        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    const eliminarInforme = async () => {
        const url = `http://localhost:3000/informes/${selectedRow}`;
        console.log(url);
        try {
            const informe = informes.find(
                (informe) => informe.id === selectedRow
            );

            if (informe.estado === "Firmado") {
                Swal.fire({
                    title: "Operación no permitida",
                    text: "No se puede eliminar un informe que ha sido firmado.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                return;
            }
            const confirmacion = await Swal.fire({
                title: "¿Está seguro?",
                text: "Esta acción eliminará el informe y sus actividades asociadas. ¿Desea continuar?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (confirmacion.isConfirmed) {
                await axios.delete(url);
                getInformes();
                Swal.fire({
                    title: "Eliminado",
                    text: "El Informe se ha sido eliminada correctamente",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo eliminar, intentelo de nuevo mas tarde",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const updateEstudiante = async () => {
        const request = {
            carrera: estudiante.carrera,
            nombre: estudiante.persona.nombre,
            apellido: estudiante.persona.apellido,
            tema: estudiante.titulacion.tema,
            fecha_aprobacion: estudiante.titulacion.fecha_aprobacion,
        };
        const estu = localStorage.getItem("idPersona");
        try {
            const response = await axios.put(
                `http://localhost:3000/estudiante/${estu}`,
                request
            );
            setEstudiante(response.data);
            Swal.fire({
                text: "Datos del Estudiante Actualizados",
                icon: "success",
            });
        } catch (error) {
            console.error("Error fetching informes:", error);
        }
    };

    const handleDateChange = (e) => {
        const dateValue = e.target.value;
        setEstudiante((prevEstudiante) => ({
            ...prevEstudiante,
            titulacion: {
                ...prevEstudiante.titulacion,
                fecha_aprobacion: dateValue,
            },
        }));
    };

    const handleBack = () => {
        navigate("/principal");
    };

    return (
        <div className="container mt-3">
            <div className="row justify-content-center">
                <div className="col-12 table-responsive">
                    <h2 className="text-center mb-1">Estudiante</h2>
                    <div className="mb-2">
                        <button
                            type="button"
                            className="btn btn-primary btn-floating"
                            onClick={handleBack}
                        >
                            <i className="fa fa-arrow-left fa-2"></i>
                        </button>
                    </div>
                    <div>
                        {estudiante && (
                            <div className="card mb-4">
                                <div className="card-header">
                                    Datos del Estudiante
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Carrera
                                            </label>
                                            <select
                                                className="form-select"
                                                value={estudiante.carrera}
                                                onChange={(e) =>
                                                    setEstudiante({
                                                        ...estudiante,
                                                        carrera: e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="Ingeniería en Software">
                                                    Ingeniería en Software
                                                </option>
                                                <option value="Ingeniería en Telecomunicaciones">
                                                    Ingeniería en
                                                    Telecomunicaciones
                                                </option>
                                                <option value="Ingeniería Industrial">
                                                    Ingeniería Industrial
                                                </option>
                                                <option value="Ingeniería en Automatización y Robótica">
                                                    Ingeniería en Automatización
                                                    y Robótica
                                                </option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Tema de Titulación
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                maxLength="150"
                                                value={
                                                    estudiante.titulacion.tema
                                                }
                                                onChange={(e) =>
                                                    setEstudiante({
                                                        ...estudiante,
                                                        titulacion: {
                                                            ...estudiante.titulacion,
                                                            tema: e.target
                                                                .value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                maxLength="30"
                                                value={
                                                    estudiante.persona.nombre
                                                }
                                                onChange={(e) =>
                                                    setEstudiante({
                                                        ...estudiante,
                                                        persona: {
                                                            ...estudiante.persona,
                                                            nombre: e.target
                                                                .value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">
                                                Apellido
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                maxLength="30"
                                                value={
                                                    estudiante.persona.apellido
                                                }
                                                onChange={(e) =>
                                                    setEstudiante({
                                                        ...estudiante,
                                                        persona: {
                                                            ...estudiante.persona,
                                                            apellido:
                                                                e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label
                                                htmlFor="studentName"
                                                className="form-label"
                                            >
                                                Fecha de Aprobacion
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="studentName"
                                                value={
                                                    estudiante.titulacion
                                                        .fecha_aprobacion
                                                }
                                                onChange={handleDateChange}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">
                                                Progreso Total (%)
                                            </label>
                                            <div className="progress">
                                                <div
                                                    className="progress-bar bg-primary progress-bar-animated progress-bar-striped"
                                                    role="progressbar"
                                                    style={{
                                                        width: `${estudiante.titulacion.avance_total}%`,
                                                    }}
                                                    aria-valuenow={
                                                        estudiante.titulacion
                                                            .avance_total
                                                    }
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                >
                                                    {
                                                        estudiante.titulacion
                                                            .avance_total
                                                    }
                                                    %
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <button
                                            className="btn btn-primary btn-custom  mb-1 "
                                            onClick={updateEstudiante}
                                        >
                                            Actualizar Informacion
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <h2 className="text-center mb-1">Informes</h2>
                    <button
                        className="btn btn-primary mb-3"
                        onClick={redirigirInforme}
                    >
                        Agregar Informe
                    </button>
                    <table className="table table-hover table-bordered">
                        <thead className="table-primary">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Anexo</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Porcentaje de avance</th>
                                <th scope="col">Estado</th>
                            </tr>
                        </thead>
                        <tbody>{mostrarInformes()}</tbody>
                    </table>
                    <div
                        className="context-menu"
                        style={{
                            display: showContextMenu ? "block" : "none",
                            position: "absolute",
                            top: `${contextMenuPosition.top}px`,
                            left: `${contextMenuPosition.left}px`,
                        }}
                    >
                        <button
                            className="btn btn-primary btn-custom  mb-3 "
                            onClick={() => eliminarInforme(selectedRow)}
                        >
                            Eliminar Informe
                        </button>
                    </div>
                    <nav className="d-flex justify-content-between align-items-center mb-5">
                        <ul className="pagination mb-0">
                            {pageNumbers.map((number) => (
                                <li key={number} className="page-item">
                                    <button
                                        onClick={() => paginate(number)}
                                        className="page-link"
                                    >
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div>
                            <select
                                onChange={(e) =>
                                    setItemsPorPagina(
                                        parseInt(e.target.value, 10)
                                    )
                                }
                                value={itemsPorPagina}
                                className="form-select"
                            >
                                <option value={5}>5 por página</option>
                                <option value={10}>10 por página</option>
                                <option value={20}>20 por página</option>
                                <option value={50}>50 por página</option>
                            </select>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default TablaInformes;
