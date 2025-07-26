import React, { useState, useEffect } from 'react';
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
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import Loader from '../../../components/Loader';
import Swal from 'sweetalert2';
import { useApiContext } from '../../../context/ApiContext';

const AdminCoupons = () => {
  const { axiosInstance } = useApiContext();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    maxUses: '',
    expiryDate: null,
    isActive: true,
    minBookingValue: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        '/coupon',
        { headers: { token: localStorage.getItem("token") } }
      );
  
      const transformedCoupons = response.data.data.map(coupon => ({
        ...coupon,
  
        // خزن expiresAt في expiryDate
        expiryDate: coupon.expiresAt,
  
        // usageLimit → maxUses
        maxUses: coupon.usageLimit,
  
        // usedCount كما هو (لو ما فيش اضمن 0)
        usedCount: coupon.usedCount ?? 0,
  
        // نص الخصم: "20%" أو "X جنية"
        discount:
          coupon.discountType === 'percentage'
            ? `${coupon.discountValue}%`
            : `${coupon.discountValue} جنية`,
  
        // الحد الأدنى (إن وجد)
        minBookingValue:
          coupon.minBookingValue != null
            ? `${coupon.minBookingValue} جنية`
            : '-',
  
        // حساب حالة "نشط" من expiresAt
        isActive:
          coupon.expiresAt
            ? new Date(coupon.expiresAt) > new Date()
            : true,
      }));
  
      setCoupons(transformedCoupons);
      setError('');
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('فشل في جلب بيانات الكوبونات');
    } finally {
      setLoading(false);
    }
  };
  

  const handleDeleteClick = (couponId) => {
    setSelectedCouponId(couponId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/coupon/${selectedCouponId}`,{headers:{token:localStorage.getItem("token")}});
      setCoupons(coupons.filter(coupon => coupon._id !== selectedCouponId));
      
      Swal.fire({
        title: 'تم الحذف',
        text: 'تم حذف الكوبون بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً'
      });
    } catch (err) {
      console.error('Error deleting coupon:', err);
      
      Swal.fire({
        title: 'خطأ',
        text: err.response?.data?.message || 'حدث خطأ أثناء حذف الكوبون',
        icon: 'error',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCouponId(null);
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setCouponForm({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      maxUses: '',
      expiryDate: null,
      isActive: true,
      minBookingValue: ''
    });
    setFormErrors({});
    setFormDialogOpen(true);
  };

  const handleEditClick = (coupon) => {
    setIsEditing(true);
    setSelectedCouponId(coupon._id);
    setCouponForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxUses: coupon.maxUses || coupon.usageLimit, // Use either field
      expiryDate: coupon.expiryDate || coupon.expiresAt ? new Date(coupon.expiryDate || coupon.expiresAt) : null,
      isActive: coupon.isActive !== undefined ? coupon.isActive : true,
      minBookingValue: coupon.minBookingValue || ''
    });
    setFormErrors({});
    setFormDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCouponForm({
      ...couponForm,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleDateChange = (newDate) => {
    setCouponForm({
      ...couponForm,
      expiryDate: newDate
    });
    
    if (formErrors.expiryDate) {
      setFormErrors({
        ...formErrors,
        expiryDate: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!couponForm.code.trim()) {
      errors.code = 'كود الكوبون مطلوب';
    }
    
    if (!couponForm.discountValue || isNaN(couponForm.discountValue) || parseFloat(couponForm.discountValue) <= 0) {
      errors.discountValue = 'قيمة الخصم يجب أن تكون رقم أكبر من صفر';
    } else if (couponForm.discountType === 'percentage' && parseFloat(couponForm.discountValue) > 100) {
      errors.discountValue = 'نسبة الخصم يجب أن تكون 100% أو أقل';
    }
    
    if (couponForm.maxUses !== '' && (isNaN(couponForm.maxUses) || parseInt(couponForm.maxUses) < 1)) {
      errors.maxUses = 'عدد الاستخدامات يجب أن يكون رقم صحيح أكبر من صفر';
    }
    
    if (couponForm.minBookingValue !== '' && (isNaN(couponForm.minBookingValue) || parseFloat(couponForm.minBookingValue) < 0)) {
      errors.minBookingValue = 'الحد الأدنى للحجز يجب أن يكون رقم 0 أو أكبر';
    }
    
    if (!couponForm.expiryDate) {
      errors.expiryDate = 'تاريخ انتهاء الصلاحية مطلوب';
    } else if (new Date(couponForm.expiryDate) <= new Date()) {
      errors.expiryDate = 'تاريخ انتهاء الصلاحية يجب أن يكون في المستقبل';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Transform form data to match API expectations
      const couponData = {
        code: couponForm.code,
        discountType: couponForm.discountType,
        discountValue: parseFloat(couponForm.discountValue),
        usageLimit: couponForm.maxUses ? parseInt(couponForm.maxUses) : null, // Map maxUses to usageLimit
        expiresAt: couponForm.expiryDate, // Map expiryDate to expiresAt
        minBookingValue: couponForm.minBookingValue ? parseFloat(couponForm.minBookingValue) : null,
        isActive: couponForm.isActive
      };
      
      let response;
      if (isEditing) {
        response = await axiosInstance.put(`/coupon/${selectedCouponId}`, couponData,{headers:{token:localStorage.getItem("token")}});
        
        // Update local state
        setCoupons(coupons.map(coupon => {
          if (coupon._id === selectedCouponId) {
            // Transform the response data to match your component's structure
            return {
              ...response.data.data || response.data,
              expiryDate: response.data.data?.expiresAt || response.data.expiresAt,
              maxUses: response.data.data?.usageLimit || response.data.usageLimit,
              isActive: true
            };
          }
          return coupon;
        }));
      } else {
        response = await axiosInstance.post('/coupon/create', couponData,{headers:{token:localStorage.getItem("token")}});
        
        // Add new coupon to local state
        const newCoupon = {
          ...response.data.data || response.data,
          expiryDate: response.data.data?.expiresAt || response.data.expiresAt,
          maxUses: response.data.data?.usageLimit || response.data.usageLimit,
          isActive: true
        };
        
        setCoupons([...coupons, newCoupon]);
      }
      
      setFormDialogOpen(false);
      
      Swal.fire({
        title: isEditing ? 'تم التعديل' : 'تمت الإضافة',
        text: isEditing ? 'تم تعديل الكوبون بنجاح' : 'تم إضافة الكوبون بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً'
      });
    } catch (err) {
      console.error('Error submitting coupon:', err);
      
      Swal.fire({
        title: 'خطأ',
        text: err.response?.data?.message || `حدث خطأ أثناء ${isEditing ? 'تعديل' : 'إضافة'} الكوبون`,
        icon: 'error',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: '_id', headerName: 'الرقم', width: 70 },
    { field: 'code', headerName: 'الكود', width: 150 },
  
    { field: 'discount',      headerName: 'الخصم',         width: 120 },
    { field: 'usedCount',     headerName: 'المستخدم',      width: 110 },
  
    {
      field: 'expiryDate',
      headerName: 'تاريخ الانتهاء',
      width: 150,
      valueFormatter: (params) =>
        params.value
          ? new Date(params.value).toLocaleDateString('ar-SA')
          : '-',
    },
  
    {
      field: 'isActive',
      headerName: 'نشط',
      width: 80,
      type: 'boolean',
      renderCell: params => (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: params.value ? 'success.main' : 'error.main',
          }}
        >
          {params.value ? 'نعم' : 'لا'}
        </Box>
      ),
    },  
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 120,
      renderCell: params => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEditClick(params.row)}
            aria-label="تعديل"
          >
            <EditIcon />
          </IconButton>
          <IconButton
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
  
  
  

  if (loading && coupons.length === 0) {
    return <Loader />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          إدارة كوبونات الخصم
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          إضافة كوبون
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ height: 500, width: '100%' }}>
  <DataGrid
    rows={coupons}
    columns={columns}
    getRowId={row => row._id}
    pageSize={8}
    rowsPerPageOptions={[8, 16, 24]}
    disableSelectionOnClick
    loading={loading}
    sx={{
      // Header background stays primary, but text goes black:
      '& .MuiDataGrid-columnHeaders': {
        backgroundColor: 'primary.main',
        color: 'black',
      },
      // Body cells text also forced black:
      '& .MuiDataGrid-cell': {
        color: 'black',
      },
      '& .MuiDataGrid-footerContainer': {
        color: 'black',
      },
    }}
  />
</Paper>

      
     
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>
            هل أنت متأكد من رغبتك في حذف هذا الكوبون؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            إلغاء
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            حذف
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add/Edit Coupon Dialog */}
      <Dialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'تعديل كوبون' : 'إضافة كوبون جديد'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  name="code"
                  label="كود الكوبون"
                  value={couponForm.code}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!formErrors.code}
                  helperText={formErrors.code}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="discount-type-label">نوع الخصم</InputLabel>
                  <Select
                    labelId="discount-type-label"
                    id="discount-type"
                    name="discountType"
                    value={couponForm.discountType}
                    label="نوع الخصم"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="percentage">نسبة مئوية (%)</MenuItem>
                    <MenuItem value="fixed">مبلغ ثابت (جنية)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="discountValue"
                  label="قيمة الخصم"
                  type="number"
                  value={couponForm.discountValue}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {couponForm.discountType === 'percentage' ? '%' : 'جنية'}
                      </InputAdornment>
                    ),
                  }}
                  error={!!formErrors.discountValue}
                  helperText={formErrors.discountValue}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="maxUses"
                  label="الحد الأقصى للاستخدامات (اختياري)"
                  type="number"
                  value={couponForm.maxUses}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!formErrors.maxUses}
                  helperText={formErrors.maxUses}
                />
              </Grid>
             
              <Grid item xs={12}>
                <DatePicker
                  label="تاريخ انتهاء الصلاحية"
                  value={couponForm.expiryDate}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      error={!!formErrors.expiryDate}
                      helperText={formErrors.expiryDate}
                    />
                  )}
                />
              </Grid>
              
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialogOpen(false)} color="inherit">
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            disabled={loading}
          >
            {isEditing ? 'حفظ التعديلات' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCoupons;