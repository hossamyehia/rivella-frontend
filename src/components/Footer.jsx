
// src/components/Footer.js
import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton, 
  Stack,
  Divider
} from '@mui/material';
import { 
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ 
      bgcolor: 'rgba(0, 0, 0, 0.05)', 
      pt: 6, 
      pb: 3, 
      mt: 'auto'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              ريفيلا للشاليهات
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              أفضل موقع لحجز الشاليهات في المملكة، نوفر لك تجربة استثنائية للعطلات ودعم على مدار الساعة لضمان راحتك.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" aria-label="facebook" color="primary">
                <Facebook />
              </IconButton>
              <IconButton size="small" aria-label="twitter" color="primary">
                <Twitter />
              </IconButton>
              <IconButton size="small" aria-label="instagram" color="primary">
                <Instagram />
              </IconButton>
              <IconButton size="small" aria-label="linkedin" color="primary">
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              روابط سريعة
            </Typography>
            <Box component="nav">
              <Link 
                component={RouterLink} 
                to="/" 
                color="inherit" 
                sx={{ display: 'block', mb: 1, textDecoration: 'none' }}
              >
                الرئيسية
              </Link>
              <Link 
                component={RouterLink} 
                to="/filter" 
                color="inherit"
                sx={{ display: 'block', mb: 1, textDecoration: 'none' }}
              >
                البحث عن شاليه
              </Link> 
            
              <Link 
                component={RouterLink} 
                to="/cities" 
                color="inherit"
                sx={{ display: 'block', mb: 1, textDecoration: 'none' }}
              >
                المدن
              </Link>
              <Link 
                component={RouterLink} 
                to="/villages" 
                color="inherit"
                sx={{ display: 'block', mb: 1, textDecoration: 'none' }}
              >
                القرى
              </Link>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              اتصل بنا
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn color="primary" sx={{ ml: 1 }} />
                <Typography variant="body2">
                  القاهرة، مصر
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email color="primary" sx={{ ml: 1 }} />
                <Typography variant="body2">
                  info@rivella.sa
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone color="primary" sx={{ ml: 1 }} />
                <Typography variant="body2">
                  +966 12 345 6789
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        
        {/* Copyright */}
        <Box sx={{ textAlign: 'center', pt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            جميع الحقوق محفوظة © {currentYear} ريفيلا للشاليهات
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;