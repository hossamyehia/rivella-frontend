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
  TableCell
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MyContext } from '../../context/MyContext';
import Loader from '../../components/Loader';
import { format } from 'date-fns';
import { arDZ } from 'date-fns/locale';
import Swal from 'sweetalert2';

const AdminReservations = () => {
  const { axiosInstance } = useContext(MyContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        '/reservation',
        { headers: { token: localStorage.getItem("token") } }
      );
  
      const transformed = response.data.data.map(r => ({
        ...r,
  
        // 1) اسم الشاليه والضيف/المستخدم (يوحد بين user و guest):
        chaletName:    r.chalet?.name        || '—',
        userName:      r.user?.name          ?? r.guestName ?? '—',
        userEmail:     r.user?.email         ?? r.guestEmail ?? '—',
        userPhone:     r.user?.phone         ?? r.guestPhone ?? '—',
  
        // 2) التاريخ جاهز للعرض كـ string
        checkInFormatted:  format(new Date(r.checkIn),  'dd/MM/yyyy', { locale: arDZ }),
        checkOutFormatted: format(new Date(r.checkOut), 'dd/MM/yyyy', { locale: arDZ }),
  
        // الباقي (days و totalPrice) نستخدمها كما هي
      }));
  
      setReservations(transformed);
      setError('');
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('فشل في جلب بيانات الحجوزات');
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleDeleteClick = (reservationId) => {
    setSelectedReservationId(reservationId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/reservation/${selectedReservationId}`,{headers:{token:localStorage.getItem("token")}});
      setReservations(reservations.filter(reservation => reservation._id !== selectedReservationId));
      
      Swal.fire({
        title: 'تم الحذف',
        text: 'تم حذف الحجز بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً'
      });
    } catch (err) {
      console.error('Error deleting reservation:', err);
      
      Swal.fire({
        title: 'خطأ',
        text: err.response?.data?.message || 'حدث خطأ أثناء حذف الحجز',
        icon: 'error',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedReservationId(null);
      setLoading(false);
    }
  };

  const handleViewClick = (reservation) => {
    setSelectedReservation(reservation);
    setViewDialogOpen(true);
  };

  const handleEditStatusClick = (reservation) => {
    setSelectedReservation(reservation);
    setSelectedReservationId(reservation._id);
    setStatusForm({
      status: reservation.status,
      notes: reservation.adminNotes || ''
    });
    setFormErrors({});
    setStatusDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStatusForm({
      ...statusForm,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!statusForm.status) {
      errors.status = 'حالة الحجز مطلوبة';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStatusSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await axiosInstance.patch(`/reservations/${selectedReservationId}/status`, statusForm);
      
      setReservations(reservations.map(reservation => 
        reservation._id === selectedReservationId ? { ...reservation, ...response.data } : reservation
      ));
      
      setStatusDialogOpen(false);
      
      Swal.fire({
        title: 'تم التحديث',
        text: 'تم تحديث حالة الحجز بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً'
      });
    } catch (err) {
      console.error('Error updating reservation status:', err);
      
      Swal.fire({
        title: 'خطأ',
        text: err.response?.data?.message || 'حدث خطأ أثناء تحديث حالة الحجز',
        icon: 'error',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const statusMap = {
      'pending': { label: 'قيد الانتظار', color: 'warning' },
      'confirmed': { label: 'مؤكد', color: 'success' },
      'cancelled': { label: 'ملغي', color: 'error' },
      'completed': { label: 'مكتمل', color: 'info' }
    };
    
    const statusInfo = statusMap[status] || { label: status, color: 'default' };
    
    return (
      <Chip 
        label={statusInfo.label} 
        color={statusInfo.color} 
        size="small" 
      />
    );
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: arDZ });
    } catch (e) {
      return dateString;
    }
  };

  const columns = [
    { field: 'chaletName',       headerName: 'اسم الشاليه',     width: 200 },
    { field: 'userName',         headerName: 'المستخدم',         width: 180 },
  
    {
      field: 'checkInFormatted',
      headerName: 'تاريخ الوصول',
      width: 130,
    },
    {
      field: 'checkOutFormatted',
      headerName: 'تاريخ المغادرة',
      width: 130,
    },
  
    { field: 'days',             headerName: 'عدد الأيام',      width: 110 },
    {
      field: 'totalPrice',
      headerName: 'المبلغ الإجمالي',
      width: 140
    },
  
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
  
  
  







  

  if (loading && reservations.length === 0) {
    return <Loader />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          إدارة الحجوزات
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ height: 600, width: '100%' }}>
  <DataGrid
    rows={reservations}
    columns={columns}
    getRowId={row => row._id}
    pageSize={10}
    rowsPerPageOptions={[10, 25, 50]}
    disableSelectionOnClick
    loading={loading}
    sx={{
      '& .MuiDataGrid-columnHeaders': { backgroundColor: 'primary.main', color: 'black' },
      '& .MuiDataGrid-cell':          { color: 'black' },
      '& .MuiDataGrid-footerContainer': { color: 'black' },
    }}
  />
</Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>
            هل أنت متأكد من رغبتك في حذف هذا الحجز؟
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
      
      {/* View Reservation Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          تفاصيل الحجز
        </DialogTitle>
        <DialogContent>
          {selectedReservation && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>معلومات الحجز</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">رمز الحجز</TableCell>
                        <TableCell>{selectedReservation.reservationCode}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">الحالة</TableCell>
                        <TableCell>{getStatusChip(selectedReservation.status)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">تاريخ الوصول</TableCell>
                        <TableCell>{formatDate(selectedReservation.checkIn)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">تاريخ المغادرة</TableCell>
                        <TableCell>{formatDate(selectedReservation.checkOut)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">عدد الليالي</TableCell>
                        <TableCell>{selectedReservation.days}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">عدد الضيوف</TableCell>
                        <TableCell>{selectedReservation.guestsCount}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">المبلغ الإجمالي</TableCell>
                        <TableCell>{selectedReservation.totalPrice} جنية</TableCell>
                      </TableRow>
                      {selectedReservation.couponCode && (
                        <TableRow>
                          <TableCell component="th" scope="row">كود الخصم</TableCell>
                          <TableCell>{selectedReservation.couponCode}</TableCell>
                        </TableRow>
                      )}
                      {selectedReservation.discountAmount > 0 && (
                        <TableRow>
                          <TableCell component="th" scope="row">قيمة الخصم</TableCell>
                          <TableCell>{selectedReservation.discountAmount} جنية</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell component="th" scope="row">تاريخ الحجز</TableCell>
                        <TableCell>{formatDate(selectedReservation.createdAt)}</TableCell>
                      </TableRow>
                      {selectedReservation.adminNotes && (
                        <TableRow>
                          <TableCell component="th" scope="row">ملاحظات الإدارة</TableCell>
                          <TableCell>{selectedReservation.adminNotes}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>معلومات الشاليه</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">اسم الشاليه</TableCell>
                        <TableCell>{selectedReservation.chalet?.name || 'غير متاح'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">المدينة</TableCell>
                        <TableCell>{selectedReservation.chalet?.city?.name || 'غير متاح'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">القرية</TableCell>
                        <TableCell>{selectedReservation.chalet?.village?.name || 'غير متاح'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">النوع</TableCell>
                        <TableCell>{selectedReservation.chalet?.type === 'villa' ? 'فيلا' : 'شاليه'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">السعر لليلة</TableCell>
                        <TableCell>{selectedReservation.chalet?.price || 0} جنية</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>معلومات المستخدم</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">الاسم</TableCell>
                        <TableCell>{`${selectedReservation.user?.name || selectedReservation.guestName} `}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">البريد الإلكتروني</TableCell>
                        <TableCell>{selectedReservation.user?.email || selectedReservation.guestEmail}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">رقم الهاتف</TableCell>
                        <TableCell>{selectedReservation.user?.phone || selectedReservation.guestPhone}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              {selectedReservation.specialRequests && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>طلبات خاصة</Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography>{selectedReservation.specialRequests}</Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)} color="primary">
            إغلاق
          </Button>
          <Button 
            onClick={() => {
              setViewDialogOpen(false);
              handleEditStatusClick(selectedReservation);
            }} 
            color="primary" 
            variant="contained"
          >
            تعديل الحالة
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          تعديل حالة الحجز
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.status}>
                <InputLabel id="status-select-label">حالة الحجز</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  name="status"
                  value={statusForm.status}
                  label="حالة الحجز"
                  onChange={handleInputChange}
                >
                  <MenuItem value="pending">قيد الانتظار</MenuItem>
                  <MenuItem value="confirmed">مؤكد</MenuItem>
                  <MenuItem value="cancelled">ملغي</MenuItem>
                  <MenuItem value="completed">مكتمل</MenuItem>
                </Select>
                {formErrors.status && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {formErrors.status}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="ملاحظات الإدارة"
                value={statusForm.notes}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)} color="inherit">
            إلغاء
          </Button>
          <Button 
            onClick={handleStatusSubmit} 
            color="primary" 
            variant="contained"
            disabled={loading}
          >
            حفظ التغييرات
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminReservations;