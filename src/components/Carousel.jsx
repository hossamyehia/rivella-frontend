import React, { useState } from 'react';
import { 
  Box, 
  MobileStepper, 
  Button, 
  Paper,
  IconButton,
  Modal,
  Fade
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Close,
  ZoomIn
} from '@mui/icons-material';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';

const Carousel = ({ images = [] }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const maxSteps = images.length;

  // If no images, show placeholder
  const displayImages = images.length > 0 ? images : ['/placeholder-chalet.jpg'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Main Carousel */}
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <IconButton 
          size="small" 
          onClick={handleOpenModal} 
          sx={{ ml: 'auto', mr: 1 }}
          aria-label="zoom"
        >
          <ZoomIn />
        </IconButton>
      </Paper>
      
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {displayImages.map((image, index) => (
          <div key={index}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                component="img"
                sx={{
                  height: { xs: 255, sm: 400 },
                  display: 'block',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  width: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                }}
                src={image}
                alt={`صورة ${index + 1}`}
                onClick={handleOpenModal}
              />
            ) : null}
          </div>
        ))}
      </SwipeableViews>
      
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{ 
          borderBottomLeftRadius: 16, 
          borderBottomRightRadius: 16 
        }}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button 
            size="small" 
            onClick={handleBack} 
            disabled={activeStep === 0}
          >
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
          </Button>
        }
      />

      {/* Full Screen Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        aria-labelledby="fullscreen-image-modal"
        aria-describedby="fullscreen-view-of-chalet-image"
      >
        <Fade in={openModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '1000px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 1,
            borderRadius: 2,
          }}>
            <Box sx={{ position: 'relative' }}>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                  zIndex: 1
                }}
                onClick={handleCloseModal}
                size="large"
              >
                <Close />
              </IconButton>
              
              <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
              >
                {displayImages.map((image, index) => (
                  <div key={index}>
                    {Math.abs(activeStep - index) <= 2 ? (
                      <Box
                        component="img"
                        sx={{
                          display: 'block',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          width: '100%',
                          maxHeight: '80vh',
                          objectFit: 'contain',
                        }}
                        src={image}
                        alt={`صورة ${index + 1}`}
                      />
                    ) : null}
                  </div>
                ))}
              </SwipeableViews>
              
              <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                  <Button
                    size="small"
                    onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}
                  >
                    {theme.direction === 'rtl' ? (
                      <KeyboardArrowLeft />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                  </Button>
                }
                backButton={
                  <Button 
                    size="small" 
                    onClick={handleBack} 
                    disabled={activeStep === 0}
                  >
                    {theme.direction === 'rtl' ? (
                      <KeyboardArrowRight />
                    ) : (
                      <KeyboardArrowLeft />
                    )}
                  </Button>
                }
              />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Carousel;