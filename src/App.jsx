import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState } from "react";
import imgInicio from "./assets/inicio.png";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

function App() {
  // Agregar la definición de estado para controlar la visualización de Login o Register
  const [showLogin, setShowLogin] = useState(true);

  const handelClick = () => {
    if (showLogin) return <Login onRegisterClick={() => setShowLogin(false)} />;
    return <Register onLoginClick={() => setShowLogin(true)} />;
  };

  return (
    <div className="container text-center">
      <div className="row align-items-center">
        <div className="col d-flex align-items-center justify-content-center">
          <img className="img" src={imgInicio} alt="Inicio" />
        </div>
        <div className="col">{handelClick()}</div>
      </div>
    </div>
  );
}

export default App;
