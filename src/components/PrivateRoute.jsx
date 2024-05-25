import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('jwtToken'); // Usa la clave 'jwtToken'
  console.log("Token in PrivateRoute:", token); // Mensaje de depuración
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
