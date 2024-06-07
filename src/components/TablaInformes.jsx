import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const TablaInformes = ({id_estudiante,refresh}) => { 
  const [informes, setInformes] = useState([]);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const token = localStorage.getItem('jwtToken');
  const [informesOrden, setInformesOrden] = useState([]);

  let decoded;

    useEffect(() => {

        getInformes();
    }, [refresh]);

    const getInformes = async () => {
        try {
        decoded = jwtDecode(token);
        } catch (error) {
        console.error('Error decoding token:', error);
        handleNavigation();
        }
        id_estudiante = decoded.id;

        try {
        const resp = await axios.get(`http://localhost:3000/estudiante/${id_docente}`);
        setInformes(resp.data);
        } catch (error) {
        console.log(error);
        }
    }

    // mostrarInformes .map td
    const mostrarInformes = () => {
    const ultimoItem = paginaActual * itemsPorPagina;
    const primerItem = ultimoItem - itemsPorPagina;
    return informes.slice(primerItem, ultimoItem).map((informe, index) => (
      <tr
        key={informe.id}
        className={informe.id === selectedRow ? "table-uta" : ""}
        onClick={() => handleRowClick(informe.id)}
        style={{ cursor: "pointer" }}
      >
        <th scope="row">{primerItem + index + 1}</th>
        <td>{informe.id}</td>
        <td>{informe.anexo}</td>
        <td>{informe.fecha_aprovacion}</td>
        <td className="align-middle">
          <div className="progress">
            <div
              className="progress-bar progress-bar-animated progress-bar-striped"
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
              <p className="fs-3 fw-bold">Informes:</p>
              <div>
              <button className="btn btn-danger rounded-pill px-3" type="button">Regresar</button>
              <button className="btn btn-danger rounded-pill px-3" type="button">Crear Informe</button>
              </div>
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
  

  
  export default TablaInformes;