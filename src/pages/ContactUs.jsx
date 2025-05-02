import React, { useContext, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
  Divider,
  Paper
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { MyContext } from '../context/MyContext';

const ContactUs = () => {
    const { axiosInstance } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      setLoading(false);
      return;
    }

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

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" fontWeight="bold" color="primary.main">
          اتصل بنا
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          نحن هنا لمساعدتك. تواصل معنا وسنرد عليك في أقرب وقت ممكن
        </Typography>
        <Divider sx={{ mt: 2, width: 60, mx: 'auto', borderColor: 'primary.main', borderWidth: 2 }} />
      </Box>

      <Grid container spacing={4}>
        {/* Contact Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2} color="primary.main">
                معلومات التواصل
              </Typography>

              <Box mb={2}>
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <LocationOnIcon sx={{ color: 'primary.main', fontSize: 24, mr: 1 }} />
                  <Typography>
                    مصر، القاهرة، المعادي، شارع ٩، مبنى ١٢
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <EmailIcon sx={{ color: 'primary.main', fontSize: 24, mr: 1 }} />
                  <Typography dir="ltr">
                    info@chalets-egypt.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <CallIcon sx={{ color: 'primary.main', fontSize: 24, mr: 1 }} />
                  <Typography dir="ltr">
                    +20 123 456 7890
                  </Typography>
                </Box>
              </Box>

              <Paper elevation={0} sx={{ p: 2, backgroundColor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                  ساعات العمل
                </Typography>
                <Typography>الأحد - الخميس: ٩ص - ٥م</Typography>
                <Typography>الجمعة - السبت: ١٠ص - ٣م</Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2} color="primary.main">
                أرسل لنا رسالة
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {[
                    { name: 'name', label: 'الاسم الكامل', type: 'text' },
                    { name: 'email', label: 'البريد الإلكتروني', type: 'email' },
                    { name: 'phone', label: 'رقم الهاتف', type: 'text' }
                  ].map(field => (
                    <Grid item xs={12} sm={6} key={field.name}>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        required
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleChange}
                      />
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      required
                      name="message"
                      label="رسالتك"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      endIcon={<SendIcon />}
                      sx={{ py: 1 }}
                    >
                      {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Map Section */}
      <Box mt={4}>
        <Card sx={{ boxShadow: 3, overflow: 'hidden' }}>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h6" fontWeight="bold" p={2} color="primary.main">
              موقعنا على الخريطة
            </Typography>
            <Divider />
            <Box
              component="iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27629.47386893705!2d31.24856118700576!3d30.044219929272697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2z2KfZhNmC2KfZh9ix2KnYjCDZhdit2KfZgdi42Kkg2KfZhNmC2KfZh9ix2KnigKw!5e0!3m2!1sar!2seg!4v1714648642206!5m2!1sar!2seg"
              width="100%"
              height={['200px', '300px']}
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={handleCloseSnackbar}>
          تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactUs;