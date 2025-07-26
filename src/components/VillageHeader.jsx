import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery,
  Modal,
  IconButton
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const VillageHeader = ({ villageData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  if (!villageData) return null;
  
  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const navigateImage = (direction) => {
    if (direction === 'next') {
      setSelectedImageIndex((prev) => 
        prev === villageData.imgs.length - 1 ? 0 : prev + 1
      );
    } else {
      setSelectedImageIndex((prev) => 
        prev === 0 ? villageData.imgs.length - 1 : prev - 1
      );
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mb: 6, mt: 2 }}>
      <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Village main image */}
        <CardMedia
          component="img"
          height="300"
          image={villageData.img}
          alt={villageData.name}
          sx={{ objectFit: 'cover' }}
        />
        
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                  {villageData.name}
                </Typography>
                
                <Box display="flex" alignItems="center">
                  <LocationOnIcon color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" color="text.secondary">
                    {villageData.city?.name || 'المدينة غير متوفرة'}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body1" color="text.secondary" paragraph>
                {villageData.description}
              </Typography>
            </Grid>
            
            {/* Village features section */}
            {villageData.features && villageData.features.length > 0 && (
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    fontWeight="bold"
                    sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                  >
                    <FeaturedPlayListIcon sx={{ mr: 1 }} color="primary" />
                    مميزات القرية
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {villageData.features.map((value) => (
                      <Grid item xs={12} sm={6} md={4} key={value._id}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              {value.feature.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {value.feature.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {value.price ? value.price + " " + "جنية": "مجاني"}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
            )}
            
            {/* Village gallery section */}
            {villageData.imgs && villageData.imgs.length > 0 && (
              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  fontWeight="bold"
                  sx={{ mb: 2 }}
                >
                  معرض الصور
                </Typography>
                
                <Box sx={{ 
                  '.swiper-pagination-bullet-active': { 
                    backgroundColor: theme.palette.primary.main 
                  },
                  '.swiper-button-next, .swiper-button-prev': {
                    color: theme.palette.primary.main,
                    '&:after': {
                      fontSize: isMobile ? '24px' : '32px'
                    }
                  }
                }}>
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={10}
                    slidesPerView={isMobile ? 1 : 3}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    style={{ borderRadius: '8px', overflow: 'hidden' }}
                  >
                    {villageData.imgs.map((img, index) => (
                      <SwiperSlide key={index}>
                        <Box 
                          component="img" 
                          src={img} 
                          alt={`${villageData.name} - صورة ${index + 1}`} 
                          sx={{ 
                            width: '100%', 
                            height: '220px', 
                            objectFit: 'cover',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'transform 0.3s',
                            '&:hover': {
                              transform: 'scale(1.03)',
                            }
                          }} 
                          onClick={() => openImageModal(index)}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Full Screen Image Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="fullscreen-image-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'rgba(0, 0, 0, 0.9)'
        }}>
          {/* Close button */}
          <IconButton 
            sx={{ 
              position: 'absolute', 
              top: 16, 
              right: 16, 
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.5)',
              }
            }}
            onClick={handleModalClose}
          >
            <CloseIcon sx={{ color: 'white' }} />
          </IconButton>

          {/* Navigation controls */}
          <IconButton 
            sx={{ 
              position: 'absolute', 
              left: { xs: 8, md: 32 }, 
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.5)',
              }
            }}
            onClick={() => navigateImage('prev')}
          >
            <ArrowBackIcon sx={{ color: 'white', fontSize: { xs: 24, md: 32 } }} />
          </IconButton>
          
          <IconButton 
            sx={{ 
              position: 'absolute', 
              right: { xs: 8, md: 32 }, 
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.5)',
              }
            }}
            onClick={() => navigateImage('next')}
          >
            <ArrowForwardIcon sx={{ color: 'white', fontSize: { xs: 24, md: 32 } }} />
          </IconButton>

          {/* Image counter */}
          <Typography 
            variant="body2" 
            sx={{ 
              position: 'absolute', 
              bottom: 16, 
              left: '50%', 
              transform: 'translateX(-50%)',
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              px: 2,
              py: 0.5,
              borderRadius: 1
            }}
          >
            {selectedImageIndex + 1} / {villageData.imgs.length}
          </Typography>

          {/* The image */}
          <Box
            component="img"
            src={villageData.imgs[selectedImageIndex]}
            alt={`${villageData.name} - صورة ${selectedImageIndex + 1}`}
            sx={{
              maxHeight: '90vh',
              maxWidth: '90vw',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Modal>
    </Container>
  );
};

export default VillageHeader;
