import { createContext, useState, useContext } from 'react';


export const GlobalFilter = createContext();

export const useGlobalFilter = () => useContext(GlobalFilter);

export const GlobalFilterProvider = ({ children }) => {
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

  // Export context values and functions
  const contextValue = {
    filters,
    setFilters,
    updateFilters,
    resetFilters,    
  };

  return (
    <GlobalFilter.Provider value={contextValue}>
      {children}
    </GlobalFilter.Provider>
  );
};
