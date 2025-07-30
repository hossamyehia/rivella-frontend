
// src/pages/AdminLogin.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  InputAdornment,
  IconButton
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Loader from '../../../shared/components/Loader';
import { useUserContext } from '../../../shared/context/user.context';

const AdminLogin = () => {
  const { loginAsAdmin, isLoading } = useUserContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'البريد الإلكتروني مطلوب';
    if (!re.test(email)) return 'صيغة البريد الإلكتروني غير صحيحة';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'كلمة المرور مطلوبة';
    if (password.length < 6) return 'كلمة المرور يجب أن تكون على الأقل 6 أحرف';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'email') setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    if (name === 'password') setErrors(prev => ({ ...prev, password: validatePassword(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);
    setErrors({ email: emailErr, password: passErr });

    if (emailErr || passErr) return;
    const res = await loginAsAdmin(formData.email, formData.password);
    if (res.success) {
      Swal.fire({
        icon: 'success',
        title: 'تم تسجيل الدخول بنجاح',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/dashboard');
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'فشل تسجيل الدخول',
        text: res.message || 'يرجى التحقق من بيانات الاعتماد الخاصة بك.',
      });
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  if (isLoading) return <Loader />;

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.9) 100%)',
        }}
      >
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          دخول المشرف
        </Typography>
        <Box component="form" onSubmit={handleSubmit} mt={3}>
          <TextField
            fullWidth
            label="البريد الإلكتروني"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="كلمة المرور"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2, mb: 3, borderRadius: '8px', py: 1.5 }}
          >
            تسجيل الدخول
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Typography variant="body2" align="center">
                العودة إلى{' '}
                <Link to="/" style={{ color: '#FF6B10', textDecoration: 'none', fontWeight: 'bold' }}>
                  الصفحة الرئيسية
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminLogin;