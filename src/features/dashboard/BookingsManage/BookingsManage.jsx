import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Grid,
  Card,
  CardContent,
  Divider, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Tab, 
  Tabs, 
  TextField,
  Alert, } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { arDZ } from 'date-fns/locale';
import Loader from '../../../shared/components/Loader';
import { useApiContext } from '../../../shared/context/api.context';


const BookingsManage = () => {
  const { axiosInstance, isLoading, setIsLoading } = useApiContext();
  const [bookings, setBookings] = useState([]);
  const [formattedBookings, setFormattedBookings] = useState([]);
  const [error, setError] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [statusReason, setStatusReason] = useState('');
  const [statusErrors, setStatusErrors] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  // Format data for DataGrid
  useEffect(() => {
    if (bookings.length > 0) {
      const formatted = bookings.map(booking => {
        return {
          ...booking,
          id: booking._id,
          chaletName: booking.chalet?.name || '-',
          customerName: getGuestName(booking),
          customerEmail: getGuestEmail(booking),
          customerPhone: getGuestPhone(booking),
          checkInDate: format(new Date(booking.checkIn), 'dd/MM/yyyy', { locale: arDZ }),
          checkOutDate: format(new Date(booking.checkOut), 'dd/MM/yyyy', { locale: arDZ }),
          displayPrice: `${getTotalPrice(booking)} جنية`,
          statusDisplay: getStatusLabel(booking.status)
        };
      });
      setFormattedBookings(formatted);
    }
  }, [bookings]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const url = `/booking`;

      const response = await axiosInstance.get(url, {
        headers: { token: localStorage.getItem('token') }
      });

      setBookings(response.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('فشل في جلب بيانات الحجوزات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClick = (booking) => {
    // Find original booking with all data
    const originalBooking = bookings.find(b => b._id === booking._id || b._id === booking._id);
    setSelectedBooking(originalBooking || booking);
    setViewDialogOpen(true);
  };

  const handleStatusUpdateClick = (booking, newStatus) => {
    // Find original booking with all data
    const originalBooking = bookings.find(b => b._id === booking._id || b._id === booking._id);
    setSelectedBooking({ ...(originalBooking || booking), newStatus });
    setStatusReason('');
    setStatusErrors({});
    setStatusDialogOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };


  const validateStatusUpdate = () => {
    const errors = {};
    if (selectedBooking?.newStatus === 'cancelled' && !statusReason.trim()) {
      errors.reason = 'يرجى إدخال سبب الرفض';
    }
    setStatusErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStatusUpdateConfirm = async () => {
    if (!validateStatusUpdate()) return;

    setIsLoading(true);
    try {
      // choose endpoint by newStatus
      const { _id, newStatus } = selectedBooking;
      const endpoint = newStatus === 'cancelled'
        ? `/reservation/reject/${_id}`
        : `/reservation/approve/${_id}`;

      // if you need to send a reason only on reject:
      const payload = newStatus === 'cancelled'
        ? { reason: statusReason }
        : {};

      await axiosInstance.post(endpoint, payload, {
        headers: { token: localStorage.getItem('token') }
      });

      // refresh list
      await fetchBookings();

      Swal.fire({
        title: 'تم التحديث',
        text: `تم ${newStatus === 'cancelled' ? 'رفض' : 'قبول'} الحجز بنجاح`,
        icon: 'success',
        confirmButtonText: 'حسناً'
      });
    } catch (err) {
      if (err.response?.data?.message == "Chalet is already reserved for these dates") {
        Swal.fire({
          title: 'خطأ',
          text: 'هذا الشاليه محجوز في تلك الايام ',
          icon: 'error',
          confirmButtonText: 'حسناً'
        });
      } else {
        Swal.fire({
          title: 'خطأ',
          text: err.response?.data?.message || 'حدث خطأ أثناء تحديث حالة الحجز',
          icon: 'error',
          confirmButtonText: 'حسناً'
        });
      }
    } finally {
      setStatusDialogOpen(false);
      setSelectedBooking(null);
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'confirmed': return 'مؤكد';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status || '-';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGuestName = (booking = {}) => {
    if (booking.user?.name) return booking.user.name;
    if (booking.guestName) return booking.guestName;
    return '-';
  };

  const getGuestEmail = (booking = {}) => {
    if (booking.user?.email) return booking.user.email;
    if (booking.guestEmail) return booking.guestEmail;
    return '-';
  };

  const getGuestPhone = (booking = {}) => {
    if (booking.user?.phone) return booking.user.phone;
    if (booking.guestPhone) return booking.guestPhone;
    return '-';
  };

  const getTotalPrice = (booking = {}) => {
    if (booking.priceAfterDiscount != null) return booking.priceAfterDiscount;
    if (booking.totalPrice != null) return booking.totalPrice;
    return 0;
  };

  const columns = [
    { field: 'chaletName', headerName: 'الشاليه', width: 200 },
    { field: 'customerName', headerName: 'العميل', width: 180 },
    { field: 'customerEmail', headerName: 'البريد الإلكتروني', width: 200 },
    { field: 'checkInDate', headerName: 'تاريخ الوصول', width: 140 },
    { field: 'checkOutDate', headerName: 'تاريخ المغادرة', width: 140 },
    {
      field: 'createdAt',
      headerName: 'تاريخ الطلب',
      width: 140,
      valueFormatter: (value) => new Date(value).toDateString()
    },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 220,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Box>
            <IconButton
              color="primary"
              onClick={() => handleViewClick(row)}
              aria-label="عرض"
            >
              <VisibilityIcon />
            </IconButton>

            {row.status !== 'confirmed' && row.status !== 'completed' && row.status !== 'cancelled' && (
              <>
                <IconButton
                  color="success"
                  onClick={() => handleStatusUpdateClick(row, 'confirmed')}
                  aria-label="تأكيد"
                >
                  <CheckCircleIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleStatusUpdateClick(row, 'cancelled')}
                  aria-label="إلغاء"
                >
                  <CancelIcon />
                </IconButton>
              </>
            )}

            {row.status === 'confirmed' && (
              <>
                <IconButton
                  color="success"
                  onClick={() => handleStatusUpdateClick(row, 'completed')}
                  aria-label="إكمال"
                >
                  <CheckCircleIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleStatusUpdateClick(row, 'cancelled')}
                  aria-label="إلغاء"
                >
                  <CancelIcon />
                </IconButton>
              </>
            )}
          </Box>
        );
      },
    },
  ];

  if (isLoading && bookings.length === 0) {
    return <Loader />;
  }

  const handleClearAll = async () => {
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: 'هل أنت متأكد من حذف جميع السجلات؟ لا يمكن التراجع عن هذا الإجراء.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف!',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete('/booking/clear', {
          headers: {
            token: localStorage.getItem("token")
          },
        });

        Swal.fire('تم الحذف!', 'success');
        await fetchBookings();

      } catch (error) {
        Swal.fire('خطأ', error.message, 'error');
      }
    }
  };



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
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={handleClearAll}
        sx={{ borderRadius: 2, px: 3, py: 1.5, boxShadow: 3 }}
      >
        حذف الكل
      </Button>
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={formattedBookings}
          columns={columns}
          getRowId={(row) => row._id || row._id}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          loading={isLoading}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'primary.main',
              color: 'black',
            },
            '& .MuiDataGrid-cell': {
              color: 'black',
            },
            '& .MuiDataGrid-footerContainer': {
              color: 'black',
            },
          }}
        />
      </Paper>

      {/* View Booking Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          تفاصيل الحجز #{selectedBooking?._id}
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <>
              <Box sx={{ mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="booking details tabs">
                  <Tab label="تفاصيل الحجز" />
                  <Tab label="تفاصيل العميل" />
                  <Tab label="تفاصيل الشاليه" />
                </Tabs>
              </Box>

              {/* Booking Details Tab */}
              {tabValue === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          معلومات الحجز
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              رقم الحجز:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              {selectedBooking._id}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              تاريخ الوصول:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              {formatDate(selectedBooking.checkIn)}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              تاريخ المغادرة:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              {formatDate(selectedBooking.checkOut)}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              عدد الأيام:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              {selectedBooking.days || '-'}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              عدد الضيوف:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              {selectedBooking.guests || '-'}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              كود الحجز:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              {selectedBooking.code || '-'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          تفاصيل المدفوعات
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              سعر الشاليه:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              {selectedBooking.chalet?.price || '-'} جنية / ليلة
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              المبلغ الإجمالي:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              {selectedBooking.totalPrice || '-'} جنية
                            </Typography>
                          </Grid>

                          {selectedBooking.discountAmount && (
                            <>
                              <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                  مبلغ الخصم:
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  {selectedBooking.discountAmount} جنية
                                </Typography>
                              </Grid>

                              <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                  السعر بعد الخصم:
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  {selectedBooking.priceAfterDiscount} جنية
                                </Typography>
                              </Grid>
                            </>
                          )}

                          {selectedBooking.coupon && (
                            <>
                              <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                  كوبون الخصم:
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  {selectedBooking.coupon}
                                </Typography>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {selectedBooking.notes && (
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">
                            ملاحظات الحجز
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body2">
                            {selectedBooking.notes}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* Customer Details Tab */}
              {tabValue === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          معلومات العميل
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              الاسم:
                            </Typography>
                            <Typography variant="body1">
                              {getGuestName(selectedBooking)}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              البريد الإلكتروني:
                            </Typography>
                            <Typography variant="body1">
                              {getGuestEmail(selectedBooking)}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              رقم الهاتف:
                            </Typography>
                            <Typography variant="body1">
                              {getGuestPhone(selectedBooking)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {/* Chalet Details Tab */}
              {tabValue === 2 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          معلومات الشاليه
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              اسم الشاليه:
                            </Typography>
                            <Typography variant="body1">
                              {selectedBooking.chalet?.name || '-'}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              المدينة / القرية:
                            </Typography>
                            <Typography variant="body1">
                              {selectedBooking.chalet?.city?.name || '-'} / {selectedBooking.chalet?.village?.name || '-'}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              النوع:
                            </Typography>
                            <Typography variant="body1">
                              {selectedBooking.chalet?.type || '-'}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              عدد الغرف:
                            </Typography>
                            <Typography variant="body1">
                              {selectedBooking.chalet?.bedrooms || '-'}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              عدد الحمامات:
                            </Typography>
                            <Typography variant="body1">
                              {selectedBooking.chalet?.bathrooms || '-'}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              السعر الأساسي:
                            </Typography>
                            <Typography variant="body1">
                              {selectedBooking.chalet?.price || '-'} جنية / ليلة
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              الموقع:
                            </Typography>
                            <Typography variant="body1">
                              {selectedBooking.chalet?.location || '-'}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              كود الشاليه:
                            </Typography>
                            <Typography variant="body1">
                              {selectedBooking.chalet?.code || '-'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {selectedBooking.chalet?.features && selectedBooking.chalet.features.length > 0 && (
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">
                            المميزات
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Grid container spacing={1}>
                            {selectedBooking.chalet.features.map((feature, index) => (
                              <Grid item xs={12} sm={6} key={index}>
                                <Typography variant="body2" fontWeight="bold">
                                  {feature.name}:
                                </Typography>
                                <Typography variant="body2">
                                  {feature.description}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)} color="primary">
            إغلاق
          </Button>
          {selectedBooking && selectedBooking.status === 'pending' && (
            <>
              <Button
                onClick={() => {
                  setViewDialogOpen(false);
                  handleStatusUpdateClick(selectedBooking, 'confirmed');
                }}
                color="success"
                variant="contained"
              >
                قبول الحجز
              </Button>
              <Button
                onClick={() => {
                  setViewDialogOpen(false);
                  handleStatusUpdateClick(selectedBooking, 'cancelled');
                }}
                color="error"
                variant="contained"
              >
                رفض الحجز
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
      >
        <DialogTitle>
          {selectedBooking?.newStatus === 'confirmed' && 'تأكيد قبول الحجز'}
          {selectedBooking?.newStatus === 'completed' && 'تأكيد إكمال الحجز'}
          {selectedBooking?.newStatus === 'cancelled' && 'تأكيد رفض الحجز'}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            {selectedBooking?.newStatus === 'confirmed' && 'هل أنت متأكد من رغبتك في قبول هذا الحجز؟'}
            {selectedBooking?.newStatus === 'completed' && 'هل أنت متأكد من رغبتك في تحديد هذا الحجز كمكتمل؟'}
            {selectedBooking?.newStatus === 'cancelled' && 'هل أنت متأكد من رغبتك في رفض هذا الحجز؟'}
          </Typography>

          {selectedBooking?.newStatus === 'cancelled' && (
            <TextField
              label="سبب الرفض"
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              fullWidth
              multiline
              rows={3}
              error={!!statusErrors.reason}
              helperText={statusErrors.reason}
              margin="normal"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)} color="inherit">
            إلغاء العملية
          </Button>
          <Button
            onClick={handleStatusUpdateConfirm}
            color={selectedBooking?.newStatus === 'cancelled' ? 'error' : 'success'}
            variant="contained"
            disabled={isLoading}
          >
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BookingsManage;
