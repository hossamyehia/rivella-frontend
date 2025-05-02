import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Container, 
  Button, 
  Paper,
  Divider
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../context/MyContext';
import Loader from '../components/Loader';

const WishList = () => {
  const { wishlist, removeFromWishlist, addToCart, isLoading } = useContext(MyContext);
  const navigate = useNavigate();

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <FavoriteIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          المفضلة
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {wishlist.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            لا توجد شاليهات في المفضلة
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/filter')}
            sx={{ mt: 2 }}
          >
            استعرض الشاليهات المتاحة
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {wishlist.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Paper 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'center', sm: 'flex-start' },
                  gap: 2 
                }}
              >
                <Box 
                  component="img"
                  src={item.mainImg}
                  alt={item.name}
                  sx={{ 
                    width: { xs: '100%', sm: 200 },
                    height: { xs: 180, sm: 120 },
                    objectFit: 'cover',
                    borderRadius: 2
                  }}
                />
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {item.city.name}، {item.village.name}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    {item.price} جنية / ليلة
                  </Typography>
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'row', md: 'column' },
                    gap: 1,
                    justifyContent: 'center', 
                    mt: { xs: 2, sm: 0 } 
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleMoveToCart(item)}
                    fullWidth
                    sx={{ minWidth: '150px' }}
                  >
                    نقل إلى السلة
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => removeFromWishlist(item.id)}
                    fullWidth
                    sx={{ minWidth: '150px' }}
                  >
                    حذف
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default WishList;