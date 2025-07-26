// src/routes/AdminRoute.js
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const AdminRoute = ({ children }) => {
  const { isAdminCheck } = useUserContext();

  if (!isAdminCheck()) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export default AdminRoute;