import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/TablaInformes.css';
import Swal from "sweetalert2";

const TablaInformes = ({ id_estudiante, refresh }) => {
    const [informes, setInformes] = useState([]);
    const [itemsPorPagina, setItemsPorPagina] = useState(10);
    const [paginaActual, setPaginaActual] = useState(1);
    const [selectedRow, setSelectedRow] = useState(null);
    const [estudiante, setEstudiante] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getDatosEstudiante();
        getInformes();
    }, [refresh, id_estudiante, paginaActual, itemsPorPagina]);

    const getInformes = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/informes/estudiante/${id_estudiante}`);
            setInformes(response.data);
        } catch (error) {
            console.error('Error fetching informes:', error);
        }
    };
    const redirigirInforme = () =>{
        if (estudiante.titulacion.avance_total == 100)  {
            Swal.fire({
                title: "Error",
                text: "Su porcentaje ya esta completo, no se puede agregar mas informes",
                icon: "error",
              });
              return;
        }else{
            navigate('/nuevo-informe')
        }
    }

    const getDatosEstudiante = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/estudiante/info/${id_estudiante}`);
            setEstudiante(response.data);
        } catch (error) {
            console.error('Error fetching informes:', error);
        }
    }

    const mostrarInformes = () => {
        const lastIndex = paginaActual * itemsPorPagina;
        const firstIndex = lastIndex - itemsPorPagina;
        return informes.slice(firstIndex, lastIndex).map((informe, index) => (
            <tr
                key={informe.id}
                className={informe.id === selectedRow ? "table-active" : ""}
                onClick={() => handleRowClick(informe.id)}
                style={{ cursor: "pointer" }}
            >
                <th scope="row">{firstIndex + index + 1}</th>
                <td>{informe.anexo}</td>
                <td>{informe.fecha}</td>
                <td className="align-middle">
                    <div className="progress">
                        <div
                            className="progress-bar bg-info "
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
            </tr>
        ));
    };

    const paginate = (pageNumber) => setPaginaActual(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(informes.length / itemsPorPagina); i++) {
        pageNumbers.push(i);
    }

    const handleRowClick = (id) => {
        setSelectedRow(id);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 table-responsive">
                <h2 className="text-center mb-4">Informes</h2>
                <div>
    {estudiante && (
        <div className="card mb-4">
            <div className="card-header">
                Datos del Estudiante
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Carrera</label>
                        <select
                            className="form-select"
                            value={estudiante.carrera}
                            onChange={(e) => setEstudiante({ ...estudiante, carrera: e.target.value })}
                        >
                            <option value="Ingeniería en Software">Ingeniería en Software</option>
                            <option value="Ingeniería en Telecomunicaciones">Ingeniería en Telecomunicaciones</option>
                            <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                            <option value="Ingeniería en Automatización y Robótica">Ingeniería en Automatización y Robótica</option>
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Tema de Titulación</label>
                        <input type="text" className="form-control" value={estudiante.titulacion.tema} onChange={(e) => setEstudiante({ ...estudiante, titulacion: { ...estudiante.titulacion, tema: e.target.value } })} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Nombre</label>
                        <input type="text" className="form-control" value={estudiante.persona.nombre} onChange={(e) => setEstudiante({ ...estudiante, persona: { ...estudiante.persona, nombre: e.target.value } })} />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Apellido</label>
                        <input type="text" className="form-control" value={estudiante.persona.apellido} onChange={(e) => setEstudiante({ ...estudiante, persona: { ...estudiante.persona, apellido: e.target.value } })} />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Progreso Total (%)</label>
                        <div className="progress">
                            <div
                                className="progress-bar progress-bar-striped progress-bar-animated bg-danger"
                                role="progressbar"
                                style={{ width: `${estudiante.titulacion.avance_total}%` }}
                                aria-valuenow={estudiante.titulacion.avance_total}
                                aria-valuemin="0"
                                aria-valuemax="100">
                                {estudiante.titulacion.avance_total}%
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                <button className="btn btn-primary btn-custom  mb-3 " onClick={() => navigate('/principal')}>Actualizar Informacion</button> 

                </div>
            </div>
        </div>
    )}
</div>

                    <button className="btn btn-primary mb-3" onClick={redirigirInforme}>Agregar Informe</button> 
                    <table className="table table-hover table-bordered">
                        <thead className="table-primary">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Anexo</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Porcentaje de avance</th>
                            </tr>
                        </thead>
                        <tbody>{mostrarInformes()}</tbody>
                    </table>
                    <nav className="d-flex justify-content-between align-items-center">
                        <ul className="pagination mb-0">
                            {pageNumbers.map((number) => (
                                <li key={number} className="page-item">
                                    <button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div>
                            <select onChange={(e) => setItemsPorPagina(parseInt(e.target.value, 10))} value={itemsPorPagina} className="form-select">
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
