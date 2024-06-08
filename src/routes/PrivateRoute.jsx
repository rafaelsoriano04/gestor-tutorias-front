import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('jwtToken'); // Usa la clave 'jwtToken'
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
