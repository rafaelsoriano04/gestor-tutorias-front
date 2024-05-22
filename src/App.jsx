import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import imgInicio from "./assets/inicio.png";
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';

function App() {
  // Agregar la definición de estado para controlar la visualización de Login o Register
  const [showLogin, setShowLogin] = useState(true);  // Esto faltaba en tu versión

  return (
    <div className="container text-center">
      <div className="row align-items-center">
        <div className="col d-flex align-items-center justify-content-center">
          <img className="img" src={imgInicio} alt="Inicio" />
        </div>
        <div className="col">
          {showLogin ? (
            <Login onRegisterClick={() => setShowLogin(false)} />
          ) : (
            <Register onLoginClick={() => setShowLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
