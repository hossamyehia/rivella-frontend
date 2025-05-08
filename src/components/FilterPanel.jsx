// src/components/FilterPanel.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Divider
} from '@mui/material';
import { FilterAlt, RestartAlt } from '@mui/icons-material';
import { useMyContext } from '../context/MyContext';
import Loader from './Loader';

const FilterPanel = () => {
  const { axiosInstance, filters, updateFilters, resetFilters } = useMyContext();
  const [cities, setCities] = useState([]);
  const [villages, setVillages] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [loading, setLoading] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  // Fetch cities once on mount
  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get('/city');
        if (data.success) setCities(data.data);
      } catch (e) {
        console.error('Error fetching cities:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch villages when selected city changes
  useEffect(() => {
    if (!filters.city) {
      setVillages([]);
      return;
    }
    const fetchVillages = async () => {
      setLoadingVillages(true);
      try {
        const { data } = await axiosInstance.get('/village');
        if (data.success) {
          setVillages(data.data.filter(v => v.city._id === filters.city));
        }
      } catch (e) {
        console.error('Error fetching villages:', e);
        setVillages([]);
      } finally {
        setLoadingVillages(false);
      }
    };
    fetchVillages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.city]);

  // Update price range handler
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    // Delay updating filters to avoid excessive API calls while sliding
    if (newValue[0] !== filters.priceMin || newValue[1] !== filters.priceMax) {
      updateFilters({ priceMin: newValue[0], priceMax: newValue[1] });
    }
  };

  if (loading) return <Loader />;

  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" color="primary">
          <FilterAlt sx={{ mr: 1, verticalAlign: 'middle' }} />
          فلترة البحث
        </Typography>
        <Button 
          startIcon={<RestartAlt />} 
          color="secondary" 
          onClick={() => { 
            resetFilters(); 
            setPriceRange([0, 5000]); 
          }}
        >
          إعادة ضبط
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* City */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="city-label">المدينة</InputLabel>
        <Select
          labelId="city-label"
          value={filters.city || ''}
          label="المدينة"
          onChange={e => updateFilters({ city: e.target.value, village: '' })}
        >
          <MenuItem value=""><em>جميع المدن</em></MenuItem>
          {cities.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
        </Select>
      </FormControl>

      {/* Village */}
      <FormControl 
        fullWidth 
        disabled={!filters.city || loadingVillages} 
        sx={{ mb: 2 }}
      >
        <InputLabel id="village-label">القرية/الحي</InputLabel>
        <Select
          labelId="village-label"
          value={filters.village || ''}
          label="القرية/الحي"
          onChange={e => updateFilters({ village: e.target.value })}
        >
          <MenuItem value=""><em>جميع القرى</em></MenuItem>
          {villages.map(v => <MenuItem key={v._id} value={v._id}>{v.name}</MenuItem>)}
        </Select>
      </FormControl>
      
      {/* Bedrooms */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="bedrooms-label">عدد الغرف</InputLabel>
        <Select
          labelId="bedrooms-label"
          value={filters.bedrooms || ''}
          label="عدد الغرف"
          onChange={e => updateFilters({ bedrooms: e.target.value })}
        >
          <MenuItem value=""><em>الكل</em></MenuItem>
          {[1,2,3,4,5,6].map(n => (
            <MenuItem key={n} value={n}>{n} {n===1 ? 'غرفة' : 'غرف'}</MenuItem>
          ))}
          <MenuItem value="7+">7+ غرف</MenuItem>
        </Select>
      </FormControl>
      
      {/* Price Range */}
      <Box sx={{ mt: 3 }}>
        <Typography gutterBottom>نطاق السعر (جنية / ليلة)</Typography>
        <Slider
          value={priceRange}
          onChange={(e, val) => setPriceRange(val)}
          onChangeCommitted={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={100000}
          step={100}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">من: {priceRange[0]}</Typography>
          <Typography variant="body2" color="text.secondary">إلى: {priceRange[1]}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default FilterPanel;