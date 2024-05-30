import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const TablaEstudiantes = ({id_docente,refresh}) => {

  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [ordenarPor, setOrdenarPor] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const [estudiantesOrdenados, setEstudiantesOrdenados] = useState([]);
  const token = localStorage.getItem('jwtToken');
  
  let decoded;

  useEffect(() => {

    getEstudiantes();
  }, [refresh]);

  const getEstudiantes = async () => {
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      handleNavigation(); 
    }
    id_docente = decoded.id;

    try {
      const resp = await axios.get(`http://localhost:3000/estudiante/${id_docente}`);
      setEstudiantes(resp.data);
    } catch (error) {
      console.log(error);
    }
  }

  const paginate = (pageNumber) => setPaginaActual(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(estudiantes.length / itemsPorPagina); i++) {
    pageNumbers.push(i);
  }

  const handleRowClick = (id) => {
    setSelectedRow(id);
  };

  const cargarEstudiantes = () => {
    const ultimoItem = paginaActual * itemsPorPagina;
    const primerItem = ultimoItem - itemsPorPagina;
    return estudiantes.slice(primerItem, ultimoItem).map((estudiante, index) => (
      <tr
        key={estudiante.id}
        className={estudiante.id === selectedRow ? "table-active" : ""}
        onClick={() => handleRowClick(estudiante.id)}
        style={{ cursor: "pointer" }}
      >
        <th scope="row">{primerItem + index + 1}</th>
        <td>{estudiante.cedula}</td>
        <td>{estudiante.nombre}</td>
        <td>{estudiante.fechaAprobacion}</td>
        <td>{estudiante.estado}</td>
        <td>
          <progress value={estudiante.porcentaje} max="100"></progress>
          <span style={{ marginLeft: '10px' }}>{estudiante.porcentaje}%</span>
        </td>
        <td>{estudiante.carrera}</td>
      </tr>

    ));
  };


  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Cédula</th>
                <th scope="col">Nombre</th>
                <th scope="col">Aprobación</th>
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
                    <a onClick={() => paginate(number)} href="#" className="page-link">
                      {number}
                    </a>
                  </li>
                ))}
              </ul>
              <div>
                <select onChange={(e) => setItemsPorPagina(parseInt(e.target.value))} value={itemsPorPagina} className="form-select">
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
