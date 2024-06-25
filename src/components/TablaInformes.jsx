/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/TablaInformes.css";
import ReactDOM from "react-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { Trash, Download } from "react-bootstrap-icons";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import VisualizadorPDF from "./VisualizadorPDF";
import PDFAnexo11 from "./PDFAnexo11";

// eslint-disable-next-line react/prop-types
const TablaInformes = ({ id_estudiante, refresh }) => {
  const [informes, setInformes] = useState([]);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);
  const [estudiante, setEstudiante] = useState({
    id: "",
    persona: {
      nombre: "",
      apellido: "",
    },
    titulacion: {
      tema: "",
      fecha_aprobacion: "",
    },
  });
  const token = localStorage.getItem("jwtToken");
  const [persona, setPersona] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getDatosEstudiante();
    getInformes();
    let decoded;
    try {
      decoded = jwtDecode(token);
      if (decoded?.id) {
        obtenerDocente(decoded.id);
      }
    } catch (error) {
      //
    }
  }, [refresh, id_estudiante, paginaActual, itemsPorPagina, token]);

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

  const abrirInforme = (idInforme) => {
    let id = estudiante.titulacion.id;
    localStorage.setItem("idInforme", idInforme);
    navigate(`/informe/${id}`);
  };

  const redirigirInforme = () => {
    if (estudiante.titulacion.avance_total === 100) {
      Swal.fire({
        title: "Error",
        text: "El porcentaje ya está completo, no se pueden agregar más informes",
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
      console.error("Error fetching student data:", error);
    }
  };

  const obtenerDocente = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/docente/${id}`);
      if (response.data) {
        setPersona(response.data.persona);
      }
    } catch (error) {
      console.error("Error fetching docente:", error);
    }
  };

  const eliminarInforme = async (id) => {
    const url = `http://localhost:3000/informes/${id}`;
    try {
      informes.find((informe) => informe.id === id);

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
        getDatosEstudiante();
        Swal.fire({
          title: "Eliminado",
          text: "El Informe ha sido eliminado correctamente",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar, intentelo de nuevo más tarde",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const getActividades = async (idInforme) => {
    try {
      const url = `http://localhost:3000/actividades/informe/${idInforme}`;
      const response = await axios.get(url);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.log("Error al cargar actividades");
    }
  };

  const getActividadesByEstudiante = async (idEstudiante) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/actividades/estudiante/${idEstudiante}`
      );
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const [actividadesAnexo11, setActividadesAnexo11] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const actividadesData = await getActividadesByEstudiante(estudiante.id);
        setActividadesAnexo11(actividadesData);
      } catch (error) {
        console.error("Error fetching activities data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActividades();
  }, [estudiante.id]);

  const handleAnexo11 = () => {
    if (isLoading) {
      return (
        <button className="btn btn-sm me-2" disabled>
          Cargando...
        </button>
      );
    }
    const dataAnexo11 = {
      estudiante: estudiante,
      nombreDocente: `${persona.nombre} ${persona.apellido}`,
      actividades: actividadesAnexo11,
    };

    const pdfWindow = window.open("", "PDFViewer", "width=800,height=700");
    const container = pdfWindow.document.createElement("div");
    pdfWindow.document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);
    root.render(
      <PDFViewer style={{ width: "100%", height: "95vh" }}>
        <PDFAnexo11 {...dataAnexo11} fileName="Informe Anexo 11" />
      </PDFViewer>
    );
  };

  const DownloadButton = ({ informe }) => {
    const [actividades, setActividades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchActividades = async () => {
        const actividadesData = await getActividades(informe.id);
        setActividades(actividadesData);
        setIsLoading(false);
      };
      fetchActividades();
    }, [informe.id]);

    if (isLoading) {
      return (
        <button className="btn btn-sm me-2" disabled>
          Cargando...
        </button>
      );
    }

    const PDFdata = {
      nombreEstudiante:
        estudiante.persona.nombre + " " + estudiante.persona.apellido,
      fechaAprobacion: estudiante.titulacion.fecha_aprobacion,
      fechaCreacion: informe.fecha,
      tema: estudiante.titulacion.tema,
      avance: informe.porcentaje_avance + "%",
      actividades: actividades,
      anexo: "5",
      nombreDocente: persona.nombre + " " + persona.apellido,
    };

    return (
      <PDFDownloadLink
        document={<VisualizadorPDF {...PDFdata} />}
        fileName="Informe_Anexo_5.pdf"
      >
        <button title="Descargar Informe" className="btn hover btn-sm me-2">
          <Download color="green" size={25} />
        </button>
      </PDFDownloadLink>
    );
  };

  const mostrarInformes = () => {
    const lastIndex = paginaActual * itemsPorPagina;
    const firstIndex = lastIndex - itemsPorPagina;
    const informesPagina = informes.slice(firstIndex, lastIndex);
    return informesPagina.map((informe, index) => (
      <tr key={informe.id} style={{ cursor: "pointer" }}>
        <th
          scope="row"
          className="align-middle"
          onDoubleClick={() => abrirInforme(informe.id)}
        >
          {firstIndex + index + 1}
        </th>
        <td
          onDoubleClick={() => abrirInforme(informe.id)}
          className="align-middle justify-content-center"
        >
          {informe.anexo}
        </td>
        <td
          onDoubleClick={() => abrirInforme(informe.id)}
          className="align-middle"
        >
          {informe.fecha}
        </td>
        <td
          onDoubleClick={() => abrirInforme(informe.id)}
          className="align-middle"
        >
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
        <td
          onDoubleClick={() => abrirInforme(informe.id)}
          className="align-middle"
        >
          {informe.estado}
        </td>
        <td className="d-flex justify-content-center align-middle">
          <DownloadButton informe={informe} />
          <button
            title="Eliminar Informe"
            className="btn hover btn-sm"
            onClick={() => eliminarInforme(informe.id)}
          >
            <Trash color="red" size={25} />
          </button>
        </td>
      </tr>
    ));
  };

  const paginate = (pageNumber) => setPaginaActual(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(informes.length / itemsPorPagina); i++) {
    pageNumbers.push(i);
  }

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
        toast: true,
        position: "top-end",
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
        icon: "success",
        title: "Datos actualizados",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
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

  const updateEstado = async () => {
    try {
      await axios.put(
        `http://localhost:3000/estudiante/${id_estudiante}/${estudiante.estado}`
      );
    } catch (error) {
      console.error("Error updating state:", error);
    }
  };

  useEffect(() => {
    if (estudiante && estudiante.id && estudiante.estado !== undefined) {
      updateEstado();
    }
  }, [estudiante]);

  const handleEstadoChange = (e) => {
    setEstudiante((prevEstudiante) => ({
      ...prevEstudiante,
      estado: e.target.value,
    }));

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Estado actualizado",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
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
                <div className="card-header">Datos del Estudiante</div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Carrera</label>
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
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tema de Titulación</label>
                      <input
                        type="text"
                        className="form-control"
                        maxLength="150"
                        value={estudiante.titulacion.tema}
                        onChange={(e) =>
                          setEstudiante({
                            ...estudiante,
                            titulacion: {
                              ...estudiante.titulacion,
                              tema: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        maxLength="30"
                        value={estudiante.persona.nombre}
                        onChange={(e) =>
                          setEstudiante({
                            ...estudiante,
                            persona: {
                              ...estudiante.persona,
                              nombre: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Apellido</label>
                      <input
                        type="text"
                        className="form-control"
                        maxLength="30"
                        value={estudiante.persona.apellido}
                        onChange={(e) =>
                          setEstudiante({
                            ...estudiante,
                            persona: {
                              ...estudiante.persona,
                              apellido: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="studentName" className="form-label">
                        Fecha de Aprobación
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="studentName"
                        value={estudiante.titulacion.fecha_aprobacion}
                        onChange={handleDateChange}
                      />
                    </div>
                    <div className="col-2">
                      <label htmlFor="studentName" className="form-label">
                        Estado
                      </label>
                      <select
                        className="form-select"
                        value={estudiante.estado}
                        onChange={handleEstadoChange}
                      >
                        <option value="En proceso">En proceso</option>
                        <option value="Finalizado">Finalizado</option>
                        <option value="De baja">De baja</option>
                      </select>
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Progreso Total (%)</label>
                      <div className="progress">
                        <div
                          className="progress-bar bg-primary progress-bar-animated progress-bar-striped"
                          role="progressbar"
                          style={{
                            width: `${estudiante.titulacion.avance_total}%`,
                          }}
                          aria-valuenow={estudiante.titulacion.avance_total}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {estudiante.titulacion.avance_total}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-primary btn-custom mb-1"
                      onClick={updateEstudiante}
                    >
                      Actualizar Información
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <h2 className="text-center mb-1">Informes</h2>
          <button className="btn btn-primary mb-3" onClick={redirigirInforme}>
            Agregar Informe
          </button>
          {estudiante && estudiante.titulacion.avance_total === 100 && (
            <button
              className="btn btn-primary mb-3 ms-2"
              onClick={handleAnexo11}
            >
              Anexo 11
            </button>
          )}
          <table className="table table-hover table-bordered">
            <thead className="table-primary">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Anexo</th>
                <th scope="col">Fecha</th>
                <th scope="col">Porcentaje de avance</th>
                <th scope="col">Estado</th>
                <th scope="col" className="text-center">
                  Opciones
                </th>
              </tr>
            </thead>
            <tbody>{mostrarInformes()}</tbody>
          </table>
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
                  setItemsPorPagina(parseInt(e.target.value, 10))
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
