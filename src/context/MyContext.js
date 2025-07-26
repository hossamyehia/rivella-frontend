import React, { createContext, useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { ApiContext } from './ApiContext';
import { UserContext } from './UserContext';

export const MyContext = createContext();

export const useMyContext = () => useContext(MyContext);

export const MyContextProvider = ({ children }) => {
  const { axiosInstance, setIsLoading } = useContext(ApiContext);
  const { isLogin, setCart } = useContext(UserContext);

  // State variables
  const [filters, setFilters] = useState({
    code: '',
    name: '',
    city: '',
    village: '',
    bedrooms: '',
    guests: '',
    priceMin: '',
    priceMax: '',
    features: [],
  });

  const [couponCode, setCouponCode] = useState('');

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
      name: '',
      code: '',
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


  // Export context values and functions
  const contextValue = {
    filters,
    setFilters,
    setIsLoading,
    applyCoupon,
    updateFilters,
    resetFilters,
    createBooking,    
  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};
