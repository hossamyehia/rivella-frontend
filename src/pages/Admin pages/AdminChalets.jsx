import React, { useState, useEffect, useContext } from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  InputAdornment
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { MyContext } from '../../context/MyContext';
import Loader from '../../components/Loader';
import Swal from 'sweetalert2';

const AdminChalets = () => {
  const { axiosInstance } = useContext(MyContext);
  const [chalets, setChalets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cities, setCities] = useState([]);
  const [villages, setVillages] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    city: '',
    village: '',
    bedrooms: '',
    guests: '',
    priceMin: '',
    priceMax: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [selectedChalet, setSelectedChalet] = useState(null);
  const [selectedChaletId, setSelectedChaletId] = useState(null);
  
  // Form state
  const [chaletForm, setChaletForm] = useState({
    name: '',
    city: '',
    village: '',
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    type: 'شاليه',
    guests: 1,
    price: 0,
    code: '',
    mainImg: null,
    imgs: [],
    badroomsDetails: [
      { title: '', text: '' }
    ],
    features: [
      { name: '', description: '' }
    ],
    terms: [
      { term: '', allowed: false }
    ]
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  
  useEffect(() => {
    fetchChalets();
    fetchCities();
  }, [page, limit]);
  
  useEffect(() => {
    if (filters.city) {
      fetchVillagesByCity(filters.city);
    }
  }, [filters.city]);
  
  const fetchChalets = async () => {
    setLoading(true);
    try {
      // Build query params
      const queryParams = new URLSearchParams({
        page,
        limit
      });
      queryParams.append('admin','true')
      // Add filters to query if they exist
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.village) queryParams.append('village', filters.village);
      if (filters.bedrooms) queryParams.append('bedrooms', filters.bedrooms);
      if (filters.guests) queryParams.append('guests', filters.guests);
      if (filters.priceMin) queryParams.append('priceMin', filters.priceMin);
      if (filters.priceMax) queryParams.append('priceMax', filters.priceMax);
      
      
      const response = await axiosInstance.get(
        `/chalet?${queryParams.toString()}`,
        { headers: { token: localStorage.getItem("token") } }
      );
      
      const transformed = response.data.data.map(chalet => ({
        ...chalet,
        cityName: chalet.city?.name || '—',
        villageName: chalet.village?.name || '—',
      }));
      
      setChalets(transformed);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
      setError('');
    } catch (err) {
      console.error('Error fetching chalets:', err);
      setError('فشل في جلب بيانات الشاليهات');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCities = async () => {
    try {
      const response = await axiosInstance.get('/city', {
        headers: { token: localStorage.getItem("token") }
      });
      setCities(response.data.data);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };
  
  const fetchVillagesByCity = async (cityId) => {
    try {
      const response = await axiosInstance.get(`/village`, {
        headers: { token: localStorage.getItem("token") }
      });
      setFilteredVillages(response.data.data);
    } catch (err) {
      console.error('Error fetching villages:', err);
    }
  };
  
  const fetchAllVillages = async () => {
    try {
      const response = await axiosInstance.get('/village', {
        headers: { token: localStorage.getItem("token") }
      });
      setVillages(response.data.data);
    } catch (err) {
      console.error('Error fetching all villages:', err);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset village if city changes
    if (name === 'city') {
      setFilters(prev => ({
        ...prev,
        village: ''
      }));
    }
  };
  
  const applyFilters = () => {
    setPage(1); // Reset to first page when filtering
    fetchChalets();
  };
  
  const resetFilters = () => {
    setFilters({
      city: '',
      village: '',
      bedrooms: '',
      guests: '',
      priceMin: '',
      priceMax: '',
    });
    setPage(1);
    fetchChalets();
  };
  
  const handleViewClick = (chalet) => {
    setSelectedChalet(chalet);
    setViewDialogOpen(true);
  };
  
  const handleEditClick = (chalet) => {
    setSelectedChalet(chalet);
    setSelectedChaletId(chalet._id);
    
    // Transform chalet data to form data
    setChaletForm({
      name: chalet.name || '',
      city: chalet.city?._id || '',
      village: chalet.village?._id || '',
      location: chalet.location || '',
      bedrooms: chalet.bedrooms || 1,
      bathrooms: chalet.bathrooms || 1,
      type: chalet.type || 'شاليه',
      guests: chalet.guests || 1,
      price: chalet.price || 0,
      code: chalet.code || '',
      mainImg: null,
      imgs: [],
      badroomsDetails: chalet.badroomsDetails?.length > 0 ? chalet.badroomsDetails : [{ title: '', text: '' }],
      features: chalet.features?.length > 0 ? chalet.features : [{ name: '', description: '' }],
      terms: chalet.terms?.length > 0 ? chalet.terms : [{ term: '', allowed: false }]
    });
    
    setFormErrors({});
    setCurrentTab(0);
    setEditDialogOpen(true);
    
    // Load villages for the selected city
    if (chalet.city?._id) {
      fetchVillagesByCity(chalet.city._id);
    }
  };
  
  const handleDeleteClick = (chaletId) => {
    setSelectedChaletId(chaletId);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/chalet/${selectedChaletId}`, {
        headers: { token: localStorage.getItem("token") }
      });
      
      setChalets(chalets.filter(chalet => chalet._id !== selectedChaletId));
      
      Swal.fire({
        title: 'تم الحذف',
        text: 'تم حذف الشاليه بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً'
      });
    } catch (err) {
      console.error('Error deleting chalet:', err);
      
      Swal.fire({
        title: 'خطأ',
        text: err.response?.data?.message || 'حدث خطأ أثناء حذف الشاليه',
        icon: 'error',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedChaletId(null);
      setLoading(false);
    }
  };
  
  const handleAddClick = () => {
    // Reset form
    setChaletForm({
      name: '',
      city: '',
      village: '',
      location: '',
      bedrooms: 1,
      bathrooms: 1,
      type: 'شاليه',
      guests: 1,
      price: 0,
      code: '',
      mainImg: null,
      imgs: [],
      badroomsDetails: [
        { title: '', text: '' }
      ],
      features: [
        { name: '', description: '' }
      ],
      terms: [
        { term: '', allowed: false }
      ]
    });
    setFormErrors({});
    setCurrentTab(0);
    setAddDialogOpen(true);
    fetchAllVillages();
  };
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === 'mainImg') {
      setChaletForm({
        ...chaletForm,
        mainImg: files[0]
      });
    } else if (name === 'imgs') {
      setChaletForm({
        ...chaletForm,
        imgs: Array.from(files)
      });
    } else if (type === 'checkbox') {
      setChaletForm({
        ...chaletForm,
        [name]: checked
      });
    } else {
      setChaletForm({
        ...chaletForm,
        [name]: value
      });
    }
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    // If city changed, fetch villages
    if (name === 'city') {
      fetchVillagesByCity(value);
      setChaletForm(prev => ({
        ...prev,
        village: ''
      }));
    }
  };
  
  const handleArrayItemChange = (arrayName, index, fieldName, value) => {
    const updatedArray = [...chaletForm[arrayName]];
    
    if (fieldName === 'allowed') {
      updatedArray[index] = {
        ...updatedArray[index],
        allowed: value
      };
    } else {
      updatedArray[index] = {
        ...updatedArray[index],
        [fieldName]: value
      };
    }
    
    setChaletForm({
      ...chaletForm,
      [arrayName]: updatedArray
    });
  };
  
  const addArrayItem = (arrayName) => {
    const newItem = arrayName === 'badroomsDetails' 
      ? { title: '', text: '' } 
      : arrayName === 'features' 
        ? { name: '', description: '' } 
        : { term: '', allowed: false };
    
    setChaletForm({
      ...chaletForm,
      [arrayName]: [...chaletForm[arrayName], newItem]
    });
  };
  
  const removeArrayItem = (arrayName, index) => {
    const updatedArray = [...chaletForm[arrayName]];
    updatedArray.splice(index, 1);
    
    setChaletForm({
      ...chaletForm,
      [arrayName]: updatedArray
    });
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!chaletForm.name) errors.name = 'اسم الشاليه مطلوب';
    if (!chaletForm.city) errors.city = 'المدينة مطلوبة';
    if (!chaletForm.village) errors.village = 'القرية مطلوبة';
    if (!chaletForm.location) errors.location = 'الموقع مطلوب';
    if (!chaletForm.price) errors.price = 'السعر مطلوب';
    if (!chaletForm.code) errors.code = 'الكود مطلوب';
    
    // For add mode, require mainImg
    if (addDialogOpen && !chaletForm.mainImg) {
      errors.mainImg = 'الصورة الرئيسية مطلوبة';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (isEdit = false) => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    const formData = new FormData();
    
    // Append basic fields
    formData.append('name', chaletForm.name);
    formData.append('city', chaletForm.city);
    formData.append('village', chaletForm.village);
    formData.append('location', chaletForm.location);
    formData.append('bedrooms', chaletForm.bedrooms);
    formData.append('bathrooms', chaletForm.bathrooms);
    formData.append('type', chaletForm.type);
    formData.append('guests', chaletForm.guests);
    formData.append('price', chaletForm.price);
    formData.append('code', chaletForm.code);
    
    // Append mainImg if exists
    if (chaletForm.mainImg) {
      formData.append('mainImg', chaletForm.mainImg);
    }
    
    // Append images if they exist
    if (chaletForm.imgs.length > 0) {
      chaletForm.imgs.forEach(img => {
        formData.append('imgs', img);
      });
    }
    
    // Append arrays as JSON strings
    formData.append('badroomsDetails', JSON.stringify(chaletForm.badroomsDetails));
    formData.append('features', JSON.stringify(chaletForm.features));
    formData.append('terms', JSON.stringify(chaletForm.terms));
    
    try {
      let response;
      
      if (isEdit) {
        response = await axiosInstance.put(`/chalet/${selectedChaletId}`, formData, {
          headers: { 
            token: localStorage.getItem("token"),
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axiosInstance.post('/chalet', formData, {
          headers: { 
            token: localStorage.getItem("token"),
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      Swal.fire({
        title: isEdit ? 'تم التعديل' : 'تم الإضافة',
        text: isEdit ? 'تم تعديل الشاليه بنجاح' : 'تم إضافة الشاليه بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً'
      });
      
      fetchChalets(); // Refresh data
      
      if (isEdit) {
        setEditDialogOpen(false);
      } else {
        setAddDialogOpen(false);
      }
    } catch (err) {
      console.error('Error saving chalet:', err);
      
      Swal.fire({
        title: 'خطأ',
        text: err.response?.data?.message || 'حدث خطأ أثناء حفظ الشاليه',
        icon: 'error',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const columns = [
    { field: 'name', headerName: 'اسم الشاليه', width: 200 },
    { field: 'cityName', headerName: 'المدينة', width: 150 },
    { field: 'villageName', headerName: 'القرية', width: 150 },
    { field: 'type', headerName: 'النوع', width: 100 },
    { field: 'price', headerName: 'السعر (لليلة)', width: 120 },
    { field: 'bedrooms', headerName: 'الغرف', width: 80 },
    { field: 'guests', headerName: 'الضيوف', width: 80 },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 160,
      renderCell: params => (
        <Box>
          <IconButton
            size="small"
            color="info"
            onClick={() => handleViewClick(params.row)}
            aria-label="عرض"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEditClick(params.row)}
            aria-label="تعديل"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteClick(params.row._id)}
            aria-label="حذف"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];
  
  if (loading && chalets.length === 0) {
    return <Loader />;
  }
  
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          إدارة الشاليهات
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          إضافة شاليه جديد
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />
      
      {/* Filters */}
      <Box mb={3}>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          sx={{ mb: 2 }}
        >
          {showFilters ? 'إخفاء الفلاتر' : 'عرض الفلاتر'}
        </Button>
        
        {showFilters && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="city-filter-label">المدينة</InputLabel>
                  <Select
                    labelId="city-filter-label"
                    id="city-filter"
                    name="city"
                    value={filters.city}
                    label="المدينة"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">الكل</MenuItem>
                    {cities.map(city => (
                      <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="village-filter-label">القرية</InputLabel>
                  <Select
                    labelId="village-filter-label"
                    id="village-filter"
                    name="village"
                    value={filters.village}
                    label="القرية"
                    onChange={handleFilterChange}
                    disabled={!filters.city}
                  >
                    <MenuItem value="">الكل</MenuItem>
                    {filteredVillages.map(village => (
                      <MenuItem key={village._id} value={village._id}>{village.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="عدد الغرف"
                  name="bedrooms"
                  type="number"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="عدد الضيوف"
                  name="guests"
                  type="number"
                  value={filters.guests}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="السعر (من)"
                  name="priceMin"
                  type="number"
                  value={filters.priceMin}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="السعر (إلى)"
                  name="priceMax"
                  type="number"
                  value={filters.priceMax}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} container justifyContent="flex-end" spacing={1}>
                <Grid item>
                  <Button variant="outlined" onClick={resetFilters}>إعادة ضبط</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={applyFilters}>تطبيق الفلاتر</Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={chalets}
          columns={columns}
          getRowId={row => row._id}
          pageSize={limit}
          rowCount={total}
          paginationMode="server"
          onPageChange={(newPage) => setPage(newPage + 1)}
          page={page - 1}
          rowsPerPageOptions={[15, 25, 50]}
          onPageSizeChange={(newPageSize) => setLimit(newPageSize)}
          disableSelectionOnClick
          loading={loading}
          sx={{
            '& .MuiDataGrid-columnHeaders': { backgroundColor: 'primary.main', color: 'black' },
            '& .MuiDataGrid-cell': { color: 'black' },
            '& .MuiDataGrid-footerContainer': { color: 'black' },
          }}
        />
      </Paper>
      
      {/* View Chalet Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          تفاصيل الشاليه
        </DialogTitle>
        <DialogContent>
          {selectedChalet && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>المعلومات الأساسية</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">الاسم</TableCell>
                        <TableCell>{selectedChalet.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">المدينة</TableCell>
                        <TableCell>{selectedChalet.city?.name || '—'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">القرية</TableCell>
                        <TableCell>{selectedChalet.village?.name || '—'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">الموقع</TableCell>
                        <TableCell>{selectedChalet.location}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">النوع</TableCell>
                        <TableCell>{selectedChalet.type}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">السعر لليلة</TableCell>
                        <TableCell>{selectedChalet.price} جنية</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">الكود</TableCell>
                        <TableCell>{selectedChalet.code}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">عدد الغرف</TableCell>
                        <TableCell>{selectedChalet.bedrooms}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">عدد الحمامات</TableCell>
                        <TableCell>{selectedChalet.bathrooms}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">عدد الضيوف</TableCell>
                        <TableCell>{selectedChalet.guests}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>الصور</Typography>
                {selectedChalet.mainImg && (
                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom>الصورة الرئيسية</Typography>
                    <img 
                      src={selectedChalet.mainImg} 
                      alt="الصورة الرئيسية" 
                      style={{ maxWidth: '100%', maxHeight: '200px', display: 'block', marginBottom: '10px' }} 
                    />
                  </Box>
                )}
                
                {selectedChalet.imgs && selectedChalet.imgs.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>الصور الإضافية</Typography>
                    <Grid container spacing={1}>
                      {selectedChalet.imgs.map((img, index) => (
                        <Grid item xs={6} sm={4} key={index}>
                          <img 
                            src={img} 
                            alt={`صورة ${index + 1}`} 
                            style={{ width: '100%', height: '100px', objectFit: 'cover' }} 
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>
              
              {selectedChalet.badroomsDetails && selectedChalet.badroomsDetails.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>تفاصيل الغرف</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>العنوان</TableCell>
                          <TableCell>الوصف</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedChalet.badroomsDetails.map((room, index) => (
                          <TableRow key={index}>
                            <TableCell>{room.title}</TableCell>
                            <TableCell>{room.text}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
              
              {selectedChalet.features && selectedChalet.features.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>المميزات</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>الميزة</TableCell>
                          <TableCell>الوصف</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedChalet.features.map((feature, index) => (
                          <TableRow key={index}>
                            <TableCell>{feature.name}</TableCell>
<TableCell>{feature.description}</TableCell>
</TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
              
              {selectedChalet.terms && selectedChalet.terms.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>الشروط</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>الشرط</TableCell>
                          <TableCell>الحالة</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedChalet.terms.map((term, index) => (
                          <TableRow key={index}>
                            <TableCell>{term.term}</TableCell>
                            <TableCell>
                              <Chip 
                                label={term.allowed ? 'مسموح' : 'غير مسموح'} 
                                color={term.allowed ? 'success' : 'error'}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>إغلاق</Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Chalet Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          تعديل الشاليه
        </DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="chalet edit tabs">
              <Tab label="المعلومات الأساسية" />
              <Tab label="الصور" />
              <Tab label="تفاصيل الغرف" />
              <Tab label="المميزات" />
              <Tab label="الشروط" />
            </Tabs>
          </Box>
          
          {currentTab === 0 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="اسم الشاليه"
                  name="name"
                  value={chaletForm.name}
                  onChange={handleFormChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.city} required>
                  <InputLabel id="city-label">المدينة</InputLabel>
                  <Select
                    labelId="city-label"
                    name="city"
                    value={chaletForm.city}
                    label="المدينة"
                    onChange={handleFormChange}
                  >
                    {cities.map(city => (
                      <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                    ))}
                  </Select>
                  {formErrors.city && <Typography color="error" variant="caption">{formErrors.city}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.village} required>
                  <InputLabel id="village-label">القرية</InputLabel>
                  <Select
                    labelId="village-label"
                    name="village"
                    value={chaletForm.village}
                    label="القرية"
                    onChange={handleFormChange}
                    disabled={!chaletForm.city}
                  >
                    {filteredVillages.map(village => (
                      <MenuItem key={village._id} value={village._id}>{village.name}</MenuItem>
                    ))}
                  </Select>
                  {formErrors.village && <Typography color="error" variant="caption">{formErrors.village}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="الموقع"
                  name="location"
                  value={chaletForm.location}
                  onChange={handleFormChange}
                  error={!!formErrors.location}
                  helperText={formErrors.location}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="type-label">النوع</InputLabel>
                  <Select
                    labelId="type-label"
                    name="type"
                    value={chaletForm.type}
                    label="النوع"
                    onChange={handleFormChange}
                  >
                    <MenuItem value="شاليه">شاليه</MenuItem>
                    <MenuItem value="فله">فله</MenuItem>
                    <MenuItem value="استراحة">استراحة</MenuItem>
                    <MenuItem value="مزرعة">مزرعة</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="السعر لليلة"
                  name="price"
                  type="number"
                  value={chaletForm.price}
                  onChange={handleFormChange}
                  error={!!formErrors.price}
                  helperText={formErrors.price}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">جنيه</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="الكود"
                  name="code"
                  value={chaletForm.code}
                  onChange={handleFormChange}
                  error={!!formErrors.code}
                  helperText={formErrors.code}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="عدد الغرف"
                  name="bedrooms"
                  type="number"
                  value={chaletForm.bedrooms}
                  onChange={handleFormChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="عدد الحمامات"
                  name="bathrooms"
                  type="number"
                  value={chaletForm.bathrooms}
                  onChange={handleFormChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="عدد الضيوف"
                  name="guests"
                  type="number"
                  value={chaletForm.guests}
                  onChange={handleFormChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </Grid>
          )}
          
          {currentTab === 1 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>الصورة الرئيسية</Typography>
                <input
                  type="file"
                  accept="image/*"
                  name="mainImg"
                  onChange={handleFormChange}
                  style={{display: 'block', marginBottom: '10px'}}
                />
                {formErrors.mainImg && <Typography color="error" variant="caption">{formErrors.mainImg}</Typography>}
                {selectedChalet && selectedChalet.mainImg && (
                  <Box mt={2}>
                    <Typography variant="caption">الصورة الحالية:</Typography>
                    <img 
                      src={selectedChalet.mainImg} 
                      alt="الصورة الرئيسية الحالية" 
                      style={{ maxWidth: '100%', maxHeight: '200px', display: 'block', marginTop: '5px' }} 
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>الصور الإضافية</Typography>
                <input
                  type="file"
                  accept="image/*"
                  name="imgs"
                  onChange={handleFormChange}
                  multiple
                  style={{display: 'block'}}
                />
                {selectedChalet && selectedChalet.imgs && selectedChalet.imgs.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="caption">الصور الحالية:</Typography>
                    <Grid container spacing={1} mt={1}>
                      {selectedChalet.imgs.map((img, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <img 
                            src={img} 
                            alt={`صورة ${index + 1}`} 
                            style={{ width: '100%', height: '100px', objectFit: 'cover' }} 
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
          
          {currentTab === 2 && (
            <Box sx={{ mt: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">تفاصيل الغرف</Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<AddIcon />}
                  onClick={() => addArrayItem('badroomsDetails')}
                >
                  إضافة غرفة
                </Button>
              </Box>
              
              {chaletForm.badroomsDetails.map((room, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="عنوان الغرفة"
                        value={room.title}
                        onChange={(e) => handleArrayItemChange('badroomsDetails', index, 'title', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="وصف الغرفة"
                        value={room.text}
                        onChange={(e) => handleArrayItemChange('badroomsDetails', index, 'text', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} display="flex" alignItems="center" justifyContent="center">
                      <IconButton 
                        color="error"
                        onClick={() => removeArrayItem('badroomsDetails', index)}
                        disabled={chaletForm.badroomsDetails.length <= 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}
          
          {currentTab === 3 && (
            <Box sx={{ mt: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">المميزات</Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<AddIcon />}
                  onClick={() => addArrayItem('features')}
                >
                  إضافة ميزة
                </Button>
              </Box>
              
              {chaletForm.features.map((feature, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="اسم الميزة"
                        value={feature.name}
                        onChange={(e) => handleArrayItemChange('features', index, 'name', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="وصف الميزة"
                        value={feature.description}
                        onChange={(e) => handleArrayItemChange('features', index, 'description', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} display="flex" alignItems="center" justifyContent="center">
                      <IconButton 
                        color="error"
                        onClick={() => removeArrayItem('features', index)}
                        disabled={chaletForm.features.length <= 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}
          
          {currentTab === 4 && (
            <Box sx={{ mt: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">الشروط</Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<AddIcon />}
                  onClick={() => addArrayItem('terms')}
                >
                  إضافة شرط
                </Button>
              </Box>
              
              {chaletForm.terms.map((term, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="الشرط"
                        value={term.term}
                        onChange={(e) => handleArrayItemChange('terms', index, 'term', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} display="flex" alignItems="center">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={term.allowed}
                            onChange={(e) => handleArrayItemChange('terms', index, 'allowed', e.target.checked)}
                            name={`allowed-${index}`}
                          />
                        }
                        label={term.allowed ? "مسموح" : "غير مسموح"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} display="flex" alignItems="center" justifyContent="center">
                      <IconButton 
                        color="error"
                        onClick={() => removeArrayItem('terms', index)}
                        disabled={chaletForm.terms.length <= 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>إلغاء</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleSubmit(true)}
            disabled={loading}
          >
            {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Chalet Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          إضافة شاليه جديد
        </DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="chalet add tabs">
              <Tab label="المعلومات الأساسية" />
              <Tab label="الصور" />
              <Tab label="تفاصيل الغرف" />
              <Tab label="المميزات" />
              <Tab label="الشروط" />
            </Tabs>
          </Box>
          
          {/* Same form content as edit dialog, with different actions */}
          {currentTab === 0 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="اسم الشاليه"
                  name="name"
                  value={chaletForm.name}
                  onChange={handleFormChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.city} required>
                  <InputLabel id="add-city-label">المدينة</InputLabel>
                  <Select
                    labelId="add-city-label"
                    name="city"
                    value={chaletForm.city}
                    label="المدينة"
                    onChange={handleFormChange}
                  >
                    {cities.map(city => (
                      <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                    ))}
                  </Select>
                  {formErrors.city && <Typography color="error" variant="caption">{formErrors.city}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.village} required>
                  <InputLabel id="add-village-label">القرية</InputLabel>
                  <Select
                    labelId="add-village-label"
                    name="village"
                    value={chaletForm.village}
                    label="القرية"
                    onChange={handleFormChange}
                    disabled={!chaletForm.city}
                  >
                    {filteredVillages.map(village => (
                      <MenuItem key={village._id} value={village._id}>{village.name}</MenuItem>
                    ))}
                  </Select>
                  {formErrors.village && <Typography color="error" variant="caption">{formErrors.village}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="الموقع"
                  name="location"
                  value={chaletForm.location}
                  onChange={handleFormChange}
                  error={!!formErrors.location}
                  helperText={formErrors.location}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="add-type-label">النوع</InputLabel>
                  <Select
                    labelId="add-type-label"
                    name="type"
                    value={chaletForm.type}
                    label="النوع"
                    onChange={handleFormChange}
                  >
                    <MenuItem value="شاليه">شاليه</MenuItem>
                    <MenuItem value="فله">فله</MenuItem>
                   
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="السعر لليلة"
                  name="price"
                  type="number"
                  value={chaletForm.price}
                  onChange={handleFormChange}
                  error={!!formErrors.price}
                  helperText={formErrors.price}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">جنيه</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="الكود"
                  name="code"
                  value={chaletForm.code}
                  onChange={handleFormChange}
                  error={!!formErrors.code}
                  helperText={formErrors.code}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="عدد الغرف"
                  name="bedrooms"
                  type="number"
                  value={chaletForm.bedrooms}
                  onChange={handleFormChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="عدد الحمامات"
                  name="bathrooms"
                  type="number"
                  value={chaletForm.bathrooms}
                  onChange={handleFormChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="عدد الضيوف"
                  name="guests"
                  type="number"
                  value={chaletForm.guests}
                  onChange={handleFormChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </Grid>
          )}
          
          {currentTab === 1 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>الصورة الرئيسية</Typography>
                <input
                  type="file"
                  accept="image/*"
                  name="mainImg"
                  onChange={handleFormChange}
                  style={{display: 'block', marginBottom: '10px'}}
                  required
                />
                {formErrors.mainImg && <Typography color="error" variant="caption">{formErrors.mainImg}</Typography>}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>الصور الإضافية</Typography>
                <input
                  type="file"
                  accept="image/*"
                  name="imgs"
                  onChange={handleFormChange}
                  multiple
                  style={{display: 'block'}}
                />
              </Grid>
            </Grid>
          )}
          
          {currentTab === 2 && (
            <Box sx={{ mt: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">تفاصيل الغرف</Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<AddIcon />}
                  onClick={() => addArrayItem('badroomsDetails')}
                >
                  إضافة غرفة
                </Button>
              </Box>
              
              {chaletForm.badroomsDetails.map((room, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="عنوان الغرفة"
                        value={room.title}
                        onChange={(e) => handleArrayItemChange('badroomsDetails', index, 'title', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="وصف الغرفة"
                        value={room.text}
                        onChange={(e) => handleArrayItemChange('badroomsDetails', index, 'text', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} display="flex" alignItems="center" justifyContent="center">
                      <IconButton 
                        color="error"
                        onClick={() => removeArrayItem('badroomsDetails', index)}
                        disabled={chaletForm.badroomsDetails.length <= 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}
          
          {currentTab === 3 && (
            <Box sx={{ mt: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">المميزات</Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<AddIcon />}
                  onClick={() => addArrayItem('features')}
                >
                  إضافة ميزة
                </Button>
              </Box>
              
              {chaletForm.features.map((feature, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="اسم الميزة"
                        value={feature.name}
                        onChange={(e) => handleArrayItemChange('features', index, 'name', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="وصف الميزة"
                        value={feature.description}
                        onChange={(e) => handleArrayItemChange('features', index, 'description', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} display="flex" alignItems="center" justifyContent="center">
                      <IconButton 
                        color="error"
                        onClick={() => removeArrayItem('features', index)}
                        disabled={chaletForm.features.length <= 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}
          
          {currentTab === 4 && (
            <Box sx={{ mt: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">الشروط</Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<AddIcon />}
                  onClick={() => addArrayItem('terms')}
                >
                  إضافة شرط
                </Button>
              </Box>
              
              {chaletForm.terms.map((term, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="الشرط"
                        value={term.term}
                        onChange={(e) => handleArrayItemChange('terms', index, 'term', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} display="flex" alignItems="center">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={term.allowed}
                            onChange={(e) => handleArrayItemChange('terms', index, 'allowed', e.target.checked)}
                            name={`allowed-${index}`}
                          />
                        }
                        label={term.allowed ? "مسموح" : "غير مسموح"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} display="flex" alignItems="center" justifyContent="center">
                      <IconButton 
                        color="error"
                        onClick={() => removeArrayItem('terms', index)}
                        disabled={chaletForm.terms.length <= 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>إلغاء</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleSubmit(false)}
            disabled={loading}
          >
            {loading ? 'جاري الإضافة...' : 'إضافة الشاليه'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          تأكيد الحذف
        </DialogTitle>
        <DialogContent>
          <Typography>
            هل أنت متأكد من رغبتك في حذف هذا الشاليه؟ هذا الإجراء لا يمكن التراجع عنه.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDeleteConfirm}
            disabled={loading}
          >
            {loading ? 'جاري الحذف...' : 'تأكيد الحذف'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminChalets;