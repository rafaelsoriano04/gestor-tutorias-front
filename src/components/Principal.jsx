import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import TablaEstudiantes from "./TablaEstudiantes";
import "./css/Principal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import Navbar from "./Navbar";

function Principal() {
    const [id_docente, setId_docente] = useState("");
    const [persona, setPersona] = useState({});
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("jwtToken");
    const [refreshTable, setRefreshTable] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    const handleShowInforme = () => {
        if (selectedStudentId) {
            localStorage.setItem("idPersona", selectedStudentId);
            navigate(`/informes/${selectedStudentId}`);
        } else {
            Swal.fire({
                title: "Seleccione un estudiante de la lista!",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    const handleStudentSelect = (id) => {
        setSelectedStudentId(id);
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
                setId_docente(decoded.id);
                obtenerDocente(decoded.id);
            }
        } catch (error) {
            //
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]); // Dependencia sobre token

    const handleNavigation = () => {
        localStorage.removeItem("jwtToken");
        navigate("/");
    };

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const studentData = {
            carrera: formData.get("carrera"),
            persona: {
                identificacion: formData.get("identificacion"),
                nombre: formData.get("nombre"),
                apellido: formData.get("apellido"),
                telefono: "00000",
                email: formData.get("correoElectronico"),
            },
            titulacion: {
                tema: formData.get("tema"),
                fecha_aprobacion: formData.get("fechaAprobacion"),
                id_docente,
            },
        };

        try {
            await axios.post("http://localhost:3000/estudiante", studentData);
            Swal.fire({
                html: "<i>Estudiante asignado</i>",
                icon: "success",
            });
            handleCloseModal();
            setRefreshTable((prev) => !prev);
        } catch (error) {
            if (error.response) {
                const { message } = error.response.data;
                if (message == "El estudiante ya existe") {
                    Swal.fire({
                        title: "Oops...",
                        html: "<i>El estudiante ya existe</i>",
                        icon: "error",
                    });
                } else if (message == "El tema ya existe") {
                    Swal.fire({
                        title: "Oops...",
                        html: "<i>El tema ya existe</i>",
                        icon: "error",
                    });
                }
            }
        }
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const day = today.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const currentDate = getCurrentDate();

    return (
        <div>
            <Navbar nombre={persona.nombre} apellido={persona.apellido} />
            <TablaEstudiantes
                id_docente={id_docente}
                refresh={refreshTable}
                navigate={navigate}
                onStudentSelect={handleStudentSelect}
            />

            <div className="row justify-content-center mb-4">
                <div className="col-auto">
                    <button
                        className="btn btn-primary hover"
                        onClick={handleShowModal}
                    >
                        Nuevo Estudiante
                    </button>
                </div>
                <div className="col-auto">
                    <button
                        className="btn btn-primary hover"
                        onClick={handleShowInforme}
                    >
                        Informes
                    </button>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Asignar Estudiante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group
                            className="mb-3"
                            controlId="formBasicNombre"
                        >
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el nombre"
                                maxLength="30"
                                name="nombre"
                                required
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="formBasicApellido"
                        >
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el apellido"
                                name="apellido"
                                maxLength="30"
                                required
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="formBasicIdentificacion"
                        >
                            <Form.Label>Identificación</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese la identificación"
                                name="identificacion"
                                maxLength="10"
                                pattern="[0-9]*"
                                onInput={(e) =>
                                    (e.target.value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    ))
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="formBasicCarrera"
                        >
                            <Form.Label>Carrera</Form.Label>
                            <Form.Control
                                as="select"
                                placeholder="Seleccione Una Opcion"
                                name="carrera"
                                required
                            >
                                <option>Ingeniería en Software</option>
                                <option>
                                    Ingeniería en Telecomunicaciones
                                </option>
                                <option>Ingeniería Industrial</option>
                                <option>
                                    Ingeniería en Automatización y Robótica
                                </option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicTema">
                            <Form.Label>Tema</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Ingrese el tema"
                                name="tema"
                                maxLength="150"
                                required
                                rows={2} // Puedes ajustar el número de filas según tus necesidades
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="formBasicFechaAprobacion"
                        >
                            <Form.Label>Fecha Aprobación</Form.Label>
                            <Form.Control
                                type="date"
                                name="fechaAprobacion"
                                required
                                max={currentDate}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="formBasicCorreoElectronico"
                        >
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingrese el correo electrónico"
                                name="correoElectronico"
                                maxLength="30"
                                required
                            />
                        </Form.Group>
                        <div className="container d-flex justify-content-center">
                            <Button
                                className="align-items-center"
                                variant="primary"
                                type="submit"
                            >
                                Asignar
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Principal;
