import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export const MyContext = createContext();

export const useMyContext = () => useContext(MyContext);

export const MyContextProvider = ({ children }) => {
  const host = 'http://localhost:3000/api/v1/rivella';
  
  // Create axios instance with baseURL
  const axiosInstance = axios.create({
    baseURL: host,
  });

  // State variables
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    village: '',
    bedrooms: '',
    guests: '',
    priceMin: '',
    priceMax: '',
    features: [],
  });
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
      fetchWishlist(token); // Fetch wishlist when component mounts if user is logged in
    } else {
      // Load cart from localStorage if user is not logged in
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(savedCart);
    }
  }, []);

  // Update axios headers when token changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance.defaults.headers.common['token'] = token;
    } else {
      delete axiosInstance.defaults.headers.common['token'];
    }
  }, [isLogin]);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (!isLogin) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLogin]);

  const fetchUserProfile = async (token) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/user/profile', {headers: {token}});
      setUserData(response.data.data);
      setIsLogin(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch wishlist from API
  const fetchWishlist = async (token) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/wishlist', {headers: {token}});
      setWishlist(response.data.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/user/login', { email, password });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      await fetchUserProfile(token);
      await fetchWishlist(token); // Fetch wishlist after successful login
      
      Swal.fire({
        icon: 'success',
        title: 'تم تسجيل الدخول بنجاح',
        timer: 1500,
        showConfirmButton: false
      });
      
      return true;
    } catch (error) {
      if(error.response.data.message=="Invalid email or password"){
        Swal.fire({
          icon: 'error',
          title: "البريد او كلمة المرور غير صحيحة",
        });
      }else if(error.response.data.message=="Please verify your email first") {

        Swal.fire({
          icon: 'error',
          title: 'يجب عليك تفعيل حسابك الالكتروني الاول',
        });
        
      }else {
        Swal.fire({
          icon: 'error',
          title: 'خطأ في تسجيل الدخول',
          text: error.response?.data?.message || 'حدث خطأ، يرجى المحاولة مرة أخرى'
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/user/register', userData);
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      await fetchUserProfile(token);
      
      Swal.fire({
        icon: 'success',
        title: 'تم التسجيل بنجاح',
        timer: 1500
      });
      
      return true;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ في التسجيل',
        text: error.response?.data?.message || 'حدث خطأ، يرجى المحاولة مرة أخرى'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLogin(false);
    setUserData(null);
    setCart([]);
    setWishlist([]);
    
    Swal.fire({
      icon: 'success',
      title: 'تم تسجيل الخروج بنجاح',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const addToCart = (chalet, startDate, endDate) => {
    // Check if chalet is already in cart
    const existingIndex = cart.findIndex(item => item.chaletId === chalet.id);
    
    if (existingIndex !== -1) {
      // Update existing item
      const updatedCart = [...cart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        startDate,
        endDate
      };
      setCart(updatedCart);
    } else {
      // Add new item
      setCart([...cart, {
        chaletId: chalet.id,
        chalet: {
          id: chalet.id,
          name: chalet.name,
          price: chalet.price,
          mainImg: chalet.mainImg
        },
        startDate,
        endDate,
        price: chalet.price
      }]);
    }
    
    Swal.fire({
      icon: 'success',
      title: 'تمت الإضافة للسلة',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const removeFromCart = (chaletId) => {
    setCart(cart.filter(item => item.chaletId !== chaletId));
    
    Swal.fire({
      icon: 'success',
      title: 'تمت الإزالة من السلة',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const addToWishlist = async(chalet) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'يجب عليك تسجيل الدخول اولا',
        timer: 1500,
      });
      return;
    }

    try {
      await axiosInstance.post(`/wishlist/${chalet._id}`, {}, {headers: {token}});
      await fetchWishlist(token); // Refresh wishlist after adding item
      
      Swal.fire({
        icon: 'success',
        title: 'تمت الإضافة للمفضلة',
        timer: 1000,
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Swal.fire({
          icon: 'info',
          title: 'الشالية بالفعل في المفضلة',
          timer: 1000,
        });
      } else if (error.response && error.response.data.message === "invaild token") {
        Swal.fire({
          icon: 'error',
          title: 'يجب عليك تسجيل الدخول اولا',
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'حدث خطأ ما',
          timer: 1500,
        });
      }
    }
  };

  const removeFromWishlist = async(chalet) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'يجب عليك تسجيل الدخول اولا',
        timer: 1500,
      });
      return;
    }

    try {
      await axiosInstance.delete(`/wishlist/${chalet._id}`, {headers: {token}});
      await fetchWishlist(token); // Refresh wishlist after removing item
      
      Swal.fire({
        icon: 'success',
        title: 'تم الحذف من المفضلة',
        timer: 1500,
      });
    } catch (error) { 
      Swal.fire({
        icon: 'error',
        title: 'حدث خطأ ما',
        timer: 1500,
      });
    }
  };

  // New function to clear all wishlist items
  const clearWishlist = async() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'يجب عليك تسجيل الدخول اولا',
        timer: 1500,
      });
      return;
    }

    try {
      await axiosInstance.delete('/wishlist', {headers: {token}});
      setWishlist([]); // Clear wishlist state
      
      Swal.fire({
        icon: 'success',
        title: 'تم حذف جميع العناصر من المفضلة',
        timer: 1000,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'حدث خطأ أثناء حذف المفضلة',
        timer: 1500,
      });
    }
  };

  const applyCoupon = async (code, chaletId, totalPrice) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/coupon/apply', {
        code,
        chaletId,
        totalPrice
      });
      
      setCouponCode(code);
      
      if (!isLogin) {
        sessionStorage.setItem('couponCode', code);
        sessionStorage.setItem('discount', response.data.discount);
      }
      
      Swal.fire({
        icon: 'success',
        title: 'تم تطبيق الكوبون',
        text: `خصم: ${response.data.discount}%`,
      });
      
      return response.data;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ في تطبيق الكوبون',
        text: error.response?.data?.message || 'كوبون غير صالح'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const resetFilters = () => {
    setFilters({
      city: '',
      village: '',
      bedrooms: '',
      guests: '',
      priceMin: '',
      priceMax: '',
      features: [],
    });
  };

  const createBooking = async (bookingData, guestData = null) => {
    try {
      setIsLoading(true);
      
      let payload = { ...bookingData };
      
      // If guest user, include their data
      if (!isLogin && guestData) {
        payload = { ...payload, guest: guestData };
      }
      
      const response = await axiosInstance.post('/booking', payload);
      
      Swal.fire({
        icon: 'success',
        title: 'تم طلبك بنجاح',
        text: 'سوف نتواصل معك قريباً',
        timer: 2000,
        showConfirmButton: false
      });
      
      // Clear cart after successful booking
      setCart([]);
      return true;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ في إنشاء الحجز',
        text: error.response?.data?.message || 'حدث خطأ، يرجى المحاولة مرة أخرى'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkAdmin = async(token) => {
    try {
      const res = await axiosInstance.get(`/admin/is-admin`, {headers: {token}});
      if(res.data.success) {
        return true;
      } else {
        return false;
      }      
    } catch (error) {
      return false;
    }
  };
  
  // Export context values and functions
  const contextValue = {
    host,
    axiosInstance,
    isLogin,
    userData,
    cart,
    wishlist,
    filters,
    couponCode,
    isLoading,
    setIsLoading,
    login,
    register,
    logout,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    fetchWishlist,
    applyCoupon,
    updateFilters,
    resetFilters,
    createBooking,
    checkAdmin
  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};