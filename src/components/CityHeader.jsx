// src/components/CityHeader.jsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';

const CityHeader = ({ cityData }) => {
  if (!cityData) return null;

  return (
    <Box sx={{ mb: 6, backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* City image background */}
          {cityData.img && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '200px',
                backgroundImage: `url(${cityData.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)'
                }
              }}
            />
          )}

          {/* City content */}
          <Box
            sx={{
              pt: cityData.img ? '160px' : 0,
              position: 'relative',
              zIndex: 1
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              color="primary"
              align="center"
              sx={{ mb: 2 }}
            >
              {cityData.name}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Chip
                icon={<LocationOnIcon />}
                label={`${cityData.region || 'المنطقة'}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 'bold', mx: 1 }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* City description */}
            {cityData.description && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  fontWeight="bold"
                  sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
                >
                  <InfoIcon sx={{ mr: 1 }} /> عن المدينة
                </Typography>
                <Typography variant="body1" paragraph>
                  {cityData.description}
                </Typography>
              </Box>
            )}

            {/* Additional city information */}
            {cityData.additionalInfo && (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {Object.entries(cityData.additionalInfo).map(([key, value]) => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: 'background.default',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        {key}
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {value}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CityHeader;
