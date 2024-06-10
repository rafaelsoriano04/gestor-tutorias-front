import React, { useState } from 'react';

function CrearInforme() {
  const [nombre, setNombre] = useState('');
  const [carrera, setCarrera] = useState('');
  const [tema, setTema] = useState('');
  const [fechaInforme, setFechaInforme] = useState('');
  const [fechaAprobacion, setFechaAprobacion] = useState('');
  const [porcentajeAvance, setPorcentajeAvance] = useState('');
  const [actividades, setActividades] = useState([]);

  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

  const handleCarreraChange = (event) => {
    setCarrera(event.target.value);
  };

  const handleTemaChange = (event) => {
    setTema(event.target.value);
  };

  const handleFechaInformeChange = (event) => {
    setFechaInforme(event.target.value);
  };

  const handleFechaAprobacionChange = (event) => {
    setFechaAprobacion(event.target.value);
  };

  const handlePorcentajeAvanceChange = (event) => {
    setPorcentajeAvance(event.target.value);
  };

  const addActividad = () => {
    setActividades([...actividades, { fecha: '', detalle: '' }]);
  };

  const handleActividadChange = (index, field, value) => {
    const updatedActividades = [...actividades];
    updatedActividades[index][field] = value;
    setActividades(updatedActividades);
  };

  return (
    <div className="container">
      <h1>Informe N°1</h1>
      <div className="form">
        <div className="input-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={handleNombreChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="carrera">Carrera:</label>
          <input
            type="text"
            id="carrera"
            value={carrera}
            onChange={handleCarreraChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="tema">Tema:</label>
          <input
            type="text"
            id="tema"
            value={tema}
            onChange={handleTemaChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="fechaInforme">Fecha Informe:</label>
          <input
            type="date"
            id="fechaInforme"
            value={fechaInforme}
            onChange={handleFechaInformeChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="fechaAprobacion">Fecha Aprobación:</label>
          <input
            type="date"
            id="fechaAprobacion"
            value={fechaAprobacion}
            onChange={handleFechaAprobacionChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="porcentajeAvance">Porcentaje Avance:</label>
          <input
            type="number"
            id="porcentajeAvance"
            value={porcentajeAvance}
            onChange={handlePorcentajeAvanceChange}
          />
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Fecha de la Actividad</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((actividad, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="date"
                    value={actividad.fecha}
                    onChange={(event) =>
                      handleActividadChange(index, 'fecha', event.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={actividad.detalle}
                    onChange={(event) =>
                      handleActividadChange(index, 'detalle', event.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="agregar-actividad" onClick={addActividad}>
          Agregar Actividad
        </button>
      </div>
      <div className="anexo">
        <div className="anexo-title">Anexo 05</div>
        {/* Add your anexo content here */}
      </div>
      <button className="crear-informe">Crear Informe</button>
    </div>
  );
}

export default CrearInforme;