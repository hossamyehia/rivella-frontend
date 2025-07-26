// src/pages/VillagesPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Alert
} from '@mui/material';
import Loader from '../../../components/Loader';
// import { MyContext } from '../../../context/MyContext';
import { useApiContext } from '../../../context/ApiContext';
import VillageService from '../../../services/Village.service';

const VillagesPage = () => {
  const { axiosInstance } = useApiContext();
  const _VillageService = new VillageService(axiosInstance);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    _VillageService.getVillages()
      .then(res => {
        if(!res.success) throw res.message;
        setVillages(res.data.data);
        setError('');
      })
      .catch((message) => setError(message || 'فشل في جلب المدن'))
      .finally(() => setLoading(false));
  }, [axiosInstance]);

  if (loading) return <Loader />;
  if (error)   return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        استكشف قرانا الجميلة
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
        اختر القرية التي تناسبك وشاهد الشاليهات المتاحة فيها
      </Typography>
      <Grid container spacing={5}>
        {villages.map(village => (
          <Grid item xs={12} sm={6} md={4} key={village._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 3
              }}
            >
              <CardMedia
                component="img"
                image={village.img}
                alt={village.name}
                sx={{
                  height: 220,
                  objectFit: 'cover',
                  width:"300px"
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{village.name}</Typography>
              
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  تابع للمدينة: {village.city?.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  fullWidth
                  onClick={() => navigate(`/chalets?village=${village._id}`)}
                >
                  رؤية شاليهات القرية
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default VillagesPage;
