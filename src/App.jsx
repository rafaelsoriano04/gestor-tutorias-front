import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import imgInicio from "./assets/inicio.png";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Principal from "./components/Principal";  
import PrivateRoute from './components/PrivateRoute';


function App() {
  // Estado para controlar la visualización de Login o Register
  const [showLogin, setShowLogin] = useState(true);

  // Función para alternar entre Login y Register
  const renderAuthComponent = () => {
    return showLogin ? 
      <Login onRegisterClick={() => setShowLogin(false)} /> : 
      <Register onLoginClick={() => setShowLogin(true)} />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <section>
            <div className="container-fluid">
              <div className="row">
                <div className="col d-flex align-items-center justify-content-center vh-100">
                  <img className="img-fluid" src={imgInicio} alt="Inicio" />
                </div>
                <div className="frm col d-flex align-items-center justify-content-center vh-100">
                  {renderAuthComponent()}
                </div>
              </div>
            </div>
          </section>
        }/>
        <Route element={<PrivateRoute />}>
          <Route path="/principal" element={<Principal/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

