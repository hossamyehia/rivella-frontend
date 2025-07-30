import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../context/user.context';
import Loader from '../components/Loader';

const AdminGuard = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isAdminCheck } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      try {
        const isAdmin = await isAdminCheck();
        if (!isAdmin) {
          navigate('/admin/login');
        }
        setIsAdmin(isAdmin);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [navigate]);

  if (loading) return <Loader message='جاري التحقق من صلاحيات'/>;
  return isAdmin ? <Outlet /> : null;
};

export default AdminGuard;