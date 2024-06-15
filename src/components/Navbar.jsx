import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Navbar = ({ nombre, apellido }) => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        localStorage.removeItem("jwtToken");
        navigate("/");
    };

    return (
        <nav className="navbar bg-custom">
            <div className="container-fluid d-flex justify-content-between">
                <span className="navbar-text text-white">
                    Universidad Técnica de Ambato
                </span>
                <div
                    className="d-flex align-items-center text-custom logout"
                    style={{ cursor: "pointer" }}
                >
                    <span className="logout-text ms-2 pe-3">
                        {nombre} {apellido}
                    </span>

                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            <i className="fa fa-user fa-2"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleNavigation}>
                                Cerrar Sesión
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
