// src/pages/CitiesPage.jsx
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
import Loader from '../components/Loader';
import { MyContext } from '../context/MyContext';

const CitiesPage = () => {
  const { axiosInstance } = useContext(MyContext);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/city')
      .then(res => {
        setCities(res.data.data);
        setError('');
      })
      .catch(() => setError('فشل في جلب المدن'))
      .finally(() => setLoading(false));
  }, [axiosInstance]);

  if (loading) return <Loader />;
  if (error)   return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        اكتشف مدننا الساحرة
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
        اختر المدينة التي تود قضاء إجازتك فيها واستمتع بأفضل الشاليهات
      </Typography>
      <Grid container spacing={4}>
        {cities.map(city => (
          <Grid item xs={12} sm={6} md={4} key={city._id}>
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
                image={city.img}
                alt={city.name}
                sx={{
                  height: 220,
                  objectFit: 'cover',
                  width:"300px"
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{city.name}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {city.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  fullWidth
                  onClick={() => navigate(`/chalets?city=${city._id}`)}
                >
                  رؤية شاليهات المدينة
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CitiesPage;
