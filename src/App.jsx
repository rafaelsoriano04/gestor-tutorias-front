import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import imgInicio from "./assets/inicio.png";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container text-center">
      <div className="row align-items-center">
        <div className="col d-flex align-items-center justify-content-center">
          <img className="img" src={imgInicio} alt="Descripción de imagen" />
        </div>
        <div className="col">
        
        </div>
      </div>
    </div>
  );
}

export default App;
