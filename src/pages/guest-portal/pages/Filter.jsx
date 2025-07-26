// src/pages/Filter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Grid, Card, Pagination, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMyContext } from '../../../context/MyContext';
import { useApiContext } from '../../../context/ApiContext';
import FilterPanel from '../../../components/FilterPanel';
import ChaletCard from '../../../components/features/ChaletCard/ChaletCard';
import Loader from '../../../components/Loader';
import ChaletSessionStroage from '../services/ChaletSessionStroage.service';
import ChaletService from '../../../services/Chalet.service';

const Filter = () => {
  const { axiosInstance, isLoading, setIsLoading } = useApiContext();
  const _ChaletService = new ChaletService(axiosInstance);
  const { filters, updateFilters } = useMyContext();
  const _ChaletSessionStroage = ChaletSessionStroage();

  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [filteredChalets, setFilteredChalets] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Ref to track if this is the first load
  const isFirstLoad = useRef(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Check if filters are empty (for reset detection)
  const areFiltersEmpty = (filtersObj) => {
    return Object.keys(filtersObj).length === 0 ||
      Object.values(filtersObj).every(value =>
        value === '' || value === null || value === undefined
      );
  };

  // Save scroll position before navigation
  const saveScrollPosition = () => {
    const scrollPosition = window.pageYOffset;
    _ChaletSessionStroage.saveScrollPosition(scrollPosition);
  };

  // Restore scroll position
  const restoreScrollPosition = (position) => {
    setTimeout(() => {
      window.scrollTo(0, position);
      // Clear the saved scroll position after restoring
      _ChaletSessionStroage.removeScrollPostion()
    }, 100);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    _ChaletSessionStroage.saveAll(filters, newPage);

    // Smooth scroll to chalets section
    const chaletsSection = document.getElementById('chalets-section');
    if (chaletsSection) {
      chaletsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Fetch chalets with pagination
  const fetchChalets = async (currentPage = 1, currentFilters = {}) => {
    const isInitialFetch = !isInitialized && Object.keys(currentFilters).length === 0;

    if (isInitialFetch) {
      setIsLoading(true);
    } else {
      setIsLoadingResults(true);
    }

    try {
      // Convert filters object to URL parameters
      const params = new URLSearchParams();

      // Add pagination parameters
      params.append('page', currentPage);
      params.append('limit', '8'); // يمكنك تغيير العدد حسب احتياجك

      // Add any active filters
      Object.entries(currentFilters).forEach(([key, value]) => {
        if(Array.isArray(value)){
          if(value.length) params.append(key, value);
        }
        else if (value !== '' && value !== null && value !== undefined) {
          params.append(key, value);
        }
      });

      const { success, data, message } = await _ChaletService.getAllChalets(params);
      // const response = await axiosInstance.get(`/chalet?${params.toString()}`);

      if (!success) {
        console.log(message);
        return
      }

      setFilteredChalets(data.data);
      setTotalPages(data.totalPages || 1);
      setTotalResults(data.total || 0);

      // Save current state to session storage
      _ChaletSessionStroage.saveAll(currentFilters, currentPage);

    } finally {
      setIsLoading(false);
      setIsLoadingResults(false);
      if (!isInitialized) {
        setIsInitialized(true);
      }
    }
  };

  // Initialize from session storage on mount
  useEffect(() => {
    const initialize = async () => {
      const { filters: savedFilters, page: savedPage, scrollPosition } = _ChaletSessionStroage.loadAll();

      // If we have saved filters, restore them to context
      if (Object.keys(savedFilters).length > 0) {
        updateFilters(savedFilters);
      }

      // Set the saved page
      setPage(savedPage);

      // Fetch chalets with saved data or defaults
      await fetchChalets(savedPage, savedFilters);

      // Restore scroll position if returning from chalet details
      if (scrollPosition > 0) {
        restoreScrollPosition(scrollPosition);
      }

      isFirstLoad.current = false;
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add event listener to save scroll position before navigation
  useEffect(() => {
    const handleBeforeUnload = () => {

      saveScrollPosition();
    };

    // Listen for when user navigates to chalet details
    const handleLinkClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.href.includes('/chalet/')) {
        saveScrollPosition();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  // Fetch filtered chalets whenever filters change (except on initial load)
  useEffect(() => {
    // Skip if this is the initial mount or still isLoading
    if (isFirstLoad.current || isLoading) return;

    // If filters are reset (empty), clear session storage
    if (areFiltersEmpty(filters)) {
      _ChaletSessionStroage.clear();
      setPage(1);
      fetchChalets(1, {});
    } else {
      // Reset to page 1 when filters change
      setPage(1);
      const timerId = setTimeout(() => {
        fetchChalets(1, filters);
      }, 300); // Debounce API calls

      return () => clearTimeout(timerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Fetch chalets when page changes (but not on initial mount)
  useEffect(() => {
    // Don't refetch if it's the initial render, still isLoading, or first load
    if (isFirstLoad.current || isLoading || !isInitialized) return;

    const timerId = setTimeout(() => {
      fetchChalets(page, filters);
    }, 100);

    return () => clearTimeout(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (isLoading) return <Loader />;

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      <Typography variant="h4" align="center" gutterBottom color="primary" sx={{ mb: 4 }}>
        ابحث عن شاليهك المثالي
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Filter Panel - Fixed while scrolling */}
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
          {isLoadingResults ? (
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