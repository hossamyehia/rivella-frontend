import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Fade,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  InputAdornment
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SearchIcon from '@mui/icons-material/Search';
import BedIcon from '@mui/icons-material/Bed';
import ClearIcon from '@mui/icons-material/Clear';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';

import { MyContext } from '../context/MyContext';
import ChaletCard from '../components/ChaletCard';
import Loader from '../components/Loader';

// Swiper React bindings
import { Swiper, SwiperSlide } from 'swiper/react';

// Swiper modules
import { Navigation, Pagination as SwiperPagination, Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const Home = () => {
  const { axiosInstance } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    cities: 0,
    villages: 0,
    chalets: 0
  });
  const [featuredChalets, setFeaturedChalets] = useState([]);
  const [popularChalets, setPopularChalets] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // For sticky search container
  const [isSticky, setIsSticky] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [cities, setCities] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [filteredChalets, setFilteredChalets] = useState([]);

  // Hero slider data
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      title: "تمتع بأجمل إطلالة على الشاطئ",
      subtitle: "شاليهات فاخرة بإطلالات مباشرة على البحر"
    },
    {
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      title: "استمتع بأجواء الراحة والاسترخاء",
      subtitle: "تصميمات داخلية عصرية توفر أقصى درجات الراحة"
    },
    {
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      title: "قضاء أوقات عائلية لا تُنسى",
      subtitle: "شاليهات مجهزة بالكامل لاستضافة العائلة والأصدقاء"
    }
  ];

  // Setup scroll event listener for sticky search container
  useEffect(() => {
    const handleScroll = () => {
      const searchContainer = document.getElementById('search-container');
      if (searchContainer) {
        const triggerHeight = window.innerHeight * 0.7; // Show sticky after 70% of hero section
        setIsSticky(window.scrollY > triggerHeight);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch cities and villages
  useEffect(() => {
    const fetchCitiesAndVillages = async () => {
      try {
        const citiesRes = await axiosInstance.get('/city');
        if (citiesRes.data.success) {
          setCities(citiesRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    
    fetchCitiesAndVillages();
  }, [axiosInstance]);

  // Fetch villages when city changes
  useEffect(() => {
    const fetchVillages = async () => {
      if (selectedCity) {
        try {
          const villagesRes = await axiosInstance.get(`/village?city=${selectedCity}`);
          if (villagesRes.data.success) {
            setVillages(villagesRes.data.data);
          }
        } catch (error) {
          console.error('Error fetching villages:', error);
        }
      } else {
        setVillages([]);
      }
      setSelectedVillage('');
    };
    
    fetchVillages();
  }, [selectedCity, axiosInstance]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch statistics
        const statsResponse = await axiosInstance.get('/chalet/stats');
        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
        }

        // Fetch featured chalets
        const chaletsResponse = await axiosInstance.get('/chalet');
        if (chaletsResponse.data.success) {
          setFeaturedChalets(chaletsResponse.data.data);
        }

        // Fetch popular chalets (assuming you have this endpoint, if not you can modify the filter)
        const popularResponse = await axiosInstance.get('/chalet?limit=20&sort=-rating');
        if (popularResponse.data.success) {
          setPopularChalets(popularResponse.data.data);
          setFilteredChalets(popularResponse.data.data);
          setTotalPages(Math.ceil(popularResponse.data.total / 15));
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [axiosInstance]);

  // Fetch chalets with pagination
  useEffect(() => {
    const fetchChalets = async () => {
      try {
        setLoading(true);
        let url = `/chalet?page=${page}&limit=15`;
        
        if (selectedCity) url += `&city=${selectedCity}`;
        if (selectedVillage) url += `&village=${selectedVillage}`;
        if (bedrooms) url += `&bedrooms=${bedrooms}`;
        
        const response = await axiosInstance.get(url);
        if (response.data.success) {
          setFilteredChalets(response.data.data);
          setTotalPages(Math.ceil(response.data.total / 15));
        }
      } catch (error) {
        console.error('Error fetching chalets:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChalets();
  }, [page, selectedCity, selectedVillage, bedrooms, axiosInstance]);

  // Setup auto slide for hero slider
  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
    }, 5000);

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [heroSlides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
    // Reset timer
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
      }, 5000);
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + heroSlides.length) % heroSlides.length);
    // Reset timer
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
      }, 5000);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    // Reset timer
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
      }, 5000);
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
    window.scrollTo({
      top: document.getElementById('chalets-section').offsetTop - 100,
      behavior: 'smooth'
    });
  };

  const handleFilter = () => {
    setPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCity('');
    setSelectedVillage('');
    setBedrooms('');
    setPage(1);
  }; 
  

  if (loading && !featuredChalets.length) {
    return <Loader />;
  }

  // Search container component - will be used in both regular and sticky positions
  const SearchContainer = ({ isSticky = false }) => (
    <Paper 
      elevation={isSticky ? 6 : 4} 
      sx={{ 
        p: { xs: 2, md: 4 }, 
        borderRadius: isSticky ? '0 0 16px 16px' : '20px', 
        backgroundColor: 'white',
        boxShadow: isSticky ? '0 5px 20px rgba(0,0,0,0.2)' : '0 10px 40px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(20px)',
        zIndex: 10,
        width: isSticky ? '100%' : 'auto',
        transition: 'all 0.2s ease',
        animation: isSticky ? 'slideDown 0.1s ease' : 'none',
        '@keyframes slideDown': {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: 0
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: 1
          }
        }
      }}
    >
      <Typography 
        variant={isSticky ? "h6" : "h5"} 
        component="h2" 
        mb={isSticky ? 2 : 3} 
        fontWeight="bold" 
        textAlign="center" 
        color="primary"
      >
        <MapsHomeWorkIcon sx={{ 
          mr: 1, 
          verticalAlign: 'middle',
          fontSize: isSticky ? '1.5rem' : '2rem',
        }} />
        ابحث عن شاليهك المفضل
      </Typography>
      
      <Grid container spacing={isSticky ? 2 : 3} justifyContent="center">
        <Grid item xs={12} md={isSticky ? 3 : 4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="city-label">المدينة</InputLabel>
            <Select
              labelId="city-label"
              value={selectedCity}
              label="المدينة"
              onChange={(e) => setSelectedCity(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <LocationCityIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              }
              sx={{
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  borderWidth: '2px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.light,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                fontSize: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
              }}
            >
              <MenuItem value="">
                <em>اختر المدينة</em>
              </MenuItem>
              {cities.map((city) => (
                <MenuItem key={city._id} value={city._id}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={isSticky ? 3 : 4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="village-label">القرية</InputLabel>
            <Select
              labelId="village-label"
              value={selectedVillage}
              label="القرية"
              onChange={(e) => setSelectedVillage(e.target.value)}
              disabled={!selectedCity}
              startAdornment={
                <InputAdornment position="start">
                  <HolidayVillageIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              }
              sx={{
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  borderWidth: '2px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.light,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                fontSize: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
              }}
            >
              <MenuItem value="">
                <em>اختر القرية</em>
              </MenuItem>
              {villages.map((village) => (
                <MenuItem key={village._id} value={village._id}>
                  {village.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={isSticky ? 3 : 4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="bedrooms-label">عدد غرف النوم</InputLabel>
            <Select
              labelId="bedrooms-label"
              value={bedrooms}
              label="عدد غرف النوم"
              onChange={(e) => setBedrooms(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <BedIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              }
              sx={{
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  borderWidth: '2px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.light,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                fontSize: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
              }}
            >
              <MenuItem value="">
                <em>اختر عدد الغرف</em>
              </MenuItem>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={isSticky ? 3 : 12} sx={{ mt: { xs: 1, md: isSticky ? 0 : 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, height: '100%' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleFilter}
              startIcon={<SearchIcon />}
              fullWidth={!isSticky}
              sx={{ 
                px: 3, 
                py: 1.5, 
                borderRadius: '12px', 
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                textTransform: 'none',
                fontWeight: 'bold',
                flex: isSticky ? 1 : 'auto',
                maxWidth: isSticky ? '100%' : '180px',
                height: isSticky ? '100%' : 'auto',
                '&:hover': {
                  boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              بحث
            </Button>
            {!isSticky && (
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={handleResetFilters}
                startIcon={<ClearIcon />}
                sx={{ 
                  px: 3, 
                  py: 1.5, 
                  borderRadius: '12px', 
                  fontSize: '1rem',
                  borderWidth: '2px',
                  maxWidth: '150px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderWidth: '2px',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                مسح
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Sticky Search Container - Only shows after scrolling */}
      {isSticky && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1100,
            width: '100%',
          }}
        >
          <SearchContainer isSticky={true} />
        </Box>
      )}

      {/* Hero Section with Dynamic Slider */}
      <Box sx={{ position: 'relative', height: { xs: '60vh', md: '80vh' }, overflow: 'hidden' }}>
        {heroSlides.map((slide, index) => (
          <Fade 
            key={index} 
            in={currentSlide === index} 
            timeout={1000}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%',
              display: currentSlide === index ? 'block' : 'none'
            }}
          >
            <Box
              sx={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Container maxWidth="lg">
                <Box
                  sx={{
                    textAlign: 'center',
                    color: 'white',
                    py: 4,
                    px: 2,
                    backdropFilter: 'blur(5px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '16px',
                    maxWidth: '800px',
                    mx: 'auto'
                  }}
                >
                  <Typography variant="h2" component="h1" fontWeight="bold" mb={2}>
                    {slide.title}
                  </Typography>
                  <Typography variant="h5" component="h2" mb={4}>
                    {slide.subtitle}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    component={Link}
                    to="/filter"
                    sx={{ 
                      borderRadius: '12px', 
                      px: 4, 
                      py: 1.5, 
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ابحث عن شاليه الآن
                  </Button>
                </Box>
              </Container>
            </Box>
          </Fade>
        ))}

        {/* Slider controls */}
        <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
          {heroSlides.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: currentSlide === index ? theme.palette.primary.main : 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)'
                }
              }}
            />
          ))}
        </Box>

        <IconButton
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
          }}
          onClick={handlePrevSlide}
        >
          <NavigateBeforeIcon />
        </IconButton>
        <IconButton
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
          }}
          onClick={handleNextSlide}
        >
          <NavigateNextIcon />
        </IconButton>
      </Box>

      {/* Regular Search Container at top of content */}
      <Container maxWidth="md" sx={{ my: 4, position: 'relative' }} id="search-container">
        <Box 
          sx={{ 
            transform: 'translateY(-50px)',
            position: 'relative',
            mx: 'auto'
          }}
        >
          <SearchContainer />
        </Box>
      </Container>

      <Container maxWidth="lg">
        {/* Featured Chalets Swiper */}
        <Box mb={8} mt={0}>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom color="primary" fontWeight="bold" mb={4}>
            أفضل الشاليهات المميزة
          </Typography>
          
          {featuredChalets.length > 0 ? (
            <Swiper
              modules={[Navigation, SwiperPagination, Autoplay]}
              spaceBetween={25}
              slidesPerView={isMobile ? 1 : 4}
              
              autoplay={{ delay: 1000, disableOnInteraction: false }}
              loop={true}
              style={{ padding: '10px 5px 40px' }}
            >
              {featuredChalets.slice(0, 10).map((chalet) => (
                <SwiperSlide key={chalet._id}>
                  <Box sx={{ height: '100%' }}>
                    <ChaletCard chalet={chalet} />
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Typography variant="body1" textAlign="center" color="text.secondary">
              لا توجد شاليهات متميزة حالياً
            </Typography>
          )}
        </Box>

        {/* Welcome Section */}
        <Box mb={8} textAlign="center">
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold" color="primary">
            مرحباً بك في ريڤيلا للشاليهات
          </Typography>
          <Typography variant="h6" component="p" color="text.secondary" mb={4} sx={{ maxWidth: '800px', mx: 'auto' }}>
            استمتع بتجربة فريدة من نوعها مع أفضل الشاليهات في المملكة. نوفر لك خيارات متنوعة تناسب جميع الأذواق والميزانيات.
          </Typography>
        </Box>

        {/* Statistics */}
        <Box mb={8}>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom color="primary" fontWeight="bold" mb={4}>
            إحصائيات عامة
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Card elevation={5} sx={{ borderRadius: '16px', height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 15px 30px rgba(0,0,0,0.15)' } }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <LocationCityIcon color="primary" sx={{ fontSize: 56, mb: 2 }} />
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {stats.cities}
                  </Typography>
                  <Typography variant="h6">مدينة</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={5} sx={{ borderRadius: '16px', height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 15px 30px rgba(0,0,0,0.15)' } }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <HolidayVillageIcon color="primary" sx={{ fontSize: 56, mb: 2 }} />
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {stats.villages}
                  </Typography>
                  <Typography variant="h6">قرية</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={5} sx={{ borderRadius: '16px', height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 15px 30px rgba(0,0,0,0.15)' } }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <HomeIcon color="primary" sx={{ fontSize: 56, mb: 2 }} />
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {stats.chalets}
                  </Typography>
                  <Typography variant="h6">شاليه</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Popular Chalets Section with Pagination - Improved Centered Grid Layout */}
        <Box mb={6} id="chalets-section">
          <Typography variant="h4" component="h2" color="primary" fontWeight="bold" mb={4}>
            الشاليهات الأكثر شعبية
          </Typography>
          
          {loading ? (
  <Loader />
) : (
  <>
    {filteredChalets.length > 0 ? (
      <Grid container spacing={3} justifyContent="center">
        {filteredChalets.map((chalet) => (
          <Grid item xs={12} sm={6} md={4} key={chalet._id} sx={{ display: 'flex', justifyContent: 'center' }}>
            <ChaletCard chalet={chalet} sx={{ width: '100%', maxWidth: '350px' }} />
          </Grid>
        ))}
      </Grid>
    ) : (
      <Typography variant="body1" textAlign="center" color="text.secondary">
        لا توجد شاليهات متوفرة بناءً على المعايير المحددة
      </Typography>
    )}
    
    {/* Pagination */}
    {totalPages > 1 && (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={handleChangePage} 
          color="primary"
          size={isMobile ? "small" : "large"}
          sx={{
            '& .MuiPaginationItem-root': {
              fontWeight: 'bold',
              borderRadius: '10px',
              mx: 0.5
            }
          }}
        />
      </Box>
    )}
  </>
)}
</Box>

      {/* Info Section with improved spacing and styling */}
      <Box mb={10} mt={6} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', py: 6, px: 4, borderRadius: '20px' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom color="primary" fontWeight="bold">
              لماذا تختار ريڤيلا للشاليهات؟
            </Typography>
            <Typography variant="body1" paragraph>
              تقدم منصة ريڤيلا للشاليهات تجربة حجز سلسة وآمنة مع أفضل الخيارات في جميع أنحاء المملكة.
            </Typography>
            <Typography variant="body1" paragraph>
              نسعى دائمًا لتقديم خدمة متميزة تضمن لك قضاء أوقات لا تُنسى مع العائلة والأصدقاء في أجمل الشاليهات والاستراحات.
            </Typography>
            <Box mt={3}>
              <Button 
                component={Link} 
                to="/about" 
                variant="contained" 
                color="primary"
                sx={{ 
                  px: 3, 
                  py: 1.5, 
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                تعرف علينا أكثر
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              backgroundColor: '#fff', 
              p: 3, 
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
            }}>
              <Typography variant="h5" component="h3" mb={2} color="primary" fontWeight="bold">
                مميزات الخدمة
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  حجز سريع وسهل لجميع الشاليهات المتاحة.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  دفع آمن مع خيارات متعددة للدفع الإلكتروني.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  تقييمات ومراجعات حقيقية من مستخدمي الخدمة.
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1.5 }}>
                  خدمة عملاء متاحة على مدار الساعة لمساعدتك.
                </Typography>
                <Typography component="li" variant="body1">
                  عروض وخصومات حصرية للمستخدمين المسجلين.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
    
    {/* CTA Section */}
    <Box 
      sx={{ 
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 10,
        mb: -4, // To remove bottom margin before footer
      }}
    >
      <Container maxWidth="md">
        <Box textAlign="center" color="white">
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            احجز شاليهك الآن
          </Typography>
          <Typography variant="h6" component="p" mb={4} sx={{ maxWidth: '700px', mx: 'auto' }}>
            لا تفوت فرصة الاستمتاع بأجمل الأوقات في شاليهات ريڤيلا. احجز الآن واستفد من العروض المتاحة!
          </Typography>
          <Button 
            component={Link} 
            to="/filter"
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ 
              px: 4, 
              py: 2, 
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
              textTransform: 'none',
              '&:hover': {
                transform: 'scale(1.05) translateY(-3px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            استكشف الشاليهات
          </Button>
        </Box>
      </Container>
    </Box>
  </Box>
);
};

export default Home;