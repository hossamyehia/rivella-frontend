import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import Swal from 'sweetalert2';
import { useApiContext } from '../../../context/ApiContext';

// Component: ForgetPassword
export function ForgetPassword() {
  const { axiosInstance } = useApiContext();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await axiosInstance.post('/user/forgot-password', { email });
      if (res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: "تم إرسال الرابط إلى بريدك الإلكتروني.",
          button: "حسنا"
        });
        setEmail("")
      }
    } catch (err) {
      if (err.response.data.message == "Email not found") setError('البريد الإلكتروني غير موجود.');
      else setError('حدث خطأ، الرجاء المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          استعادة كلمة المرور
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
            helperText={error || ' '}
            InputProps={{
              startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment>
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'إرسال الرابط'}
          </Button>
          {message && (
            <Typography color="success.main" align="center" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Typography variant="body2">
              تذكرت كلمة المرور؟{' '}
              <Link to="/login" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
                تسجيل الدخول
              </Link>
            </Typography>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
