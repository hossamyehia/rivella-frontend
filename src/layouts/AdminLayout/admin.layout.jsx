import { Outlet } from 'react-router-dom';
import { Box, Grid, CssBaseline, Toolbar } from '@mui/material';
import HeaderNavigation from './components/HeaderNavigation/header.component';
export default function AdminLayout() {
    return (
        <>
            <CssBaseline />
            <Box display="flex" sx={{ minHeight: "100vh" }}>
                {/* Sidebar or nav */}
                <Box sx={{ flexShrink: 0 }}>
                    <HeaderNavigation />
                </Box>

                {/* Main Content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        width: "100%",
                    }}
                >
                    <Toolbar />
                    <Outlet />
                </Box>
            </Box>
        </>
    )
}