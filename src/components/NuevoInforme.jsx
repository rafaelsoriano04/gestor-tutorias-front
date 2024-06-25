import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import "./css/Informe.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";
import { PDFViewer } from "@react-pdf/renderer";
import VisualizadorPDF from "./VisualizadorPDF";

const NuevoInforme = () => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState([]);
  const [nombreEstudiante, setNombreEstudiante] = useState("");
  const [idEstudiante, setIdEstudiante] = useState("");
  const [idTitulacion, setIdTitulacion] = useState("");
  const [carreraEstudiante, setCarreraEstudiante] = useState("");
  const [fechaAprobacion, setFechaAprobacion] = useState("");
  const [porcentajeAvance, setPorcentajeAvance] = useState("");
  const [fechaCreacionInforme, setFechaCreacionInforme] = useState("");
  const [avance_total, setAvanceTotal] = useState(0);
  const [temaTitulacion, setTemaTitulacion] = useState("");
  const [nuevoPorcentaje, setNuevoPorcentaje] = useState("");
  const token = localStorage.getItem("jwtToken");
  const [persona, setPersona] = useState({});

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

  const eliminarActividad = (index) => {
    const nuevasActividades = actividades.filter((_, i) => i !== index);
    setActividades(nuevasActividades);
  };

  // Navegación para cerrar sesión y manejo del botón de cancelar
  const handleNavigation = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  const getFirstDayOfMonth = (date) => {
    const [year, month] = date.split("-");
    return `${year}-${month}-01`;
  };

  const obtenerDocente = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/docente/${id}`);
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
          title: "Oops..",
          text: "Todos los campos de las actividades deben estar llenos.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      if (!fechaCreacionInforme) {
        Swal.fire({
          title: "Oops..",
          text: "Ingrese la fecha de creación del informe",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
    }
    setActividades([...actividades, { descripcion: "", fecha_actividad: "" }]);
  };

  const getMinDate = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1 > d2 ? d1 : d2; // Devuelve la fecha más restrictiva
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
  const handleChangePorcentaje = (e) => {
    const newValue = e.target.value;
    if (
      /^\d*$/.test(newValue) &&
      (newValue === "" ||
        (Number(newValue) >= 1 &&
          Number(newValue) <= 100)) /*&& (Number(newValue+avance_total)>100)*/
    ) {
      setNuevoPorcentaje(newValue);
      setPorcentajeAvance(newValue);
    }
  };

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
            response.data.persona.nombre + " " + response.data.persona.apellido
          );
          setTemaTitulacion(response.data.titulacion.tema || "");
          setCarreraEstudiante(response.data.carrera || "");
          setFechaAprobacion(response.data.titulacion.fecha_aprobacion || "");
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
        title: "Oops...",
        text: "Debe ingresar la fecha de creación del informe.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (actividades.length === 0) {
      Swal.fire({
        title: "Oops...",
        text: "Debe ingresar al menos una actividad.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    for (let actividad of actividades) {
      if (!actividad.descripcion || !actividad.fecha_actividad) {
        Swal.fire({
          title: "Oops...",
          text: "Todos los campos de las actividades deben estar llenos.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
    }

    if (!porcentajeAvance) {
      Swal.fire({
        title: "Oops...",
        text: "Debe ingresar el porcentaje de avance.",
        icon: "warning",
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
      estado: "No firmado",
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
        timer: 3000,
        timerProgressBar: true,
      });
      handleCancelar();
    } catch (error) {
      if (error.response.status && error.response.status === 409) {
        const { message } = error.response.data;
        Swal.fire({
          title: "Oops...",
          text: message,
          icon: "warning",
        });
      }
    }
  };

  const anexo = "5";
  const data = {
    nombreEstudiante: nombreEstudiante,
    fechaAprobacion: fechaAprobacion,
    tema: temaTitulacion,
    fechaCreacion: fechaCreacionInforme,
    avance: nuevoPorcentaje + "%",
    actividades: actividades,
    anexo: anexo,
    nombreDocente: persona.nombre + " " + persona.apellido,
  };

  const handleOpenPDF = () => {
    if (!fechaCreacionInforme || !porcentajeAvance) {
      Swal.fire({
        toast: true,
        position: "top-end",
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
        icon: "warning",
        title: "Complete todos los datos del informe",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    if (data.actividades.length == 0) {
      Swal.fire({
        toast: true,
        position: "top-end",
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
        icon: "warning",
        title: "El informe no tiene actividades",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    const pdfWindow = window.open("", "PDFViewer", "width=800,height=700");
    const container = pdfWindow.document.createElement("div");
    pdfWindow.document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);
    root.render(
      <PDFViewer style={{ width: "100%", height: "95vh" }}>
        <VisualizadorPDF {...data} />
      </PDFViewer>
    );
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    const lastDayOfMonth = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0
    );

    setFechaCreacionInforme(e.target.value);

    // Si el día seleccionado no es el último día, sugerirlo sutilmente
    if (
      newDate.toISOString().split("T")[0] !==
      lastDayOfMonth.toISOString().split("T")[0]
    ) {
      Swal.fire({
        toast: true,
        position: "top-end",
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
        icon: "warning",
        title: `Considera seleccionar el último día del mes.`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
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
          <div className="col d-flex justify-content-end align-items-center">
            <button
              type="button"
              className="btn btn-primary btn-floating"
              onClick={handleOpenPDF}
            >
              <i className="fa fa-eye fa-2"></i>
            </button>
          </div>
        </div>

        <div className="border-primary-rounded rounded p-3 shadow mb-3">
          <div className="d-flex justify-content-between align-items-center mb-3 mx-4">
            <h5>Detalle:</h5>
          </div>
          <div className="row mb-3 mx-3">
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
                  //onChange={handleChange}
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
              <label htmlFor="notificationDate" className="form-label">
                Fecha del Informe:
              </label>
              <input
                type="date"
                className="form-control"
                id="notificationDate"
                min={fechaAprobacion}
                value={fechaCreacionInforme}
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="porcentaje-avance-input" className="form-label">
                Porcentaje de avance:
              </label>
              <div className="input-group">
                <input
                  type="text"
                  value={nuevoPorcentaje}
                  onChange={handleChangePorcentaje}
                  className="form-control"
                  id="porcentaje-avance-input"
                />
                <span className="input-group-text">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-primary rounded p-3 shadow">
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
                      maxLength={255}
                      onChange={(e) => handleDescripcionChange(index, e)}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={actividad.fecha_actividad}
                      onChange={(e) => handleFechaChange(index, e)}
                      className="form-control"
                      min={
                        fechaCreacionInforme && fechaAprobacion
                          ? getMinDate(
                              getFirstDayOfMonth(fechaCreacionInforme),
                              fechaAprobacion
                            )
                              .toISOString()
                              .split("T")[0]
                          : fechaCreacionInforme
                          ? getFirstDayOfMonth(fechaCreacionInforme)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
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
            <button className="btn btn-primary" onClick={agregarActividad}>
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
    </div>
  );
};

export default NuevoInforme;
