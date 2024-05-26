import "bootstrap/dist/css/bootstrap.min.css";

const TablaEstudiantes = () => {
  // Lista de estudiantes
  let ListaEstudiantes = [
    { id: 1, nombre: 'Juan Pérez',estado:'En proceso', porcentaje: 70, carrera: 'Software' },
    { id: 2, nombre: 'Ana Sánchez',estado:'En proceso', porcentaje: 85, carrera: 'Software' },
    { id: 3, nombre: 'Carlos García',estado:'En proceso', porcentaje: 90, carrera: 'Software' },
    { id: 4, nombre: 'María Rodríguez',estado:'Graduado', porcentaje: 100, carrera: 'Software' },
    { id: 5, nombre: 'Pedro Gómez',estado:'Graduado', porcentaje: 100, carrera: 'Software' },
    { id: 6, nombre: 'Laura Martínez',estado:'Graduado', porcentaje: 100, carrera: 'Software' },
    { id: 7, nombre: 'Luis Torres',estado:'Dado de baja', porcentaje: 10, carrera: 'Software' }
  ];
  // mostrarEstudiantes .map td

  const mostrarEstudiantes = () => {

    return ListaEstudiantes.map((estudiante) => (
      <tr key={estudiante.id}>
        <td>{estudiante.id}</td>
        <td>{estudiante.nombre}</td>
        <td>{estudiante.estado}</td>
        <td>{estudiante.porcentaje}%</td>
        <td>{estudiante.carrera}</td>
      </tr>
    ));
  };


  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          <table className="table table-striped">
            <thead className="bg-danger">
            <tr>
                <th>#</th>
                <th>Estudiante</th>
                <th>Estado</th>
                <th>Porcentaje</th>
                <th>Carrera</th>
              </tr>
            </thead>
            <tbody>{mostrarEstudiantes()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

  /*
  const showFormularios = () => {
    const ultimoItem = paginaActual * itemsPorPagina;
    const primerItem = ultimoItem - itemsPorPagina;
    return formulariosOrdenados
      .slice(primerItem, ultimoItem)
      .map((estudiate, index) => (
        <tr
          key={form.id}
          className={form.id === selectedRow ? "table-active" : ""}
          onClick={() => handleRowClick(form.id)}
          style={{ cursor: "pointer" }}
        >
          <th scope="row">{index + 1}</th>
          <td>{form.n}</td>
          <td>{form.nombre_solicitante}</td>
          <td>{form.fecha_solicitud}</td>
          <td>{form.prioridad}</td>
          <td>{form.estado}</td>
        </tr>
      ));
  };*/

export default TablaEstudiantes;
