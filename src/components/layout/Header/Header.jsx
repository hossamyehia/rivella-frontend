// src/components/Header.js
import React, { useRef } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Container,
  useMediaQuery,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Home,
  FilterAlt,
  Favorite,
  LocationCity as LocationCityIcon,
  HolidayVillage as HolidayVillageIcon,
  ContactSupport as ContactSupportIcon
} from '@mui/icons-material';
import { useUserContext } from '../../../context/UserContext';
import Swal from 'sweetalert2';
import DesktopHeader from './platform/DesktopHeader';
import MobileHeader from './platform/MobileHeader';
// import logo from '../../../../public/logo.png'; // Assuming logo is in public folder
const logo = '/logo.png'; // Adjust the path as necessary

const Header = () => {
  const { isLogin, userData, logout } = useUserContext();
  const theme = useTheme();
  const DesktopVersion = useRef();
  const navigate = useNavigate();
  const location = useLocation(); // استخدام useLocation لمعرفة المسار الحالي
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  const handleLogout = async () => {
    try {
      const res = await logout();
      if (!res.success) {
        Swal.fire({
          icon: 'error',
          title: 'خطأ في تسجيل الخروج',
          text: res.message || 'حدث خطأ أثناء تسجيل الخروج'
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'تم تسجيل الخروج',
        text: res.message || 'تم تسجيل الخروج بنجاح'
      });
      if (DesktopVersion.current) {
        DesktopVersion.current.handleClose();
      }
    } finally {
      navigate('/');
    }

  };

  // تحديد ما إذا كان العنصر نشطًا أم لا
  const isActive = (path) => {
    // تحقق من المسار الرئيسي فقط إذا كان المسار الحالي هو '/'
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    // لبقية المسارات، نتحقق إذا كان المسار الحالي يبدأ بالمسار المعني
    // هذا يعني أن المسار /filter/advanced سيجعل زر البحث نشطًا
    return path !== '/' && location.pathname.startsWith(path);
  };

  const menuItems = [
    { text: 'الرئيسية', icon: <Home />, path: '/', isVisiable: true },
    { text: 'البحث', icon: <FilterAlt />, path: '/filter', isVisiable: true },
    { text: 'المدن', icon: <LocationCityIcon />, path: '/cities', isVisiable: true },
    { text: 'القرى', icon: <HolidayVillageIcon />, path: '/villages', isVisiable: true },
    { text: 'المفضلة', icon: <Favorite />, path: '/user/wishlist', isVisiable: isLogin },
    { text: 'تواصل معنا', icon: <ContactSupportIcon />, path: '/contact', isVisiable: true },
  ];


  return (
    <AppBar
      position="sticky"
      color="default"
      sx={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 80, md: 100 },
            px: { xs: 1, md: 2 }
          }}
        >
          {/* Desktop: Logo + Title */}
          {!isMobile && (
            <Box
              component={RouterLink}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', px: 2 }}
            >
              <Typography
                variant="h6"
                sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mr: 1, mt: 1 }}
              >
                Rivella Explore
              </Typography>
              <Box component="img" src={logo} alt="ريفــيلا للشاليهات" sx={{ height: 50 }} />
            </Box>
          )}

          {isMobile ? (
            <MobileHeader
              isLogin={isLogin}
              handleLogout={handleLogout}
              isActive={isActive}
              menuItems={menuItems}
              logo={logo}
              theme={theme}
            />
          ) : (
            <DesktopHeader
              isLogin={isLogin}
              handleLogout={handleLogout}
              isActive={isActive}
              menuItems={menuItems}
              userData={userData}
              theme={theme}
              ref={DesktopVersion}
            />
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
