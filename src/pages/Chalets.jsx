// src/components/Chalets.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Pagination,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Loader from '../components/Loader';
import { MyContext } from '../context/MyContext';
import ChaletCard from '../components/ChaletCard';
const Chalets = () => {
  const { axiosInstance } = useContext(MyContext);
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const cityId    = searchParams.get('city')    || '';
  const villageId = searchParams.get('village') || '';
  const [page, setPage]       = useState(1);
  const [totalPages, setTotal] = useState(1);
  const [chalets, setChalets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChalets = async () => {
      setLoading(true);
      try {
        const qs = new URLSearchParams({
          ...(cityId    && { city:    cityId }),
          ...(villageId && { village: villageId }),
          page: page.toString()
        }).toString();
        const { data } = await axiosInstance.get(`/chalet?${qs}`);
        setChalets(data.data);
        setTotal(data.totalPages);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchChalets();
  }, [cityId, villageId, page, axiosInstance]);

  const handleChangePage = (_, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box mb={6} id="chalets-section">
      <Typography 
        variant="h4" 
        component="h2" 
        color="primary" 
        fontWeight="bold" 
        mb={4}
        align="center"
      >
        الشاليهات المتاحة
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Loader />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} justifyContent="flex-start" sx={{ mb: 3 }}>
            {chalets.length > 0 ? (
              chalets.map(chalet => (
                <Grid
                  item
                  key={chalet._id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={4}
                  sx={{ display: 'flex', height: '100%' }}
                >
                  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <ChaletCard
                      chalet={chalet}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '420px'
                      }}
                    />
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" textAlign="center" color="text.secondary">
                  لا توجد شاليهات متاحة حالياً
                </Typography>
              </Grid>
            )}
          </Grid>

          {chalets.length > 0 && (
            <Box display="flex" justifyContent="center" mt={5}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChangePage}
                color="primary"
                size={isMobile ? 'medium' : 'large'}
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Chalets;
