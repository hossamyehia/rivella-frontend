
// VerifyEmail.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { MyContext } from '../context/MyContext';
import Swal from 'sweetalert2';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  InputAdornment
} from '@mui/material';


const VerifyEmail = () => {
  const { axiosInstance } = useContext(MyContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  const initialEmail = state?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleVerify = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post('/user/verify-email', { email, code });
      if (res.data.success) {
        Swal.fire('تم التحقق', 'تم تفعيل حسابك بنجاح', 'success').then(() => {
          navigate('/login');
        });
      }
    } catch (err) {
        if(err.response.data.message=="Invalid verification code"){

            Swal.fire('خطأ', "الكود خطأ", 'error');
        }else 
        {
            Swal.fire('خطأ', err.response?.data?.message || 'فشل التحقق', 'error');

        }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axiosInstance.post('/user/resend-verification-code', { email });
      Swal.fire('تم الإرسال', 'تم إرسال كود تحقق جديد', 'info');
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
        
            Swal.fire('خطأ', 'فشل إعادة إرسال الكود', 'error');

        
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
        <Typography variant="h5" align="center" mb={3}>
          تفعيل البريد الإلكتروني
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="البريد الإلكتروني"
              value={email}
              disabled
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="كود التحقق"
              value={code}
              onChange={e => setCode(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><VpnKeyIcon /></InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerify}
              disabled={loading || !code}
            >
              تحقق
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleResend}
              disabled={!canResend}
            >
              {canResend ? 'إعادة إرسال الكود' : `إعادة الإرسال خلال ${resendTimer}s`}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default VerifyEmail ;
