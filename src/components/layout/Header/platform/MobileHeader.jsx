import React, { useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItemIcon,
    Divider,
    ListItemText,
    ListItem,
    ListItemButton,
    IconButton,
    Drawer
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import {
    Login,
    PersonAdd,
    Person,
    Logout,
} from '@mui/icons-material';

export default function MobileHeader({ isLogin, handleLogout, isActive, menuItems, logo, theme }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => setMobileOpen(open => !open);

    return (
        <>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
            >
                <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 'bold',
                                mr: 1
                            }}
                        >
                            Rivella Explore
                        </Typography>
                        <Box
                            component="img"
                            src={logo}
                            alt="ريفــيلا للشاليهات"
                            sx={{ height: 40, width: 'auto' }}
                        />
                    </Box>
                    <Divider />
                    <List>
                        {menuItems.map(item =>
                            item.isVisiable ? (
                                <ListItem key={item.text} disablePadding>
                                    <ListItemButton
                                        component={RouterLink}
                                        to={item.path}
                                        sx={isActive(item.path) ? {
                                            backgroundColor: theme.palette.action.selected,
                                            color: theme.palette.primary.main,
                                            '& .MuiListItemIcon-root': {
                                                color: theme.palette.primary.main
                                            }
                                        } : {}}
                                    >
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItemButton>
                                </ListItem>
                            ) : null
                        )}
                        {!isLogin && (
                            <>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={RouterLink}
                                        to="/login"
                                        sx={isActive('/login') ? {
                                            backgroundColor: theme.palette.action.selected,
                                            color: theme.palette.primary.main,
                                            '& .MuiListItemIcon-root': {
                                                color: theme.palette.primary.main
                                            }
                                        } : {}}
                                    >
                                        <ListItemIcon><Login /></ListItemIcon>
                                        <ListItemText primary="تسجيل الدخول" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={RouterLink}
                                        to="/register"
                                        sx={isActive('/register') ? {
                                            backgroundColor: theme.palette.action.selected,
                                            color: theme.palette.primary.main,
                                            '& .MuiListItemIcon-root': {
                                                color: theme.palette.primary.main
                                            }
                                        } : {}}
                                    >
                                        <ListItemIcon><PersonAdd /></ListItemIcon>
                                        <ListItemText primary="إنشاء حساب جديد" />
                                    </ListItemButton>
                                </ListItem>
                            </>
                        )}
                        {isLogin && (
                            <>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={RouterLink}
                                        to="/user/profile"
                                        sx={isActive('/user/profile') ? {
                                            backgroundColor: theme.palette.action.selected,
                                            color: theme.palette.primary.main,
                                            '& .MuiListItemIcon-root': {
                                                color: theme.palette.primary.main
                                            }
                                        } : {}}
                                    >
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
            </Drawer>

            {/* Mobile Logo + Title */}
            <Box
                component={RouterLink}
                to="/"
                sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
            >
                <Typography
                    variant="h6"
                    sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mr: 1 }}
                >
                    Rivella Explore
                </Typography>
                <Box component="img" src={logo} alt="ريفــيلا للشاليهات" sx={{ height: 30, width: 'auto' }} />
            </Box>
        </>
    );
}