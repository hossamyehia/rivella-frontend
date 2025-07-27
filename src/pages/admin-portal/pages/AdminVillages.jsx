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
  MenuItem,
  Chip,
  ImageList,
  ImageListItem,
  Card,
  CardMedia,
  Container
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Loader from '../../../components/Loader';
import Swal from 'sweetalert2';
import { useApiContext } from '../../../context/ApiContext';
import VillageService from '../../../services/Village.service';
import { useServicesContext } from '../../../context/ServicesContext';
import FeaturesTab from '../../../components/features/AddEditChalet/tabs/FeaturesTab';

const AdminVillages = () => {
  const { axiosInstance, isLoading, setIsLoading } = useApiContext();
  const _VillageService = new VillageService(axiosInstance);
  const { waitingCall } = useServicesContext();
  const [villages, setVillages] = useState([]);
  const [cities, setCities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  // const [featureDialogOpen, setFeatureDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVillageId, setSelectedVillageId] = useState(null);
  const [villageForm, setVillageForm] = useState({
    name: '',
    description: '',
    cityId: '',
    image: null,
    imagePreview: null,
    features: [],
    images: [],
    imagesPreviews: []
  });
  const [formErrors, setFormErrors] = useState({});
  // const [featureForm, setFeatureForm] = useState({
  //   name: '',
  //   description: ''
  // });
  // const [featureErrors, setFeatureErrors] = useState({});

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const [villagesResponse, citiesResponse, featuresResponse] = await Promise.all([
          _VillageService.getVillages(),
          waitingCall("LookupsService", "getCities"),
          waitingCall("LookupsService", "getFeatures"),
        ]);

        if (!citiesResponse.success) {
          setError(citiesResponse.message || 'فشل في جلب بيانات المدن');
        }
        if (!villagesResponse.success) {
          setError(villagesResponse.message || 'فشل في جلب بيانات القرى');
        }
        if (!featuresResponse.success) {
          setError(featuresResponse.message || 'فشل في جلب بيانات المميزات');
        }

        if (villagesResponse.success) {
          setVillages(villagesResponse.data.data.map(village => ({
            ...village,
            id: village._id
          })));
        }
        if (citiesResponse.success) {
          setCities(citiesResponse.data.data.map(city => ({
            id: city._id,
            name: city.name,
            _id: city._id
          })));
        }
        if (featuresResponse.success) {
          setFeatures(featuresResponse.data.data);
        }
        setError('');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleDeleteClick = (villageId) => {
    setSelectedVillageId(villageId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(false);
    try {
      const response = await _VillageService.deleteVillage(selectedVillageId);
      if (response.success) {
        setVillages(villages.filter(v => v._id !== selectedVillageId));
        Swal.fire({ title: 'تم الحذف', text: 'تم حذف القرية بنجاح', icon: 'success', confirmButtonText: 'حسناً' });
      } else {
        Swal.fire({ title: 'خطأ', text: response.message, icon: 'error', confirmButtonText: 'حسناً' });
      }
    } finally {
      setDeleteDialogOpen(false);
      setSelectedVillageId(null);
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setVillageForm({
      name: '',
      description: '',
      cityId: '',
      image: null,
      imagePreview: null,
      features: [],
      images: [],
      imagesPreviews: []
    });
    setFormErrors({});
    setFormDialogOpen(true);
  };

  const handleEditClick = (row) => {
    setIsEditing(true);
    setSelectedVillageId(row._id);
    setVillageForm({
      name: row.name,
      description: row.description || '',
      cityId: row.cityId || row.city?._id,
      image: null,
      imagePreview: row.img, // existing main image URL
      features: row.features?.map((value)=> {return { ...value, feature: value.feature?._id || "" }}) || [],
      images: [],
      imagesPreviews: row.imgs || [] // existing additional images URLs
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


  const handleMainImageChange = (e) => {
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

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...villageForm.images, ...files];
      const newImagesPreviews = [
        ...villageForm.imagesPreviews,
        ...files.map(file => URL.createObjectURL(file))
      ];

      setVillageForm({
        ...villageForm,
        images: newImages,
        imagesPreviews: newImagesPreviews
      });
    }
  };

  const handleRemoveAdditionalImage = (index) => {
    const newImages = [...villageForm.images];
    const newImagesPreviews = [...villageForm.imagesPreviews];

    // If it's a newly added image
    if (index < newImages.length) {
      newImages.splice(index, 1);
    }
    newImagesPreviews.splice(index, 1);

    setVillageForm({
      ...villageForm,
      images: newImages,
      imagesPreviews: newImagesPreviews
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!villageForm.name.trim()) errors.name = 'اسم القرية مطلوب';
    if (!villageForm.cityId) errors.cityId = 'اختيار المدينة مطلوب';
    if (!isEditing && !villageForm.image) errors.image = 'صورة القرية الرئيسية مطلوبة';
    // if (villageForm.features.length <= 0) errors.features = "يرجي اختيار ميزة واحد علي الاقل"
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', villageForm.name);
    formData.append('description', villageForm.description);
    formData.append('city', villageForm.cityId);

    // Append features as JSON
    formData.append('features', JSON.stringify(villageForm.features));

    // Append main image if available
    if (villageForm.image) {
      formData.append('img', villageForm.image);
    }

    // Append additional images
    if (villageForm.images.length > 0) {
      villageForm.images.forEach((image) => {
        formData.append('imgs', image);
      });
    }

    isEditing ? await onEditVillage(selectedVillageId, formData) : await onAddVillage(formData);
    setFormDialogOpen(false);
    setVillageForm({
      name: '',
      description: '',
      cityId: '',
      image: null,
      imagePreview: null,
      features: [],
      images: [],
      imagesPreviews: []
    });
    setIsEditing(false);
    setSelectedVillageId(null);
    setFormErrors({});
  };

  const onAddVillage = async (villageData) => {
    setIsLoading(true);
    try {
      const response = await _VillageService.addVillage(villageData);
      if (response.success) {
        setVillages([...villages, { ...response.data.data, id: response.data.data._id }]);
        Swal.fire({ title: 'تمت الإضافة', text: 'تم إضافة القرية بنجاح', icon: 'success', confirmButtonText: 'حسناً' });
      } else {
        Swal.fire({ title: 'خطأ', text: response.message, icon: 'error', confirmButtonText: 'حسناً' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onEditVillage = async (id, villageData) => {
    setIsLoading(true);
    try {
      const response = await _VillageService.updateVillage(id, villageData);
      if (response.success) {
        setVillages(villages.map(v => (v._id === id ? { ...response.data.data, id: response.data.data._id } : v)));
        Swal.fire({ title: 'تم التعديل', text: 'تم تعديل القرية بنجاح', icon: 'success', confirmButtonText: 'حسناً' });
      } else {
        Swal.fire({ title: 'خطأ', text: response.message, icon: 'error', confirmButtonText: 'حسناً' });
      }
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
        <Avatar src={params.value} alt={params.row?.name || ''} variant="rounded" sx={{ width: 50, height: 50 }} />
      ),
    },
    { field: 'name', headerName: 'اسم القرية', width: 200 },
    {
      field: 'description',
      headerName: 'الوصف',
      width: 200,
    },
    {
      field: 'cityName',
      headerName: 'المدينة',
      width: 150,
      valueGetter: (params = {}) => params.row?.city?.name || '—'
    },
    {
      field: 'features',
      headerName: 'الميزات',
      width: 200,
      renderCell: (params) => {
        const features = params.row?.features ? params.row?.features?.map((value)=> {return {...value, name: value.feature?.name || value.name || "", price: value.price || 0}}) : [];
        return features.length ? (
          <Box sx={{ height: "100%", width: "100%", display: 'flex', alignContent: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 0.5 }}>
            {features.slice(0, 2).map((feature, index) => (
              <Chip key={index} sx={{lineHeight: '3ch'}} label={`${feature.name} - ${feature.price || 'مجاني'}`} size="small" />
            ))}
            {/* {features.length > 2 && <Chip label={`+${features.length - 2}`} size="small" variant="outlined" />} */}
          </Box>
        ) : '—';
      }
    },
    {
      field: 'imgs',
      headerName: 'عدد الصور',
      width: 100,
      valueGetter: (params = {}) => {
        const imgsCount = Array.isArray(params.row?.imgs) ? params.row.imgs.length : 0;
        return imgsCount + 1; // +1 for the main image
      }
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

  if (isLoading && villages.length === 0) return <Loader />;

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
          disableVirtualization
          loading={isLoading}
          getRowId={(row) => row._id || row._id}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'primary.main',
              color: 'black',
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

      {/* Add Feature Dialog */}
      {/* <Dialog open={featureDialogOpen} onClose={() => setFeatureDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>إضافة ميزة جديدة</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="اسم الميزة"
                value={featureForm.name}
                onChange={handleFeatureInputChange}
                fullWidth
                error={!!featureErrors.name}
                helperText={featureErrors.name}
                sx={{ fontSize: '18px' }}
                inputProps={{ style: { fontSize: '16px' } }}
                InputLabelProps={{ style: { fontSize: '16px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="وصف الميزة (اختياري)"
                value={featureForm.description}
                onChange={handleFeatureInputChange}
                fullWidth
                multiline
                rows={3}
                error={!!featureErrors.description}
                helperText={featureErrors.description}
                inputProps={{ style: { fontSize: '16px' } }}
                InputLabelProps={{ style: { fontSize: '16px' } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setFeatureDialogOpen(false)} color="inherit" sx={{ fontSize: '16px' }}>إلغاء</Button>
          <Button
            onClick={handleAddFeature}
            color="primary"
            variant="contained"
            sx={{ fontSize: '16px', px: 4, py: 1 }}
          >
            إضافة
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Add/Edit Village Dialog */}
      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="md">
        <DialogTitle>{isEditing ? 'تعديل قرية' : 'إضافة قرية جديدة'}</DialogTitle>
        <DialogContent>
          <Container maxWidth="md" sx={{ mt: 4 }}>
            <Grid container justifyContent={'center'} spacing={3}>
              <Grid item xs={12} sx={{ minWidth: '300px', maxWidth: '600px', width: '100%' }}>
                <TextField
                  name="name"
                  label="اسم القرية"
                  value={villageForm.name}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  inputProps={{ style: { fontSize: '16px' } }}
                  InputLabelProps={{ style: { fontSize: '16px' } }}
                />
              </Grid>

              <Grid item xs={12} sx={{ minWidth: '300px', maxWidth: '600px', width: '100%' }}>
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

              <Grid item xs={12} sx={{ minWidth: '300px', maxWidth: '600px', width: '100%' }}>
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
                      <MenuItem key={city._id} value={city._id} sx={{ fontSize: '16px' }}>{city.name}</MenuItem>
                    ))}
                  </Select>
                  {formErrors.cityId && (
                    <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block', fontSize: '14px' }}>
                      {formErrors.cityId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ minWidth: '300px', maxWidth: '600px', width: '100%' }}>

                {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">ميزات القرية</Typography>
                  <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenFeatureDialog} sx={{ fontSize: '15px' }}>
                    إضافة ميزة
                  </Button>
                </Box>

                {villageForm.features.length > 0 ? (
                  <List sx={{ bgcolor: 'background.paper', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    {villageForm.features.map((feature, index) => (
                      <ListItem key={index} divider={index !== villageForm.features.length - 1}>
                        <ListItemText
                          primary={feature.name}
                          secondary={feature.description}
                          primaryTypographyProps={{ fontWeight: 'bold' }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFeature(index)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    لم يتم إضافة أي ميزات بعد. انقر على "إضافة ميزة" لإضافة ميزات للقرية.
                  </Typography>
                )} */}
                <FeaturesTab
                  dataForm={villageForm}
                  setDataForm={setVillageForm}
                  formErrors={formErrors}
                  features={features}
                />
              </Grid>

              <Grid item xs={12} sx={{ minWidth: '300px', maxWidth: '600px', width: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>الصورة الرئيسية</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  {villageForm.imagePreview && (
                    <Box
                      component="img"
                      src={villageForm.imagePreview}
                      alt="صورة القرية"
                      sx={{ width: '100%', maxHeight: 200, objectFit: 'cover', mb: 2, borderRadius: 1 }}
                    />
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{ height: '56px', fontSize: '16px' }}
                  >
                    {isEditing ? 'تغيير الصورة الرئيسية' : 'رفع الصورة الرئيسية'}
                    <input type="file" accept="image/*" hidden onChange={handleMainImageChange} />
                  </Button>
                  {formErrors.image && (
                    <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block', fontSize: '14px' }}>
                      {formErrors.image}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ minWidth: '300px', maxWidth: '600px', width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">صور إضافية للقرية</Typography>
                  <Button variant="outlined" component="label" startIcon={<AddPhotoAlternateIcon />} sx={{ fontSize: '15px' }}>
                    إضافة صور
                    <input type="file" accept="image/*" hidden multiple onChange={handleAdditionalImagesChange} />
                  </Button>
                </Box>

                {villageForm.imagesPreviews.length > 0 ? (
                  <ImageList sx={{ height: 250, overflowY: 'auto' }} cols={3} gap={8}>
                    {villageForm.imagesPreviews.map((imgSrc, index) => (
                      <ImageListItem key={index}>
                        <Card sx={{ position: 'relative', height: '100%' }}>
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: 5,
                              right: 5,
                              bgcolor: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                            }}
                            size="small"
                            onClick={() => handleRemoveAdditionalImage(index)}
                          >
                            <CloseIcon />
                          </IconButton>
                          <CardMedia
                            component="img"
                            image={imgSrc}
                            alt={`صورة إضافية ${index + 1}`}
                            sx={{ height: '100%', objectFit: 'cover' }}
                          />
                        </Card>
                      </ImageListItem>
                    ))}
                  </ImageList>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    لم يتم إضافة أي صور إضافية بعد. انقر على "إضافة صور" لإضافة المزيد من الصور للقرية.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Container>

        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setFormDialogOpen(false)} color="inherit" sx={{ fontSize: '16px' }}>إلغاء</Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={isLoading}
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
