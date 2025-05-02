import React, { useState } from 'react';
import { 
  Card, 
  CardActionArea, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Stack,
  Tooltip,
  styled
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  LocationOn, 
  Person, 
  Hotel, 
  Pool,
  Wifi,
  AcUnit
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from '../context/MyContext';
import { useTheme } from '@mui/material/styles';

// Styled components
const PriceTag = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: '4px 12px',
  borderRadius: 20,
  fontWeight: 'bold',
  zIndex: 2,
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'center'
}));

const ImageContainer = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
    zIndex: 1
  }
});

const HoverCardMedia = styled(CardMedia)(({ isHovered }) => ({
  height: 220,
  width: '350px',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
  transform: isHovered ? 'scale(1.05)' : 'scale(1)'
}));


const ChaletCard = ({ chalet, inWishlist = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToWishlist, removeFromWishlist } = useMyContext();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleViewDetails = () => {
    navigate(`/chalet/${chalet._id}`);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(chalet._id);
    } else {
      addToWishlist(chalet);
    }
  };

  // Function to render featured amenities icons
const renderFeatureIcons = (features) => {
  const iconMap = {
    'pool': <Pool fontSize="small" />,
    'wifi': <Wifi fontSize="small" />,
    'ac': <AcUnit fontSize="small" />
  };
    return features.slice(0, 3).map((feature, index) => (
      <Tooltip key={index} title={feature.name || feature} arrow>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mr: 2, 
          color: 'primary.main',
          '& svg': { mr: 0.5 }
        }}>
          {iconMap[feature.code] || null}
          <Typography variant="caption">
            {feature.name || feature}
          </Typography>
        </Box>
      </Tooltip>
    ));
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: isHovered ? 4 : 2,
        transition: 'box-shadow 0.3s ease-in-out',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ImageContainer>
        {/* Price Tag */}
        <PriceTag>
          <Typography component="span" fontWeight="bold">
            {chalet.price} ج.م
          </Typography>
          <Typography component="span" variant="caption" sx={{ mr: 0.5, opacity: 0.9 }}>
            / ليلة
          </Typography>
        </PriceTag>

        {/* Wishlist button
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': { backgroundColor: 'white' },
            zIndex: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          onClick={handleWishlistToggle}
        >
          {inWishlist ? (
            <Favorite color="error" />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton> */}

        <HoverCardMedia
          component="img"
          image={chalet.mainImg || '/placeholder-chalet.jpg'}
          alt={chalet.name}
          isHovered={isHovered}
        />
      </ImageContainer>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap align="right" fontWeight="bold">
          {chalet.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, justifyContent: 'flex-end' }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {chalet.city?.name}{chalet.village?.name ? ` - ${chalet.village.name}` : ''}
          </Typography>
          <LocationOn color="primary" fontSize="small" sx={{ mr: 0.5 }} />
        </Box>
        
        <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: 'flex-end', textAlign: 'right' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2">{chalet.bedrooms} غرفة</Typography>
            <Hotel color="primary" fontSize="small" sx={{ mr: 0.5 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2">{chalet.guests} ضيف</Typography>
            <Person color="primary" fontSize="small" sx={{ mr: 0.5 }} />
          </Box>
        </Stack>
        
        {chalet.features && chalet.features.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {renderFeatureIcons(chalet.features)}
          </Box>
        )}
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <Button 
          fullWidth
          variant="contained" 
          color="primary"
          onClick={handleViewDetails}
          sx={{ 
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: 1.5
          }}
        >
          عرض التفاصيل
        </Button>
      </Box>
    </Card>
  );
};

export default ChaletCard;