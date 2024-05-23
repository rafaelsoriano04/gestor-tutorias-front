import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState } from "react";
import imgInicio from "./assets/inicio.png";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

function App() {
  // Agregar la definición de estado para controlar la visualización de Login o Register
  const [showLogin, setShowLogin] = useState(true);

  const handleClick = () => {
    if (showLogin) return <Login onRegisterClick={() => setShowLogin(false)} />;
    return <Register onLoginClick={() => setShowLogin(true)} />;
  };

  return (
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col d-flex align-items-center justify-content-center vh-100">
            <img className="img-fluid" src={imgInicio} alt="Inicio" />
          </div>
          <div className="frm col d-flex align-items-center justify-content-center vh-100">
            {handleClick()}
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
