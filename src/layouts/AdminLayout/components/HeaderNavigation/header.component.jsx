import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { AppBar, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CabinIcon from '@mui/icons-material/Cabin';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import HomeIcon from '@mui/icons-material/Home';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddHomeIcon from '@mui/icons-material/AddHome';
import LogoutIcon from '@mui/icons-material/Logout';
import RuleIcon from '@mui/icons-material/Rule';
import Swal from "sweetalert2";

const drawerWidth = 240;

export default function HeaderNavigation() {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const selectedSection = pathSegments[pathSegments.length - 1] || '';

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    // const selectedSection = searchParams.get('section') || 'users';
    const [drawerOpen, setDrawerOpen] = useState(false);


    const menuItems = [
        { text: 'الرئيسية', icon: <HomeIcon />, section: '' },
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

    const toggleDrawer = () => {
        setDrawerOpen(prev => !prev);
    };

    const handleNavigation = (section) => {
        // setSearchParams({ section });
        navigate(`/dashboard/${section}`);
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
    return (
        <>
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
        </>
    )
}