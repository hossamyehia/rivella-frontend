import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from '../context/MyContext';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Divider,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
  Fade,
  Skeleton
} from '@mui/material';
import {
  DeleteOutline as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
  Delete as ClearAllIcon
} from '@mui/icons-material';

const WishlistPage = () => {
  const navigate = useNavigate();
  const {
    isLogin,
    wishlist,
    removeFromWishlist,
    clearWishlist,
    addToCart,
    isLoading
  } = useMyContext();
  
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    console.log('Wishlist data:', wishlist);
  }, [wishlist]);

  // Redirect if not logged in
  // useEffect(() => {
  //   const checkAuth = () => {
  //     if (!isLogin) {
  //       navigate('/login', { state: { from: '/wishlist', message: 'يجب تسجيل الدخول لعرض المفضلة' } });
  //     } else {
  //       setTimeout(() => setIsPageLoading(false), 800);
  //     }
  //   };
  //   const timer = setTimeout(checkAuth, 500);
  //   return () => clearTimeout(timer);
  // }, [isLogin, navigate]);

  useEffect(() => {
    // Set loading to false after a short delay
    setTimeout(() => setIsPageLoading(false), 800);
  }, []);

  const handleRemoveItem = (item) => {
    removeFromWishlist(item);
  };

  const handleClearAll = () => {
    clearWishlist();
  };

  const handleAddToCart = (chalet) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const chaletForCart = {
      id: chalet._id,
      name: chalet.name || 'شاليه',
      price: chalet.price || 0,
      mainImg: chalet.mainImg || 'https://via.placeholder.com/300x200?text=No+Image'
    };

    addToCart(
      chaletForCart,
      today.toISOString().split('T')[0],
      tomorrow.toISOString().split('T')[0]
    );
    navigate('/cart');
  };

  const handleViewDetails = (chaletId) => {
    navigate(`/chalet/${chaletId}`);
  };

  // Function to safely access nested properties
  const getCityName = (chalet) => {
    return chalet && chalet.city && chalet.city.name ? chalet.city.name : '';
  };

  const getVillageName = (chalet) => {
    return chalet && chalet.village && chalet.village.name ? chalet.village.name : '';
  };

  const getMainImage = (chalet) => {
    return chalet && chalet.mainImg ? chalet.mainImg : 'https://via.placeholder.com/300x200?text=No+Image';
  };

  const WishlistSkeleton = () => (
    <Grid container spacing={4} justifyContent="center">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Skeleton variant="rectangular" width="100%" height={220} />
            <CardContent sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" height={35} width="80%" />
              <Skeleton variant="text" height={25} width="60%" />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                <Skeleton variant="text" width="28%" height={24} />
                <Skeleton variant="text" width="28%" height={24} />
                <Skeleton variant="text" width="28%" height={24} />
              </Box>
              <Skeleton variant="text" height={30} width="50%" />
            </CardContent>
            <CardActions>
              <Skeleton variant="rectangular" width={100} height={36} />
              <Skeleton variant="circular" width={40} height={40} sx={{ ml: 1 }} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (isPageLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom fontWeight="bold" color="primary">
          المفضلة
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <WishlistSkeleton />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
      <Paper
        elevation={3}
        sx={{ p: 3, mb: 4, borderRadius: 2, background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)' }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h3" component="h1" fontWeight="bold" color="primary">
            المفضلة
          </Typography>
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              color="primary"
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              العودة للرئيسية
            </Button>
            {wishlist.length > 0 && (
              <Button
                startIcon={<ClearAllIcon />}
                color="error"
                variant="outlined"
                onClick={handleClearAll}
                disabled={isLoading}
              >
                مسح الكل
              </Button>
            )}
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {isLoading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        )}

        {!isLoading && wishlist.length === 0 && (
          <Alert
            severity="info"
            sx={{ p: 3, borderRadius: 2, fontSize: '1.1rem', '& .MuiAlert-icon': { fontSize: '2rem' } }}
          >
            قائمة المفضلة فارغة. قم بإضافة بعض الشاليهات للمفضلة!
          </Alert>
        )}

        {!isLoading && wishlist.length > 0 && (
          <Fade in timeout={800}>
            <Grid container spacing={4} justifyContent="center">
              {wishlist.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card
                    sx={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height={220}
                        image={getMainImage(item)}
                        alt={item.name || 'شاليه'}
                        sx={{ objectFit: 'cover', height: '220px' }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          '&:hover': { backgroundColor: 'rgba(255,0,0,0.2)' }
                        }}
                        onClick={() => handleRemoveItem(item)}
                        disabled={isLoading}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                        {item.name || 'شاليه'}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {getCityName(item)}{getVillageName(item) ? `, ${getVillageName(item)}` : ''}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                        الكود: {item.code || 'غير متوفر'}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2">
                          <span role="img" aria-label="bedrooms">🛏️</span> {item.bedrooms || 0} غرف
                        </Typography>
                        <Typography variant="body2">
                          <span role="img" aria-label="bathrooms">🚿</span> {item.bathrooms || 0} حمام
                        </Typography>
                        <Typography variant="body2">
                          <span role="img" aria-label="guests">👥</span> {item.guests || 0} ضيف
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {item.price || '0'} جنية / ليلة
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewDetails(item._id)}
                        sx={{ borderRadius: '20px' }}
                      >
                        عرض التفاصيل
                      </Button>
                     
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}
      </Paper>
    </Container>
  );
};

export default WishlistPage;