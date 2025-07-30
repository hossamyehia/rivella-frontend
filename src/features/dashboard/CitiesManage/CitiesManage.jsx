import React, { useState, useEffect } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  IconButton,
  Paper,
  Typography
} from '@mui/material';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useApiContext } from '../../../shared/context/api.context';
import CityService from './services/City.service';
import Loader from '../../../shared/components/Loader';

const CitiesManage = () => {
  const { axiosInstance, isLoading, setIsLoading } = useApiContext();
  const _CityService = new CityService(axiosInstance);
  const [cities, setCities] = useState([]);
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
    (async () => {
      setIsLoading(true);
      try {
        const response = await _CityService.getCities();
        if (!response.success) {
          setError(response.message);
          return;
        }
        setCities(response.data.data);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleDeleteClick = (cityId) => {
    setSelectedCityId(cityId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await _CityService.deleteCity(selectedCityId);
      if (!response.success) {
        Swal.fire({
          title: 'خطأ',
          text: response.message,
          icon: 'error',
          confirmButtonText: 'حسناً'
        });
        return;
      }
      setCities(cities.filter(city => city._id !== selectedCityId));
      Swal.fire({
        title: 'تم الحذف',
        text: 'تم حذف المدينة بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCityId(null);
      setIsLoading(false);
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
    if (!isEditing && !cityForm.image) errors.image = 'صورة المدينة مطلوبة';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const formDataObj = new FormData();
    formDataObj.append('name', cityForm.name);
    formDataObj.append('description', cityForm.description);
    if (cityForm.image) formDataObj.append('img', cityForm.image);
    isEditing ? await onUpdateCity(selectedCityId, formDataObj) : await onAddCity(formDataObj);

    setFormDialogOpen(false);
  };

  const onAddCity = async (cityData) => {
    setIsLoading(true);
    try {
      const response = await _CityService.createCity(cityData);
      if (!response.success) {
        Swal.fire({
          title: 'خطأ',
          text: response.message || 'حدث خطأ أثناء إضافة المدينة',
          icon: 'error',
          confirmButtonText: 'حسناً'
        });
        return;
      }
      setCities([...cities, response.data.data]);
      setFormDialogOpen(false);
      setCityForm({ name: '', description: '', image: null, imagePreview: null });
      Swal.fire({
        title: 'تمت الإضافة',
        text: 'تم إضافة المدينة بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdateCity = async (cityId, cityData) => {
    setIsLoading(true);
    try {
      const response = await _CityService.updateCity(cityId, cityData);
      if (!response.success) {
        Swal.fire({
          title: 'خطأ',
          text: response.message || 'حدث خطأ أثناء تحديث المدينة',
          icon: 'error',
          confirmButtonText: 'حسناً'
        });
        return;
      }
      setCities(cities.map(city => city._id === cityId ? { ...city, ...response.data } : city));
      setFormDialogOpen(false);
      setCityForm({ name: '', description: '', image: null, imagePreview: null });
      Swal.fire({
        title: 'تم التحديث',
        text: 'تم تحديث المدينة بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setIsLoading(false);
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

  if (isLoading && cities.length === 0) return <Loader />;

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
          rowsPerPageOptions={[8, 16, 24]}
          disableSelectionOnClick
          loading={isLoading}
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
                {cityForm.imagePreview && (<Avatar variant="rounded" src={cityForm.imagePreview} sx={{ width: '100%', maxHeight: 200, mb: 2 }} />)}
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
          <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>{isEditing ? 'حفظ التعديلات' : 'إضافة'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CitiesManage;
