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
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { MyContext } from '../../context/MyContext';
import Loader from '../../components/Loader';
import Swal from 'sweetalert2';

const AdminVillages = () => {
  const { axiosInstance } = useContext(MyContext);
  const [villages, setVillages] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVillageId, setSelectedVillageId] = useState(null);
  const [villageForm, setVillageForm] = useState({
    name: '',
    description: '', // أضفنا حقل الوصف هنا
    cityId: '',
    image: null,
    imagePreview: null
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchVillages();
    fetchCities();
  }, []);

  const fetchVillages = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/village', { headers: { token: localStorage.getItem('token') } });
      const transformedData = response.data.data.map(village => ({
        ...village,
        id: village._id 
      }));
      setVillages(transformedData);
      setError('');
    } catch (err) {
      console.error('Error fetching villages:', err);
      setError('فشل في جلب بيانات القرى');
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axiosInstance.get('/city', { headers: { token: localStorage.getItem('token') } });
      // Transform city objects to have id field for DataGrid
      const transformedCities = response.data.data.map(city => ({ 
        id: city._id, 
        name: city.name,
        _id: city._id // Keep the original _id as well
      }));
      setCities(transformedCities);
    } catch (err) {
      console.error('Error fetching cities:', err);
      setError('فشل في جلب بيانات المدن');
    }
  };

  const handleDeleteClick = (villageId) => {
    setSelectedVillageId(villageId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/village/${selectedVillageId}`, { headers: { token: localStorage.getItem('token') } });
      setVillages(villages.filter(v => v._id !== selectedVillageId));
      Swal.fire({ title: 'تم الحذف', text: 'تم حذف القرية بنجاح', icon: 'success', confirmButtonText: 'حسناً' });
    } catch (err) {
      console.error('Error deleting village:', err);
      Swal.fire({ title: 'خطأ', text: err.response?.data?.message || 'حدث خطأ أثناء حذف القرية', icon: 'error', confirmButtonText: 'حسناً' });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedVillageId(null);
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setVillageForm({ name: '', description: '', cityId: '', image: null, imagePreview: null });
    setFormErrors({});
    setFormDialogOpen(true);
  };

  const handleEditClick = (row) => {
    setIsEditing(true);
    setSelectedVillageId(row._id);
    setVillageForm({
      name: row.name,
      description: row.description || '', // أضفنا حقل الوصف هنا
      cityId: row.cityId,
      image: null,
      imagePreview: row.img // existing image URL
    });
    setFormErrors({});
    setFormDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVillageForm({ ...villageForm, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVillageForm({
        ...villageForm,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
      if (formErrors.image) {
        setFormErrors({ ...formErrors, image: '' });
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!villageForm.name.trim()) errors.name = 'اسم القرية مطلوب';
    if (!villageForm.description.trim()) errors.description = 'وصف القرية مطلوب';
    if (!villageForm.cityId) errors.cityId = 'اختيار المدينة مطلوب';
    if (!isEditing && !villageForm.image) errors.image = 'صورة القرية مطلوبة';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', villageForm.name);
      formData.append('description', villageForm.description); // أضفنا حقل الوصف هنا
      formData.append('city', villageForm.cityId);
      if (villageForm.image) formData.append('img', villageForm.image);

      if (isEditing) {
        const response = await axiosInstance.put(`/village/${selectedVillageId}`, formData, { headers: { token: localStorage.getItem('token') } });
        const updated = response.data.data;
        // Make sure to add the id field for DataGrid
        updated.id = updated._id;
        setVillages(villages.map(v => (v._id === selectedVillageId ? updated : v)));
        Swal.fire({ title: 'تم التعديل', text: 'تم تعديل القرية بنجاح', icon: 'success', confirmButtonText: 'حسناً' });
      } else {
        const response = await axiosInstance.post('/village', formData, { headers: { token: localStorage.getItem('token') } });
        const created = response.data.data;
        // Make sure to add the id field for DataGrid
        created.id = created._id;
        setVillages([...villages, created]);
        Swal.fire({ title: 'تمت الإضافة', text: 'تم إضافة القرية بنجاح', icon: 'success', confirmButtonText: 'حسناً' });
      }
      setFormDialogOpen(false);
    } catch (err) {
      console.error('Error submitting village:', err);
      Swal.fire({ title: 'خطأ', text: err.response?.data?.message || `حدث خطأ أثناء ${isEditing ? 'تعديل' : 'إضافة'} القرية`, icon: 'error', confirmButtonText: 'حسناً' });
    } finally {
      setLoading(false);
    }
  };

  // Function to safely get city name
  const getCityName = (cityId) => {
    if (!cityId) return '';
    const city = cities.find(c => c.id === cityId || c._id === cityId);
    return city ? city.name : '';
  };

  const columns = [
    // حذفنا عمود الـ id
    {
      field: 'img',
      headerName: 'الصورة',
      width: 100,
      renderCell: (params) => (
        <Avatar src={params.value} alt={params.row?.name || ''} variant="rounded" sx={{ width: 50, height: 50 }} />
      ),
    },
    { field: 'name', headerName: 'اسم القرية', width: 200 },
    {
      field: 'description',
      headerName: 'الوصف',
      width: 250,
    },
    {
      field: 'cityName',
      headerName: 'المدينة',
      width: 150,
      // نضمن params دائماً ككائن ونقرأ الاسم بأمان
      valueGetter: (params = {}) => params.row?.city?.name || '—'
    },
    
    
    { field: 'chaletsCount', headerName: 'عدد الشاليهات', width: 120, type: 'number' },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 120,
      renderCell: (params) => {
        if (!params || !params.row) return null;
        return (
          <Box>
            <IconButton color="primary" onClick={() => handleEditClick(params.row)} aria-label="تعديل">
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleDeleteClick(params.row._id)} aria-label="حذف">
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  if (loading && villages.length === 0) return <Loader />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">إدارة القرى</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>إضافة قرية</Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={villages}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8, 16, 24]}
          disableSelectionOnClick
          loading={loading}
          getRowId={(row) => row.id || row._id}
          sx={{ 
            '& .MuiDataGrid-columnHeaders': { 
              backgroundColor: 'primary.main', 
              color: 'black', // تغيير لون الخط إلى أسود
              fontWeight: 'bold',
              fontSize: '16px'
            } 
          }}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>هل أنت متأكد من رغبتك في حذف هذه القرية؟ سيتم حذف جميع الشاليهات المرتبطة بها.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">إلغاء</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>حذف</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Village Dialog */}
      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'تعديل قرية' : 'إضافة قرية جديدة'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* كل حقل في سطر منفصل */}
            <Grid item xs={12}>
              <TextField
                name="name"
                label="اسم القرية"
                value={villageForm.name}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.name}
                helperText={formErrors.name}
                sx={{ fontSize: '18px' }}
                inputProps={{ style: { fontSize: '16px' } }}
                InputLabelProps={{ style: { fontSize: '16px' } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="وصف القرية"
                value={villageForm.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                error={!!formErrors.description}
                helperText={formErrors.description}
                inputProps={{ style: { fontSize: '16px' } }}
                InputLabelProps={{ style: { fontSize: '16px' } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.cityId}>
                <InputLabel id="city-select-label" sx={{ fontSize: '16px' }}>المدينة</InputLabel>
                <Select
                  labelId="city-select-label"
                  id="city-select"
                  name="cityId"
                  value={villageForm.cityId}
                  label="المدينة"
                  onChange={handleInputChange}
                  sx={{ fontSize: '16px', height: '56px' }}
                >
                  {cities.map(city => (
                    <MenuItem key={city.id} value={city.id} sx={{ fontSize: '16px' }}>{city.name}</MenuItem>
                  ))}
                </Select>
                {formErrors.cityId && <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block', fontSize: '14px' }}>{formErrors.cityId}</Typography>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                {villageForm.imagePreview && (
                  <Box component="img" src={villageForm.imagePreview} alt="صورة القرية" sx={{ width: '100%', maxHeight: 200, objectFit: 'cover', mb: 2, borderRadius: 1 }} />
                )}
                <Button 
                  variant="outlined" 
                  component="label" 
                  startIcon={<CloudUploadIcon />} 
                  fullWidth
                  sx={{ height: '56px', fontSize: '16px' }}
                >
                  {isEditing ? 'تغيير الصورة' : 'رفع صورة القرية'}
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </Button>
                {formErrors.image && <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block', fontSize: '14px' }}>{formErrors.image}</Typography>}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setFormDialogOpen(false)} color="inherit" sx={{ fontSize: '16px' }}>إلغاء</Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained" 
            disabled={loading}
            sx={{ fontSize: '16px', px: 4, py: 1 }}
          >
            {isEditing ? 'حفظ التعديلات' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminVillages;