import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';
import { useApiContext } from '../../../context/ApiContext';

// Component: ResetPassword
export function ResetPassword() {
  const { axiosInstance } = useApiContext();

  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = new URLSearchParams(useLocation().search).get('token');

  useEffect(() => {
    async function verify() {
      try {
        await axiosInstance.get(`/user/check-reset-token?token=${token}`);
      } catch {
        setTokenError('التوكن غير صحيح أو منتهي الصلاحية.');
      } finally {
        setLoading(false);
      }
    }
    if (token) verify();
    else {
      setTokenError('لم يتم العثور على التوكن.');
      setLoading(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPwd) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }
    setSubmitting(true);
    try {
      await axiosInstance.post('/user/reset-password', { token, newPassword: password });
      setMessage('');
      Swal.fire({
        icon: 'success',
        title:"تم تغيير كلمة المرور بنجاح. سيتم تحويلك الان الي صفحة تسجيل الدخول",
        button:"حسنا"
      });
      setPassword("")
      setConfirmPwd("")
      setTimeout(() => navigate('/login'), 3500);
    } catch {
      setError('حدث خطأ أثناء إعادة التعيين.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Container><Typography align="center">جاري التحقق من التوكن...</Typography></Container>;
  if (tokenError && !message)
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h6" color="error.main" align="center">
          {tokenError}
        </Typography>
      </Container>
    );

  const mismatch = confirmPwd && password !== confirmPwd;

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          إعادة تعيين كلمة المرور
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="كلمة المرور الجديدة"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth
            label="تأكيد كلمة المرور"
            type={showConfirm ? 'text' : 'password'}
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            margin="normal"
            error={mismatch}
            helperText={mismatch ? 'كلمة المرور غير مطابقة' : ' '}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                    {showConfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, py: 1.5 }}
            disabled={submitting || mismatch || !password || !confirmPwd}
          >
            {submitting ? <CircularProgress size={24} /> : 'تأكيد'}
          </Button>
          {message && (
            <Typography color="success.main" align="center" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
