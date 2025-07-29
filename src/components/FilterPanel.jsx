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
  Divider,
  Chip,
  OutlinedInput
} from '@mui/material';
import { FilterAlt, RestartAlt } from '@mui/icons-material';
import { useMyContext } from '../context/MyContext';
import Loader from './Loader';
import { useServicesContext } from '../context/ServicesContext';
import ChaletSessionStroage from '../pages/guest-portal/services/ChaletSessionStroage.service';

const FilterPanel = () => {
  // const { axiosInstance, isLoading, setIsLoading } = useApiContext();
  const { services, isLoading } = useServicesContext();
  const { filters, updateFilters, resetFilters } = useMyContext();
  const _ChaletSessionStroage = ChaletSessionStroage();
  const [cities, setCities] = useState([]);
  const [villages, setVillages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  // const [ loading, setLoading ] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    (async () => {
      const [cityRes, featureRes] = await Promise.all([
        services["LookupsService"]["getCities"](),
        services["LookupsService"]["getFeatures"](),
      ])

      if (!cityRes.success) return;
      setCities(cityRes.data.data);

      if (!featureRes.success) return;
      setFeatures(featureRes.data.data);

    })()
  }, [])

  // Fetch villages when selected city changes
  useEffect(() => {
    if (!filters.city) {
      setVillages([]);
      return;
    }
    (async () => {
      setLoadingVillages(true);
      const { success, data } = await services['LookupsService']['getVillages']();
      if (success) {
        setVillages(data.data.filter(v => v.city._id === filters.city));
      } else {
        setVillages([]);
      }
      setLoadingVillages(false);
    })();
  }, [filters.city]);

  // Update price range from filters (for initialization from session storage)
  useEffect(() => {
    if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
      setPriceRange([filters.priceMin, filters.priceMax]);
    }
  }, [filters.priceMin, filters.priceMax]);

  // Save filters whenever they change
  useEffect(() => {
    _ChaletSessionStroage.saveFilters(filters);
  }, [filters]);

  // Handle reset filters
  const handleResetFilters = () => {
    // Clear session storage first
    _ChaletSessionStroage.clear();

    // Reset filters in context
    resetFilters();

    // Reset local price range state
    setPriceRange([0, 100000]);
  };

  // Update price range handler with immediate session storage save
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    const updatedFilters = { ...filters, priceMin: newValue[0], priceMax: newValue[1] };
    updateFilters({ priceMin: newValue[0], priceMax: newValue[1] });
    _ChaletSessionStroage.saveFilters(updatedFilters);
  };

  // Handle other filter changes with session storage save
  const handleFilterChange = (filterUpdate) => {
    const updatedFilters = { ...filters, ...filterUpdate };
    updateFilters(filterUpdate);
    _ChaletSessionStroage.saveFilters(updatedFilters);
  };

  if (isLoading) return <Loader />;

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
          onClick={handleResetFilters}
          variant="outlined"
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
          onChange={e => handleFilterChange({ city: e.target.value, village: '' })}
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
          onChange={e => handleFilterChange({ village: e.target.value })}
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
          onChange={e => handleFilterChange({ bedrooms: e.target.value })}
        >
          <MenuItem value=""><em>الكل</em></MenuItem>
          {[1, 2, 3, 4, 5, 6].map(n => (
            <MenuItem key={n} value={n}>{n} {n === 1 ? 'غرفة' : 'غرف'}</MenuItem>
          ))}
          <MenuItem value="7+">7+ غرف</MenuItem>
        </Select>
      </FormControl>


      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>اختيار المميزات</InputLabel>
        <Select
          multiple
          value={filters.features}
          open={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          onOpen={() => setIsDropdownOpen(true)}
          onChange={(e) => (e.target.value[e.target.value.length - 1] === '__close__' ? null :  handleFilterChange({ features: e.target.value }))}
          input={<OutlinedInput label="اختيار المميزات" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((id) => {
                const featureObj = features.find((t) => t._id === id);
                return (
                  <Chip
                    key={id}
                    label={
                      `${featureObj?.name || id}`
                    }
                    color={'success'}
                    variant="outlined"
                  />
                );
              })}
            </Box>
          )}
        >
          {features.map((feature) => (
            <MenuItem key={feature._id} value={feature._id}>
              {feature.name}
            </MenuItem>
          ))}

          <MenuItem
            onClick={(e)=> {
              e.stopPropagation();
              handleDropdownClose();
            }}
            value='__close__'
            sx={{ justifyContent: 'center', fontWeight: 'bold', color: 'white', background: "orange", ":hover": { background: "orange" } }}
          >
            إغلاق
          </MenuItem>
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