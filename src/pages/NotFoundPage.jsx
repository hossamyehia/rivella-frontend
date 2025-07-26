import React from 'react';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: '16px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <ErrorOutlineIcon sx={{ fontSize: 64, color: 'primary.main' }} />
        </Box>
        <Typography variant="h4" gutterBottom color="primary">
          Oops! 404 - الصفحة غير موجودة
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          عذراً، لا يمكننا العثور على الصفحة التي تبحث عنها.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: '8px', px: 4, py: 1.5 }}
        >
          العودة إلى الصفحة الرئيسية
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;
