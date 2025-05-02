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
  Avatar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { MyContext } from '../../context/MyContext';
import Loader from '../../components/Loader';
import Swal from 'sweetalert2';

const AdminCities = () => {
  const { axiosInstance } = useContext(MyContext);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [cityForm, setCityForm] = useState({
    name: '',
    description: '',
    image: null,
    imagePreview: null
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/city');
      setCities(response.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching cities:', err);
      setError('فشل في جلب بيانات المدن');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (cityId) => {
    setSelectedCityId(cityId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/city/${selectedCityId}`, { headers: { token: localStorage.getItem('token') } });
      setCities(cities.filter(city => city._id !== selectedCityId));
      Swal.fire({ title: 'تم الحذف', text: 'تم حذف المدينة بنجاح', icon: 'success', confirmButtonText: 'حسناً' });
    } catch (err) {
      console.error('Error deleting city:', err);
      Swal.fire({ title: 'خطأ', text: err.response?.data?.message || 'حدث خطأ أثناء حذف المدينة', icon: 'error', confirmButtonText: 'حسناً' });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCityId(null);
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setCityForm({ name: '', description: '', image: null, imagePreview: null });
    setFormErrors({});
    setFormDialogOpen(true);
  };

  const handleEditClick = (city) => {
    setIsEditing(true);
    setSelectedCityId(city._id);
    setCityForm({ name: city.name, description: city.description, image: null, imagePreview: city.img });
    setFormErrors({});
    setFormDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCityForm({ ...cityForm, [name]: value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCityForm({ ...cityForm, image: file, imagePreview: URL.createObjectURL(file) });
      if (formErrors.image) setFormErrors({ ...formErrors, image: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!cityForm.name.trim()) errors.name = 'اسم المدينة مطلوب';
    if (!cityForm.description.trim()) errors.description = 'وصف المدينة مطلوب';
    if (!isEditing && !cityForm.image) errors.image = 'صورة المدينة مطلوبة';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', cityForm.name);
      formDataObj.append('description', cityForm.description);
      if (cityForm.image) formDataObj.append('img', cityForm.image);
      let response;
      if (isEditing) {
        response = await axiosInstance.put(`/city/${selectedCityId}`, formDataObj, { headers: { token: localStorage.getItem('token') } });
        setCities(cities.map(city => city._id === selectedCityId ? response.data.data : city));
      } else {
        response = await axiosInstance.post('/city', formDataObj, { headers: { token: localStorage.getItem('token') } });
        setCities([...cities, response.data.data]);
      }
      setFormDialogOpen(false);
      Swal.fire({ title: isEditing ? 'تم التعديل' : 'تمت الإضافة', text: isEditing ? 'تم تعديل المدينة بنجاح' : 'تم إضافة المدينة بنجاح', icon: 'success', confirmButtonText: 'حسناً' });
    } catch (err) {
      console.error('Error submitting city:', err);
      Swal.fire({ title: 'خطأ', text: err.response?.data?.message || `حدث خطأ أثناء ${isEditing ? 'تعديل' : 'إضافة'} المدينة`, icon: 'error', confirmButtonText: 'حسناً' });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: 'img',
      headerName: 'الصورة',
      width: 100,
      renderCell: (params) => (
        <Avatar src={params.value} alt={params.row.name} variant="rounded" sx={{ width: 50, height: 50 }} />
      ),
    },
    { field: 'name', headerName: 'اسم المدينة', flex: 1 },
    { field: 'description', headerName: 'الوصف', flex: 1 },
    { field: 'villagesCount', headerName: 'عدد القرى', width: 120, type: 'number' },
    { field: 'chaletsCount', headerName: 'عدد الشاليهات', width: 120, type: 'number' },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleEditClick(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteClick(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading && cities.length === 0) return <Loader />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">إدارة المدن</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>إضافة مدينة</Button>
      </Box>
      <Divider sx={{ mb: 3 }} />
      {error && (<Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>)}
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={cities}
          getRowId={(row) => row._id}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8,16,24]}
          disableSelectionOnClick
          loading={loading}
        />
      </Paper>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>هل أنت متأكد من رغبتك في حذف هذه المدينة؟ سيتم حذف جميع القرى والشاليهات المرتبطة بها.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
          <Button color="error" onClick={handleDeleteConfirm}>حذف</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'تعديل مدينة' : 'إضافة مدينة جديدة'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField name="name" label="اسم المدينة" value={cityForm.name} onChange={handleInputChange} fullWidth error={!!formErrors.name} helperText={formErrors.name} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="description" label="وصف المدينة" value={cityForm.description} onChange={handleInputChange} fullWidth multiline rows={3} error={!!formErrors.description} helperText={formErrors.description} />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                {cityForm.imagePreview && (<Avatar variant="rounded" src={cityForm.imagePreview} sx={{ width: '100%', maxHeight: 200, mb:2 }} />)}
                <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} fullWidth>
                  {isEditing ? 'تغيير الصورة' : 'رفع صورة المدينة'}
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </Button>
                {formErrors.image && <Typography color="error" variant="caption">{formErrors.image}</Typography>}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialogOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>{isEditing ? 'حفظ التعديلات' : 'إضافة'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCities;
