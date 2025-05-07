// src/components/Header.js
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Container,
  useMediaQuery,
  Drawer,
  List,
  ListItemIcon,
  Divider,
  ListItemText,
  ListItem,
  ListItemButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Person,
  Logout,
  Home,
  FilterAlt,
  Favorite,
  Login,
  Dashboard,
  LocationCity as LocationCityIcon,
  HolidayVillage as HolidayVillageIcon,
  ContactSupport as ContactSupportIcon,
  PersonAdd
} from '@mui/icons-material';
import { useMyContext } from '../context/MyContext';

const Header = () => {
  const { isLogin, userData, logout } = useMyContext();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const menuItems = [
    { text: 'الرئيسية',   icon: <Home />,               path: '/' },
    { text: 'البحث',      icon: <FilterAlt />,          path: '/filter' },
    { text: 'المدن',      icon: <LocationCityIcon />,   path: '/cities' },
    { text: 'القرى',      icon: <HolidayVillageIcon />, path: '/villages' },
    { text: 'المفضلة',      icon: <Favorite />, path: '/wishlist' },
    { text: 'تواصل معنا', icon: <ContactSupportIcon />,path: '/contact' },
  ];

  // Drawer content for mobile
  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          ريفيلا للشاليهات
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={RouterLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {!isLogin && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/login">
                <ListItemIcon><Login /></ListItemIcon>
                <ListItemText primary="تسجيل الدخول" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/register">
                <ListItemIcon><PersonAdd /></ListItemIcon>
                <ListItemText primary="إنشاء حساب جديد" />
              </ListItemButton>
            </ListItem>
          </>
        )}

        {isLogin && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/profile">
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary="الحساب الشخصي" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon><Logout /></ListItemIcon>
                <ListItemText primary="تسجيل الخروج" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" sx={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: theme.palette.primary.main,
              textDecoration: 'none',
            }}
          >
            ريفيلا للشاليهات
          </Typography>

          {/* Mobile menu */}
          {isMobile && (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
              >
                {drawerContent}
              </Drawer>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, textAlign: 'center', color: theme.palette.primary.main }}
              >
                ريفيلا للشاليهات
              </Typography>
            </>
          )}

          {/* Desktop menu */}
          {!isMobile && (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    color="inherit"
                    sx={{ mx: 1 }}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                {isLogin ? (
                  <>
                    <Button
                      startIcon={<Person />}
                      onClick={handleMenu}
                      color="inherit"
                    >
                      {userData?.name || 'حسابي'}
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                      <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
                        الحساب الشخصي
                      </MenuItem>
                      {userData?.role === 'admin' && (
                        <MenuItem 
                          component={RouterLink} 
                          to="/admin"
                          onClick={handleClose}
                        >
                          لوحة الإدارة
                        </MenuItem>
                      )}
                      <MenuItem onClick={handleLogout}>
                        تسجيل الخروج
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/login"
                      color="inherit"
                      startIcon={<Login />}
                    >
                      تسجيل الدخول
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/register"
                      color="inherit"
                      startIcon={<PersonAdd />}
                      sx={{ ml: 1 }}
                    >
                      إنشاء حساب جديد
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
