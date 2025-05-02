// src/pages/Filter.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, Pagination, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMyContext } from '../context/MyContext';
import FilterPanel from '../components/FilterPanel';
import ChaletCard from '../components/ChaletCard';
import Loader from '../components/Loader';

const Filter = () => {
  const { axiosInstance, filters } = useMyContext();
  const [loading, setLoading] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [filteredChalets, setFilteredChalets] = useState([]);
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    window.scrollTo({
      top: document.getElementById('chalets-section').offsetTop - 100,
      behavior: 'smooth'
    });
  };

  // Fetch chalets with pagination
  const fetchChalets = async (currentPage = 1, currentFilters = {}) => {
    const isInitialFetch = Object.keys(currentFilters).length === 0;
    
    isInitialFetch ? setLoading(true) : setLoadingResults(true);
    
    try {
      // Convert filters object to URL parameters
      const params = new URLSearchParams();
      
      // Add pagination parameters
      params.append('page', currentPage);
      
      // Add any active filters
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, value);
        }
      });
      
      const response = await axiosInstance.get(`/chalet?${params.toString()}`);
      
      if (response.data.success) {
        setFilteredChalets(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setTotalResults(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching chalets:', error);
    } finally {
      setLoading(false);
      setLoadingResults(false);
    }
  };

  // Fetch initial chalets on mount
  useEffect(() => {
    fetchChalets(1, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch filtered chalets whenever filters change
  useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1);
    
    const timerId = setTimeout(() => {
      fetchChalets(1, filters);
    }, 300);
    
    return () => clearTimeout(timerId);
  }, [filters]);
  
  // Fetch chalets when page changes
  useEffect(() => {
    // Don't refetch if it's the initial render
    if (loading) return;
    
    const timerId = setTimeout(() => {
      fetchChalets(page, filters);
    }, 300);
    
    return () => clearTimeout(timerId);
  }, [page]);

  if (loading) return <Loader />;

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      <Typography variant="h4" align="center" gutterBottom color="primary" sx={{ mb: 4 }}>
        ابحث عن شاليهك المثالي
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Filter Panel - Now fixed while scrolling */}
        <Box
          sx={{
            width: { xs: '100%', md: '35%' },
            position: { xs: 'static', md: 'sticky' },
            top: '100px',
            left: { md: '0' },
            height: 'fit-content',
            maxHeight: { md: 'calc(100vh - 120px)' },
            overflowY: { md: 'auto' },
            zIndex: 10,
            order: { xs: 1, md: 1 },
            mb: { xs: 3, md: 0 },
            pr: { md: 3 }
          }}
        >
          <FilterPanel />
        </Box>
        
        {/* Main Content - Chalets with Pagination */}
        <Box 
          sx={{ 
            flexGrow: 1,
            width: { xs: '100%', md: '65%' },
            order: { xs: 2, md: 2 }
          }}
          id="chalets-section"
        >
          {loadingResults ? (
            <Box display="flex" justifyContent="center" my={4}>
              <Loader />
            </Box>
          ) : (
            <>
              {/* Results summary */}
              {totalResults > 0 && (
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {totalResults} نتيجة • صفحة {page} من {totalPages}
                </Typography>
              )}
              
              {/* Chalets Grid */}
              <Grid 
                container 
                spacing={3} 
                justifyContent="flex-start"
                sx={{ mb: 3 }}
              >
                {filteredChalets.length > 0 ? (
                  filteredChalets.map((chalet) => (
                    <Grid
                      item
                      key={chalet._id}
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      sx={{
                        display: 'flex',
                        height: '100%'
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
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
                    <Card 
                      elevation={0} 
                      sx={{ 
                        p: 4, 
                        textAlign: 'center', 
                        borderRadius: '16px', 
                        bgcolor: 'rgba(255,107,16,0.05)'
                      }}
                    >
                      <Typography variant="h6" color="text.secondary">
                        لم نجد شاليهات مطابقة
                      </Typography>
                    </Card>
                  </Grid>
                )}
              </Grid>
              
              {/* Pagination */}
              {filteredChalets.length > 0 && totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={5}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Filter;