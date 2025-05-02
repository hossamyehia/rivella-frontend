import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';

// Context Provider
import { MyContextProvider } from './context/MyContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';

// Pages
import Home from './pages/Home';
import Filter from './pages/Filter';
import Login from './pages/Login';
import Register from './pages/Register';
import ChaletDetails from './pages/ChaletDetails';
// import Cart from './pages/Cart';
import WishList from './pages/WishList';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';

// Routes
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import VerifyEmail from './pages/VerifyEmail';
import AdminLogin from './pages/AdminLogin';
import CitiesPage from './pages/CitiesPage';
import VillagesPage from './pages/VillagesPage';
import Chalets from './pages/Chalets';
import ContactUs from './pages/ContactUs';
import ProfilePage from './pages/Profile';

// Create RTL cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create theme
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: 'rgb(255, 107, 16)',
    },
    secondary: {
      main: '#87CEEB', // Light sky blue
    },
  },
  typography: {
    fontFamily: '"Tajawal", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          textTransform: 'none',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
  },
  spacing: 8, // Base spacing unit of 8px
});

function App() {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <MyContextProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/filter" element={<Filter />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/chalets" element={<Chalets />} />
              <Route path="/chalet/:id" element={<ChaletDetails />} />
              <Route path="/cities" element={<CitiesPage />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/villages" element={<VillagesPage />} />
              <Route path="/wishlist" element={<WishList />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login-admin" element={<AdminLogin/>} />
              <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </MyContextProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;