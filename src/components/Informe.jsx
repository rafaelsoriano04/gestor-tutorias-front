/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/Informe.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";
import { PencilSquare } from "react-bootstrap-icons";
import { PDFViewer } from "@react-pdf/renderer";
import ReactDOM from "react-dom";
import VisualizadorPDF from "./VisualizadorPDF";

const Informe = () => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState([]);
  const [firmado, setFirmado] = useState(false);
  const [nombreEstudiante, setNombreEstudiante] = useState("");
  const [carreraEstudiante, setCarreraEstudiante] = useState("");
  const [fechaAprobacion, setFechaAprobacion] = useState("");
  const [avance_total, setAvanceTotal] = useState(0);
  const [temaTitulacion, setTemaTitulacion] = useState("");
  const token = localStorage.getItem("jwtToken");
  const [persona, setPersona] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [informe, setInforme] = useState({
    fecha: "",
    porcentaje_avance: 0,
    estado: "No firmado",
    actividades: [],
  });
  const [actividadesEliminadas, setActividadesEliminadas] = useState([]);

  // Función para cargar datos del estudiante
  useEffect(() => {
    getDatosEstudiante();
    getActividades();
    getInforme();
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
  }, [token]); // Dependencia sobre token

  const getActividades = async () => {
    try {
      const id = localStorage.getItem("idInforme");
      const response = await axios.get(
        `http://localhost:3000/actividades/informe/${id}`
      );
      setActividades(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarActividad = (index) => {
    setActividadesEliminadas((prev) => [...prev, actividades[index]]);
    const nuevasActividades = actividades.filter((_, i) => i !== index);
    setActividades(nuevasActividades);
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
          title: "Operación no permitida",
          text: "Todos los campos de las actividades deben estar llenos.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
    }
    setActividades([...actividades, { descripcion: "", fecha_actividad: "" }]);
  };

  const guardar = async () => {
    try {
      const updatedInforme = {
        ...informe,
        actividades: actividades, // Asegura que actividades están actualizadas
      };
      const url = `http://localhost:3000/informes`;
      await axios.put(url, updatedInforme);
      await eliminarActividades();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Informe Actualizado",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      getActividades();
      getInforme();
      setFirmado(informe.estado === "Firmado");
      setIsEditing(false);
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

  const eliminarActividades = async () => {
    if (actividadesEliminadas) {
      try {
        const url = `http://localhost:3000/actividades`;
        await axios.delete(url, { data: actividadesEliminadas });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getInforme = async () => {
    try {
      const id = localStorage.getItem("idInforme");
      const url = `http://localhost:3000/informes/${id}`;
      const response = await axios.get(url);
      setInforme(response.data);
      if (response.data) {
        if (response.data.estado === "Firmado") {
          setFirmado(true);
        }
      }
    } catch (error) {
      console.log(error);
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

  const handleRegresar = async () => {
    if (isEditing) {
      const confirmacion = await Swal.fire({
        title: "¿Está seguro?",
        text: "La información editada no se guardará",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
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

  // Metodo que verifica el numero de porcentaje de avance
  const handlePorcentajeChange = (e) => {
    const newValue = e.target.value;
    if (
      /^\d*$/.test(newValue) &&
      (newValue === "" ||
        (Number(newValue) >= 1 &&
          Number(newValue) <= 100)) /*&& (Number(newValue+avance_total)>100)*/
    ) {
      setInforme((informe) => ({
        ...informe,
        porcentaje_avance: newValue,
      }));
    }
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
  const handleFirmado = () => {
    setFirmado((prevFirmado) => {
      const newFirmado = !prevFirmado;
      setInforme((informe) => ({
        ...informe,
        estado: newFirmado ? "Firmado" : "No Firmado",
      }));
      return newFirmado;
    });
  };

  const handleEditar = async () => {
    if (isEditing) {
      // Preguntar al usuario si realmente desea cancelar la edición
      const confirmacion = await Swal.fire({
        title: "¿Está seguro?",
        text: "La información editada no se guardará",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      });
      if (confirmacion.isConfirmed) {
        getActividades();
        getInforme();
        setFirmado(informe.estado === "Firmado");
        setIsEditing(false);
      }
    } else {
      if (informe.estado == "Firmado") {
        const confirmacion = await Swal.fire({
          title: "Precaución",
          text: "¿Está seguro que desea editar? El informe ya está firmado...",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "Cancelar",
        });
        if (confirmacion.isConfirmed) {
          getActividades();
          getInforme();
          setFirmado(informe.estado === "Firmado");
          setIsEditing(true);
        } else {
          setIsEditing(false);
        }
      } else {
        setIsEditing(true);
      }
    }
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    const lastDayOfMonth = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0
    );

    setInforme((informe) => ({
      ...informe,
      fecha: e.target.value,
    }));

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

  // Navegación para cerrar sesión y manejo del botón de cancelar
  const handleNavigation = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  const handleGuardar = () => {
    if (!informe.fecha) {
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

    if (!informe.porcentaje_avance) {
      Swal.fire({
        title: "Oops...",
        text: "Debe ingresar el porcentaje de avance.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    guardar();
  };

  const data = {
    nombreEstudiante: nombreEstudiante,
    fechaAprobacion: fechaAprobacion,
    tema: temaTitulacion,
    fechaCreacion: informe.fecha,
    avance: informe.porcentaje_avance + "%",
    actividades: actividades,
    anexo: 5,
    nombreDocente: persona.nombre + " " + persona.apellido,
  };

  const handleOpenPDF = () => {
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

  const getFirstDayOfMonth = (date) => {
    const [year, month] = date.split("-");
    return `${year}-${month}-01`;
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
            <h1>Informe</h1>
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
        <div className="border-primary rounded p-3 shadow mb-3">
          <div className="d-flex justify-content-between align-items-center mb-3 mx-4">
            <h5>Detalle:</h5>
            <button className="btn btn-link p-0" onClick={handleEditar}>
              <PencilSquare color="black" size={25} />
            </button>
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
                value={informe.fecha}
                min={fechaAprobacion}
                onChange={handleDateChange}
                disabled={!isEditing}
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="porcentaje-avance-input" className="form-label">
                Porcentaje de avance:
              </label>
              <div className="input-group">
                <input
                  type="text"
                  value={informe.porcentaje_avance}
                  onChange={handlePorcentajeChange}
                  className="form-control"
                  id="porcentaje-avance-input"
                  disabled={!isEditing}
                />

                <span className="input-group-text">%</span>
              </div>
            </div>
          </div>
          <div className="col d-flex justify-content-center align-items-center mt-3">
            <label className="form-check-label me-2" htmlFor="firmadoToggle">
              Firmado:
            </label>
            <div className="form-check form-switch d-flex align-items-center">
              <input
                className="form-check-input"
                type="checkbox"
                id="firmadoToggle"
                checked={firmado}
                onChange={handleFirmado}
                style={{
                  backgroundColor: firmado ? "#9B2B2B" : "white",
                  borderColor: "grey",
                }}
                disabled={!isEditing}
              />
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
                {isEditing && <th>Eliminar</th>}
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
                      onChange={(e) => handleDescripcionChange(index, e)}
                      className="form-control"
                      disabled={!isEditing}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={actividad.fecha_actividad}
                      onChange={(e) => handleFechaChange(index, e)}
                      className="form-control"
                      min={
                        informe.fecha ? getFirstDayOfMonth(informe.fecha) : ""
                      }
                      max={informe.fecha}
                      disabled={!isEditing}
                    />
                  </td>
                  {isEditing && (
                    <td className="text-center">
                      <button
                        className="btn btn-circle"
                        onClick={() => eliminarActividad(index)}
                      >
                        &times;
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {isEditing && (
            <>
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={agregarActividad}>
                  Agregar Actividad
                </button>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-primary me-3"
                  onClick={handleGuardar}
                >
                  Guardar
                </button>
                <button className="btn btn-primary" onClick={handleEditar}>
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Informe;
