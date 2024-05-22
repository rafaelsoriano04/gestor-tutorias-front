import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { useState } from 'react'
import imgInicio from "./assets/inicio.png";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div class="container text-center">
      <div class="row align-items-center">
        <div class="col d-flex align-items-center justify-content-center">
          <img class="img" src={imgInicio} alt="" />
        </div>
        <div class="col">
          One of three columns
        </div>
      </div>
    </div>
  )
}

export default App
