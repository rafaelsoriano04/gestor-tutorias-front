import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import imgInicio from "./assets/inicio.png";
import Login from "./components/Login.jsx";
import Principal from "./components/Principal";
import Informes from "./components/Informes.jsx";
import PrivateRoute from "./routes/PrivateRoute";
import "./styles/main.scss";
import NuevoInforme from "./components/NuevoInforme.jsx";
import Informe from "./components/Informe.jsx";

function App() {
    // Función para alternar entre Login y Register
    const renderAuthComponent = () => {
        return <Login />;
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <section>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col d-flex align-items-center justify-content-center vh-100">
                                        <img
                                            className="img-fluid"
                                            src={imgInicio}
                                            alt="Inicio"
                                        />
                                    </div>
                                    <div className="frm col d-flex align-items-center justify-content-center vh-100">
                                        {renderAuthComponent()}
                                    </div>
                                </div>
                            </div>
                        </section>
                    }
                />
                <Route element={<PrivateRoute />}>
                    <Route path="/principal" element={<Principal />} />
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route
                        path="/informes/:idEstudiante"
                        element={<Informes />}
                    />
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route
                        path="/nuevo-informe/:id_titulacion"
                        element={<NuevoInforme />}
                    />
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route
                        path="/informe/:idEstudiante"
                        element={<Informe />}
                    />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
