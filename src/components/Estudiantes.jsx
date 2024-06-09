import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const TablaEstudiantes = ({ id_docente, refresh,onStudentSelect }) => {
    const token = localStorage.getItem("jwtToken");

    const [estudiantes, setEstudiantes] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [itemsPorPagina, setItemsPorPagina] = useState(10);
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroCarrera, setFiltroCarrera] = useState("");
    const [filtroNombreCedula, setFiltroNombreCedula] = useState("");
    const navigate = useNavigate();
    let decoded;

    useEffect(() => {
        getEstudiantes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    const getEstudiantes = async () => {
        try {
            decoded = jwtDecode(token);
        } catch (error) {
            console.error("Error decoding token:", error);
            // handleNavigation();
        }
        id_docente = decoded.id;
        
        try {
            const resp = await axios.get(
                `http://localhost:3000/estudiante/${id_docente}`
            );
            setEstudiantes(resp.data);
            console.log(estudiantes);
        } catch (error) {
            console.log(error);
        }
    };

    const paginate = (pageNumber) => setPaginaActual(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(estudiantes.length / itemsPorPagina); i++) {
        pageNumbers.push(i);
    }
    

    const handleRowClick = (id) => {
        setSelectedRow(id);
        onStudentSelect(id);
    };
    const handleShowInforme = (id) => {
        localStorage.setItem('idPersona', id);
          navigate(`/informes/${id}`);
        
      };

    const handleSearch = (e) => {
        setFiltroNombreCedula(e.target.value);
    };

    const cargarEstudiantes = () => {
        const estudiantesFiltrados = estudiantes.filter((estudiante) => {
            const nombreCompleto = `${estudiante.persona.nombre} ${estudiante.persona.apellido}`;
            return (
                (filtroEstado === "" || estudiante.estado === filtroEstado) &&
                (filtroCarrera === "" ||
                    estudiante.carrera === filtroCarrera) &&
                (filtroNombreCedula === "" ||
                    estudiante.persona.identificacion.startsWith(
                        filtroNombreCedula
                    ) ||
                    nombreCompleto
                        .toLowerCase()
                        .includes(filtroNombreCedula.toLowerCase()))
            );
        });

        const ultimoItem = paginaActual * itemsPorPagina;
        const primerItem = ultimoItem - itemsPorPagina;

        return estudiantesFiltrados
            .slice(primerItem, ultimoItem)
            .map((estudiante, index) => (
                <tr
                    key={estudiante.id}
                    className={
                        estudiante.id === selectedRow ? "table-active" : ""
                    }
                    onClick={() => handleRowClick(estudiante.id)}
                    onDoubleClick={() => handleShowInforme(estudiante.id)}
                    style={{ cursor: "pointer" }}
                >
                    <th scope="row">{primerItem + index + 1}</th>
                    <td>{estudiante.persona.identificacion}</td>
                    <td>
                        {estudiante.persona.nombre +
                            " " +
                            estudiante.persona.apellido}
                    </td>
                    <td>{estudiante.estado}</td>
                    <td className="align-middle">
                        <div className="progress">
                            <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{
                                    width: `${estudiante.titulacion.avance_total}%`,
                                }}
                                aria-valuenow={
                                    estudiante.titulacion.avance_total
                                }
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                            {estudiante.titulacion.avance_total}%
                        </div>
                    </td>
                    <td>{estudiante.carrera}</td>
                </tr>
            ));
    };

    return (
        <div className="container mt-4">
            <p className="fs-3 fw-bold text-center">Estudiantes</p>
            <div className="row mb-3 justify-content-center">
                <div className="col-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre o cédula"
                        value={filtroNombreCedula}
                        onChange={handleSearch}
                    />
                </div>
                <div className="col-auto d-flex align-items-center">
                    <label className="me-2">Estado:</label>
                    <select
                        className="form-select"
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Graduado">Graduado</option>
                        <option value="De baja">De baja</option>
                    </select>
                </div>

                <div className="col-auto d-flex align-items-center">
                    <label className="me-2">Carrera:</label>
                    <select
                        className="form-select"
                        value={filtroCarrera}
                        onChange={(e) => setFiltroCarrera(e.target.value)}
                    >
                        <option value="">Todas</option>
                        <option value="Ingeniería en Software">
                            Ingeniería en Software
                        </option>
                        <option value="Ingeniería en Telecomunicaciones">
                            Ingeniería en Telecomunicaciones
                        </option>
                        <option value="Ingeniería Industrial">
                            Ingeniería Industrial
                        </option>
                        <option value="Ingeniería en Automatización y Robótica">
                            Ingeniería en Automatización y Robótica
                        </option>
                    </select>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-12 table-responsive">
                    <table className="table table-hover table-bordered table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Cédula</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Porcentaje</th>
                                <th scope="col">Carrera</th>
                            </tr>
                        </thead>
                        <tbody>{cargarEstudiantes()}</tbody>
                    </table>
                    <nav className="d-flex justify-content-between align-items-center">
                        <ul className="pagination mb-0">
                            {pageNumbers.map((number) => (
                                <li key={number} className="page-item">
                                    <a
                                        onClick={() => paginate(number)}
                                        href="#"
                                        className="page-link"
                                    >
                                        {number}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div>
                            <select
                                onChange={(e) =>
                                    setItemsPorPagina(parseInt(e.target.value))
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

export default TablaEstudiantes;
