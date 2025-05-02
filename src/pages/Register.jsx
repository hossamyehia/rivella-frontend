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
  IconButton,
  Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PhoneIcon from '@mui/icons-material/Phone';
import { MyContext } from '../context/MyContext';
import showAlert from '../components/Alerts';
import Loader from '../components/Loader';
import Swal from 'sweetalert2';

const Register = () => {
  const { axiosInstance, login } = useContext(MyContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const validateFullName = (name) => {
    if (!name) return 'الاسم الكامل مطلوب';
    if (name.length < 3) return 'الاسم يجب أن يكون 3 أحرف على الأقل';
    return '';
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'البريد الإلكتروني مطلوب';
    if (!re.test(email)) return 'صيغة البريد الإلكتروني غير صحيحة';
    return '';
  };

  const validatePhone = (phone) => {
    const re = /^01[0-2,5]\d{8}$/; // Egyptian mobile format
    if (!phone) return 'رقم الهاتف مطلوب';
    if (!re.test(phone)) return 'صيغة رقم الهاتف غير صحيحة';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'كلمة المرور مطلوبة';
    if (password.length < 6) return 'كلمة المرور يجب أن تكون على الأقل 6 أحرف';
    return '';
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return 'تأكيد كلمة المرور مطلوب';
    if (confirmPassword !== formData.password) return 'كلمات المرور غير متطابقة';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate on change
    switch (name) {
      case 'fullName':
        setErrors(prev => ({ ...prev, fullName: validateFullName(value) }));
        break;
      case 'email':
        setErrors(prev => ({ ...prev, email: validateEmail(value) }));
        break;
      case 'phone':
        setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
        break;
      case 'password':
        setErrors(prev => ({ 
          ...prev, 
          password: validatePassword(value),
          confirmPassword: formData.confirmPassword ?
            (value === formData.confirmPassword ? '' : 'كلمات المرور غير متطابقة') : 
            prev.confirmPassword
        }));
        break;
      case 'confirmPassword':
        setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(value) }));
        break;
      default:
        break;
    }
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    // run validations...
    // if no errors:
    try {
      setLoading(true);
      const response = await axiosInstance.post('/user/register', {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'تم التسجيل',
          text: 'تم إرسال كود التحقق إلى بريدك الإلكتروني',
          confirmButtonText: 'حسناً'
        }).then(() => {
          navigate('/verify-email', { state: { email: formData.email } });
        });
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message === 'Email already in use') {
        setErrors(prev => ({ ...prev, email: 'البريد الإلكتروني مستخدم بالفعل' }));
      }
      Swal.fire({
        icon: 'error',
        title: 'البريد الإلكتروني مستخدم بالفعل',
        confirmButtonText: 'حسناً'
      })
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <HowToRegIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h4" color="primary">
            إنشاء حساب جديد
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box component="form" onSubmit={handleSubmit} mt={3}>
          <TextField
            fullWidth
            label="الاسم الكامل"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

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
            label="رقم الهاتف"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="primary" />
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
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="تأكيد كلمة المرور"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
            sx={{ 
              mt: 2, 
              mb: 3,
              borderRadius: '8px',
              py: 1.5,
            }}
          >
            إنشاء حساب
          </Button>

          <Grid container justifyContent="center">
            <Grid item>
              <Typography variant="body2" align="center">
                لديك حساب بالفعل؟{' '}
                <Link to="/login" style={{ color: '#FF6B10', textDecoration: 'none', fontWeight: 'bold' }}>
                  تسجيل الدخول
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
