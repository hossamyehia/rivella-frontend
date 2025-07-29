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
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Fade,
  CardMedia,
  CardActions
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SearchIcon from '@mui/icons-material/Search';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';

import ChaletCard from '../../../components/features/ChaletCard/ChaletCard';
import Loader from '../../../components/Loader';

// Swiper React bindings
import { Swiper, SwiperSlide } from 'swiper/react';

// Swiper modules
import { Navigation, Pagination as SwiperPagination, Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useServicesContext } from '../../../context/ServicesContext';


const Home = () => {
  const { waitingCall, isLoading } = useServicesContext()
  const [stats, setStats] = useState({
    cities: 0,
    villages: 0,
    chalets: 0
  });
  const [featuredChalets, setFeaturedChalets] = useState([]);
  // const [popularChalets, setPopularChalets] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [cities, setCities] = useState([]);
  const [villages, setVillages] = useState([]);
  // const [selectedCity, setSelectedCity] = useState('');
  // const [selectedVillage, setSelectedVillage] = useState('');
  // const [bedrooms, setBedrooms] = useState('');
  // const [filteredChalets, setFilteredChalets] = useState([]);

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

  // Fetch cities and villages
  useEffect(() => {
    (async () => {
      //
      const [chaletsResponse, statsResponse, citiesResponse, villiagesResponse] = await Promise.all([
        waitingCall('LookupsService', 'getHomeChalets'),
        waitingCall('LookupsService', 'getStats'),
        waitingCall('LookupsService', 'getCities'),
        waitingCall('LookupsService', 'getVillages'),
      ])

      setFeaturedChalets(chaletsResponse.data.data);
      setStats(statsResponse.data.data);
      setCities(citiesResponse.data.data);
      setVillages(villiagesResponse.data.data);
    })()
  }, []);

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
      }, 10000);
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


  if (isLoading && !featuredChalets.length) {
    return <Loader />;
  }

  // Search container component - will be used in regular position only (not sticky)
  const SearchContainer = () => (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 2, md: 4 },
        borderRadius: '20px',
        backgroundColor: 'white',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(20px)',
        zIndex: 10,
        width: 'auto',
        transition: 'all 0.2s ease',
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        mb={3}
        fontWeight="bold"
        textAlign="center"
        color="primary"
      >
        <MapsHomeWorkIcon sx={{
          mr: 1,
          verticalAlign: 'middle',
          fontSize: '2rem',
        }} />
        ابحث عن شاليهك المفضل
      </Typography>

      <Grid container spacing={3} justifyContent="center">


        <Grid item xs={12} sm={12} sx={{ mt: { xs: 1, md: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, height: '100%' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              fullWidth
              component={Link}
              to="/filter"
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                textTransform: 'none',
                fontWeight: 'bold',

              }}
            >
              بحث
            </Button>

          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <Box sx={{ overflow: 'hidden' }}>
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
          <NavigateNextIcon />
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
          <NavigateBeforeIcon />
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

              autoplay={{ delay: 3000, disableOnInteraction: false }}
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
            مرحباً بك في Rivella Explore
          </Typography>
          <Typography variant="h6" component="p" color="text.secondary" mb={4} sx={{ maxWidth: '800px', mx: 'auto' }}>
            استمتع بتجربة فريدة من نوعها مع أفضل الشاليهات في مصر. نوفر لك خيارات متنوعة تناسب جميع الأذواق والميزانيات.
          </Typography>
        </Box>

        {/* Statistics - MODIFIED: Added links to specific routes */}
        <Box mb={8}>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom color="primary" fontWeight="bold" mb={4}>
            إحصائيات عامة
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Card
                component={Link}
                to="/cities"
                elevation={5}
                sx={{
                  borderRadius: '16px',
                  height: '100%',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.15)'
                  },
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
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
              <Card
                component={Link}
                to="/villages"
                elevation={5}
                sx={{
                  borderRadius: '16px',
                  height: '100%',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.15)'
                  },
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
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
              <Card
                component={Link}
                to="/filter"
                elevation={5}
                sx={{
                  borderRadius: '16px',
                  height: '100%',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.15)'
                  },
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
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
        {/* NEW: Cities Slider Section */}
        <Box mb={8}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
            color="primary"
            fontWeight="bold"
            mb={4}
          >
            مدننا الساحرة
          </Typography>

          {cities.length > 0 ? (
            <Swiper
              modules={[Navigation, SwiperPagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={isMobile ? 1 : 3}
              navigation
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={cities.length > 3}
              style={{ padding: '10px 5px 40px' }}
            >
              {cities.map(city => (
                <SwiperSlide key={city._id}>
                  <Card sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={city.img}
                      alt={city.name}
                    />
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">
                        {city.name}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                      <Button
                        component={Link}
                        to={`/chalets?city=${city._id}`}
                        size="small"
                        variant="contained"
                        color="primary"
                      >
                        عرض المدينة
                      </Button>
                    </CardActions>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Typography variant="body1" textAlign="center" color="text.secondary">
              لا توجد مدن متاحة حالياً
            </Typography>
          )}
        </Box>

        {/* NEW: Villages Slider Section */}
        <Box mb={8}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
            color="primary"
            fontWeight="bold"
            mb={4}
          >
            قُرانا الخلابة
          </Typography>

          {villages.length > 0 ? (
            <Swiper
              modules={[Navigation, SwiperPagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={isMobile ? 1 : 3}
              navigation
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={villages.length > 3}
              style={{ padding: '10px 5px 40px' }}
            >
              {villages.map(village => (
                <SwiperSlide key={village._id}>
                  <Card sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={village.img}
                      alt={village.name}
                    />
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">
                        {village.name}
                      </Typography>
                      {village.city?.name && (
                        <Typography variant="body2" color="text.secondary">
                          تتبع مدينة: {village.city.name}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                      <Button
                        component={Link}
                        to={`/chalets?village=${village._id}`}
                        size="small"
                        variant="contained"
                        color="primary"
                      >
                        عرض القرية
                      </Button>
                    </CardActions>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Typography variant="body1" textAlign="center" color="text.secondary">
              لا توجد قرى متاحة حالياً
            </Typography>
          )}
        </Box>

        {/* Info Section with improved spacing and styling */}
        <Box mb={10} mt={6} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', py: 6, px: 4, borderRadius: '20px' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom color="primary" fontWeight="bold">
                لماذا تختار Rivella Explore؟
              </Typography>
              <Typography variant="body1" paragraph>
                تقدم منصة Rivella Explore تجربة حجز سلسة وآمنة مع أفضل الخيارات في جميع أنحاء مصر.
              </Typography>
              <Typography variant="body1" paragraph>
                نسعى دائمًا لتقديم خدمة متميزة تضمن لك قضاء أوقات لا تُنسى مع العائلة والأصدقاء في أجمل الشاليهات والاستراحات.
              </Typography>
              <Box mt={3}>
                <Button
                  component={Link}
                  to="/contact"
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
