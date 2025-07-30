import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../context/user.context';

const AdminGuard = ({ children }) => {
  const { isAdminCheck } = useUserContext();

  return !isAdminCheck() ? <Navigate to="/admin/login" replace /> : <Outlet />;
};

export default AdminGuard;