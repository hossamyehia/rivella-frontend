import React, { useState } from 'react';
import { Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CabinIcon from '@mui/icons-material/Cabin';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddHomeIcon from '@mui/icons-material/AddHome';
import LogoutIcon from '@mui/icons-material/Logout';
import RuleIcon from '@mui/icons-material/Rule';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Swal from 'sweetalert2';

// Admin pages
import AdminUsers from './pages/AdminUsers';
import AdminAdmins from './pages/AdminAdmins';
import AdminCities from './pages/AdminCities';
import AdminVillages from './pages/AdminVillages';
import AdminChalets from './pages/AdminChalets';
import AdminCoupons from './pages/AdminCoupons';
import AdminBookings from './pages/AdminBookings';
import AdminReservations from './pages/AdminReservations';
import AdminFeatures from './pages/AdminFeatures';
import AdminTerms from './pages/AdminTerms';
import AdminServices from './pages/AdminServices';
// Uncomment if you want overview
// import AdminOverview from './Admin pages/AdminOverview';

const drawerWidth = 240;

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read section from URL, default to 'users'
  const selectedSection = searchParams.get('section') || 'users';

  const toggleDrawer = () => {
    setDrawerOpen(prev => !prev);
  };

  const handleNavigation = (section) => {
    setSearchParams({ section });
    if (isMobile) setDrawerOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    Swal.fire({
      title: 'تم تسجيل الخروج',
      text: 'تم تسجيل خروجك بنجاح',
      icon: 'success',
      confirmButtonText: 'حسناً'
    });
  };

  const menuItems = [
    { text: 'المستخدمين', icon: <PeopleIcon />, section: 'users' },
    { text: 'المشرفين', icon: <AdminPanelSettingsIcon />, section: 'admins' },
    { text: 'المدن', icon: <LocationCityIcon />, section: 'cities' },
    { text: 'القرى', icon: <HolidayVillageIcon />, section: 'villages' },
    { text: 'المرافق', icon: <AddHomeIcon />, section: 'features' },
    { text: 'الخدمات', icon: <HomeRepairServiceIcon />, section: 'services' },
    { text: 'القواعد', icon: <RuleIcon />, section: 'terms' },
    { text: 'الشاليهات', icon: <CabinIcon />, section: 'chalets' },
    { text: 'الكوبونات', icon: <ConfirmationNumberIcon />, section: 'coupons' },
    { text: 'طلبات الحجز', icon: <BookOnlineIcon />, section: 'bookings' },
    { text: 'الحجوزات الحالية', icon: <CalendarMonthIcon />, section: 'reservations' }
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case 'users': return <AdminUsers />;
      case 'admins': return <AdminAdmins />;
      case 'cities': return <AdminCities />;
      case 'villages': return <AdminVillages />;
      case 'features': return <AdminFeatures />;
      case 'services': return <AdminServices />;
      case 'terms': return <AdminTerms />;
      case 'chalets': return <AdminChalets />;
      case 'coupons': return <AdminCoupons />;
      case 'bookings': return <AdminBookings />;
      case 'reservations': return <AdminReservations />;
      default: return <AdminUsers />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          mr: { md: `${drawerOpen ? drawerWidth : 0}px` },
          backgroundColor: theme.palette.primary.main
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            {drawerOpen ? <ChevronRightIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap>
            {menuItems.find(item => item.section === selectedSection)?.text || 'لوحة التحكم'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {menuItems.map(item => (
            <ListItem key={item.section} disablePadding>
              <ListItemButton
                selected={selectedSection === item.section}
                onClick={() => handleNavigation(item.section)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="تسجيل الخروج" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          mr: { md: `${drawerOpen ? drawerWidth : 0}px` }
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
