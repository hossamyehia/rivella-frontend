// src/routes/AdminRoute.js
import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { MyContext } from '../context/MyContext';

const AdminRoute = ({ children }) => {
  const [status, setStatus] = useState({
    loading: true,
    isAdmin: false,
  });
  const { axiosInstance } = useContext(MyContext);

  // local copy of your checkAdmin logic
  const checkAdmin = async (token) => {
    try {
      const res = await axiosInstance.get('/admin/is-admin', {
        headers: { token }
      });
      return res.data.success === true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // no token → definitely not admin
        return setStatus({ loading: false, isAdmin: false });
      }

      const ok = await checkAdmin(token);
      setStatus({ loading: false, isAdmin: ok });
    };

    verify();
  }, []);

  // 1) still waiting for /admin/is-admin
  if (status.loading) {
    return <Loader />;
  }

  // 2) not an admin → redirect out
  if (!status.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 3) admin! render protected children
  return <>{children}</>;
};

export default AdminRoute;
