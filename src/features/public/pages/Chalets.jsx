// src/components/Chalets.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Pagination,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Loader from '../../../shared/components/Loader';
import ChaletCard from '../../../shared/components/ChaletCard/ChaletCard';
import VillageHeader from '../components/VillageHeader';
import CityHeader from '../components/CityHeader';
import { useApiContext } from '../../../shared/context/api.context';

const Chalets = () => {
  const { axiosInstance, isLoading, setIsLoading } = useApiContext();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const cityId = searchParams.get('city') || '';
  const villageId = searchParams.get('village') || '';
  const [page, setPage] = useState(1);
  const [totalPages, setTotal] = useState(1);
  const [chalets, setChalets] = useState([]);
  const [villageData, setVillageData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [villageLoading, setVillageLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);

  // Fetch city data if cityId is provided
  useEffect(() => {
    const fetchCityData = async () => {
      if (!cityId) {
        setCityData(null);
        return;
      }
      
      setCityLoading(true);
      try {
        const { data } = await axiosInstance.get(`/city/${cityId}`);
        setCityData(data.data);
      } catch (error) {
        console.error('Error fetching city data:', error);
        setCityData(null);
      } finally {
        setCityLoading(false);
      }
    };
    
    fetchCityData();
  }, [cityId]);

  // Fetch village data if villageId is provided
  useEffect(() => {
    const fetchVillageData = async () => {
      if (!villageId) {
        setVillageData(null);
        return;
      }
      
      setVillageLoading(true);
      try {
        const { data } = await axiosInstance.get(`/village/${villageId}`);
        setVillageData(data.data);
      } catch (error) {
        console.error('Error fetching village data:', error);
        setVillageData(null);
      } finally {
        setVillageLoading(false);
      }
    };
    
    fetchVillageData();
  }, [villageId]);

  // Fetch chalets
  useEffect(() => {
    const fetchChalets = async () => {
      setIsLoading(true);
      try {
        const qs = new URLSearchParams({
          ...(cityId && { city: cityId }),
          ...(villageId && { village: villageId }),
          page: page.toString()
        }).toString();
        
        const { data } = await axiosInstance.get(`/chalet?${qs}`);
        setChalets(data.data);
        setTotal(data.totalPages);
      } catch (error) {
        console.error('Error fetching chalets:', error);
        setChalets([]);
        setTotal(1);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChalets();
  }, [cityId, villageId, page]);

  const handleChangePage = (_, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ py: 4 }}>
      {/* City Header Section */}
      {cityLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Loader />
        </Box>
      ) : (
        cityData && <CityHeader cityData={cityData} />
      )}

      {/* Village Header Section */}
      {villageLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Loader />
        </Box>
      ) : (
        villageData && <VillageHeader villageData={villageData} />
      )}

      {/* Chalets Section */}
      <Container maxWidth="lg">
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

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <Loader />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} justifyContent="center" sx={{ mb: 3 }}>
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
      </Container>
    </Box>
  );
};

export default Chalets;
