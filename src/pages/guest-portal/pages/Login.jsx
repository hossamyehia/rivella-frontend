// Login.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import showAlert from '../../../components/Alerts';
import Loader from '../../../components/Loader';
import { useUserContext } from '../../../context/UserContext';

const Login = () => {
  const { login } = useUserContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

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
    
    // Validate on change
    if (name === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    } else if (name === 'password') {
      setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submit
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setErrors({
      email: emailError,
      password: passwordError
    });
    
    // If no errors proceed with login
    if (!emailError && !passwordError) {
      try {
        setLoading(true);
        const { success, data, message } = await login(formData.email, formData.password);

        if(!success){
          showAlert.error('خطأ', message);
          return;
        }

        navigate('/');
      }  finally {
        setLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return <Loader />;
  }

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
          تسجيل الدخول
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
            sx={{ mb: 1 }}
          />

          {/* Forgot password link moved directly under password input */}
          <Box sx={{ mb: 2 }}>  
            <Link to="/user/forget-password" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#FF6B10' }}>
              هل نسيت كلمة المرور؟
            </Link>
          </Box>

          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            color="primary"
            size="large"
            sx={{ 
              mt: 1, 
              mb: 3,
              borderRadius: '8px',
              py: 1.5,
            }}
          >
            تسجيل الدخول
          </Button>
          
          <Grid container justifyContent="center">
            <Grid item>
              <Typography variant="body2" align="center">
                ليس لديك حساب؟{' '}
                <Link to="/register" style={{ color: '#FF6B10', textDecoration: 'none', fontWeight: 'bold' }}>
                  إنشاء حساب جديد
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
