import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');  // Asume que tu token se almacena con la clave 'token'
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
