// src/components/ContactUs.js
import React, { useContext, useState } from 'react';
import {
  Container,
  Box,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Stack,
  Alert,
  Snackbar,
  IconButton
} from '@mui/material';
import {
  Send as SendIcon,
  Call as CallIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Facebook,
  Instagram
} from '@mui/icons-material';
import { MusicVideo as TikTok } from '@mui/icons-material';
import { MyContext } from '../../../context/MyContext';
import { useApiContext } from '../../../context/ApiContext';

const socialLinks = {
  facebook: 'https://www.facebook.com/share/14jM49Sv4Q/',
  instagram: 'https://www.instagram.com/rivellaexplore?igsh=MWN5M2UzMzg1em92aA==',
  tiktok: 'https://www.tiktok.com/@rivella.explore?_t=ZS-8w1mt8Cl4Of&_r=1',
};

const ContactUs = () => {
  const { axiosInstance } = useApiContext();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء إرسال الرسالة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Section Header */}
      <Box
        sx={{
          background: theme => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          py: { xs: 4, md: 6 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" component="h1" gutterBottom>
            اتصل بنا
          </Typography>
          <Typography variant="subtitle1">
            نحن هنا لمساعدتك. تواصل معنا وسنرد عليك في أقرب وقت ممكن
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Contact Form */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                أرسل لنا رسالة
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    required
                    name="name"
                    label="الاسم الكامل"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    required
                    name="email"
                    label="البريد الإلكتروني"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    required
                    name="phone"
                    label="رقم الهاتف"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    required
                    name="message"
                    label="رسالتك"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<SendIcon />}
                    disabled={loading}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                معلومات التواصل
              </Typography>
              <Stack spacing={3} mt={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                    <LocationOnIcon />
                  </Avatar>
                  <Typography>مصر، القاهرة</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                    <EmailIcon />
                  </Avatar>
                  <Typography dir="ltr">rivellaexplore1@gmail.com</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                    <CallIcon />
                  </Avatar>
                  <Typography dir="ltr">01107973962</Typography>
                </Stack>

                {/* Social Media Links */}
                <Stack direction="row" spacing={1} mt={2}>
                  <IconButton
                    component="a"
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="facebook"
                    color="primary"
                    size="small"
                  >
                    <Facebook />
                  </IconButton>
                  <IconButton
                    component="a"
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="instagram"
                    color="primary"
                    size="small"
                  >
                    <Instagram />
                  </IconButton>
                  <IconButton
                    component="a"
                    href={socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="tiktok"
                    color="primary"
                    size="small"
                  >
                    <TikTok />
                  </IconButton>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Map */}
        <Box mt={6} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Typography
            variant="h6"
            gutterBottom
            color="primary"
            sx={{ mb: 2, textAlign: 'center' }}
          >
            موقعنا على الخريطة
          </Typography>
          <Box
            component="iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27629.47386893705!2d31.24856118700576!3d30.044219929272697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2z2KfZhNmC2KfZh9ix2KnYjCDZhdit2KfZgdi42Kkg2KfZhNmC2KfZh9ix2KnigKw!5e0!3m2!1sar!2seg!4v1714648642206!5m2!1sar!2seg"
            sx={{ width: '100%', height: { xs: 250, md: 400 } }}
            frameBorder="0"
            allowFullScreen
            loading="lazy"
          />
        </Box>
      </Container>

      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactUs;
