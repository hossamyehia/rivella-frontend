import React, { useState, forwardRef, useImperativeHandle} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Box, Menu, MenuItem } from '@mui/material';
import { Person, Login, PersonAdd } from '@mui/icons-material';

const DesktopHeader = forwardRef(({
  isLogin,
  handleLogout,
  isActive,
  menuItems,
  userData,
  theme
}, ref) => {
  const activeStyle = {
    color: theme.palette.primary.main,
    borderBottom: `3px solid ${theme.palette.primary.main}`,
    fontWeight: 'bold',
    borderRadius: 0,
    paddingBottom: '8px',
    marginBottom: '-3px'
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useImperativeHandle(ref, () => ({
    handleClose: () => {
      setAnchorEl(null);
    }
  }));

  return (
    <>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        {menuItems.map(item =>
          item.isVisiable ? (
            <Button
              key={item.text}
              component={RouterLink}
              to={item.path}
              color="inherit"
              sx={{
                mx: 1,
                ...(isActive(item.path) ? activeStyle : {})
              }}
              startIcon={item.icon}
            >
              {item.text}
            </Button>
          ) : null
        )}
      </Box>

      <Box sx={{ flexGrow: 0 }}>
        {isLogin ? (
          <>
            <Button
              startIcon={<Person />}
              onClick={handleMenu}
              color="inherit"
              sx={isActive('/user/profile') ? activeStyle : {}}
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
              <MenuItem component={RouterLink} to="/user/profile" onClick={handleClose}>الحساب الشخصي</MenuItem>
              {userData?.role === 'admin' && (
                <MenuItem component={RouterLink} to="/admin" onClick={handleClose}>لوحة الإدارة</MenuItem>
              )}
              <MenuItem onClick={handleLogout}>تسجيل الخروج</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button
              component={RouterLink}
              to="/login"
              color="inherit"
              startIcon={<Login />}
              sx={isActive('/login') ? activeStyle : {}}
            >
              تسجيل الدخول
            </Button>
            <Button
              component={RouterLink}
              to="/register"
              color="inherit"
              startIcon={<PersonAdd />}
              sx={{
                ml: 1,
                ...(isActive('/register') ? activeStyle : {})
              }}
            >
              إنشاء حساب جديد
            </Button>
          </>
        )}
      </Box>
    </>
  )
})

export default DesktopHeader;