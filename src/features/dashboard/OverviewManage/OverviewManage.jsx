import React, { useState, useEffect, useContext } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CabinIcon from '@mui/icons-material/Cabin';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useApiContext } from '../../../shared/context/api.context';

const OverviewManage = () => {
  const { axiosInstance } = useApiContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/admin/stats');
        setStats(response.data);
      } catch (err) {
        setError('فشل في جلب الإحصائيات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [axiosInstance]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  // Stats cards data
  const cardsData = [
    { 
      title: 'المستخدمين', 
      value: stats?.usersCount || 0, 
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} /> 
    },
    { 
      title: 'الشاليهات', 
      value: stats?.chaletsCount || 0, 
      icon: <CabinIcon sx={{ fontSize: 40, color: 'primary.main' }} /> 
    },
    { 
      title: 'المدن', 
      value: stats?.citiesCount || 0, 
      icon: <LocationCityIcon sx={{ fontSize: 40, color: 'primary.main' }} /> 
    },
    { 
      title: 'القرى', 
      value: stats?.villagesCount || 0, 
      icon: <HolidayVillageIcon sx={{ fontSize: 40, color: 'primary.main' }} /> 
    },
    { 
      title: 'الكوبونات النشطة', 
      value: stats?.activeCouponsCount || 0, 
      icon: <ConfirmationNumberIcon sx={{ fontSize: 40, color: 'primary.main' }} /> 
    },
    { 
      title: 'الحجوزات الحالية', 
      value: stats?.activeReservationsCount || 0, 
      icon: <BookOnlineIcon sx={{ fontSize: 40, color: 'primary.main' }} /> 
    },
  ];

  // Function to handle booking status color
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
        sx={{ minWidth: '80px' }}
      />
    );
  };

  const handleViewBooking = (bookingId) => {
    navigate(`/admin/bookings/${bookingId}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        نظرة عامة على النظام
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        {cardsData.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 2,
              boxShadow: 3,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box mb={2}>
                  {card.icon}
                </Box>
                <Typography variant="h5" component="div">
                  {card.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {stats?.recentBookings && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            آخر طلبات الحجز
          </Typography>
          <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="آخر طلبات الحجز">
                <TableHead>
                  <TableRow>
                    <TableCell>رقم الحجز</TableCell>
                    <TableCell>اسم العميل</TableCell>
                    <TableCell>اسم الشاليه</TableCell>
                    <TableCell>تاريخ الوصول</TableCell>
                    <TableCell>تاريخ المغادرة</TableCell>
                    <TableCell>المبلغ الإجمالي</TableCell>
                    <TableCell>الحالة</TableCell>
                    <TableCell>الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentBookings.map((booking) => (
                    <TableRow key={booking.id} hover>
                      <TableCell>{booking.bookingNumber}</TableCell>
                      <TableCell>{booking.customer.name}</TableCell>
                      <TableCell>{booking.chalet.name}</TableCell>
                      <TableCell>
                        {format(new Date(booking.checkInDate), 'dd MMM yyyy', { locale: ar })}
                      </TableCell>
                      <TableCell>
                        {format(new Date(booking.checkOutDate), 'dd MMM yyyy', { locale: ar })}
                      </TableCell>
                      <TableCell>{booking.totalAmount} جنية</TableCell>
                      <TableCell>{getStatusChip(booking.status)}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewBooking(booking.id)}
                        >
                          عرض
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}

      {/* Revenue Summary */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ملخص الإيرادات
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    إيرادات اليوم
                  </Typography>
                  <Typography variant="h6">
                    {stats?.revenue?.today || 0} جنية
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    إيرادات الأسبوع
                  </Typography>
                  <Typography variant="h6">
                    {stats?.revenue?.week || 0} جنية
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    إيرادات الشهر
                  </Typography>
                  <Typography variant="h6">
                    {stats?.revenue?.month || 0} جنية
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    إيرادات السنة
                  </Typography>
                  <Typography variant="h6">
                    {stats?.revenue?.year || 0} جنية
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                آخر النشاطات
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {stats?.recentActivities?.length > 0 ? (
                <Box sx={{ maxHeight: 250, overflow: 'auto' }}>
                  {stats.recentActivities.map((activity, index) => (
                    <Box key={index} sx={{ mb: 2, pb: 1, borderBottom: index !== stats.recentActivities.length - 1 ? '1px solid #eee' : 'none' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {activity.user}
                      </Typography>
                      <Typography variant="body2">
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(activity.timestamp), 'dd MMM yyyy HH:mm', { locale: ar })}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  لا توجد نشاطات حديثة
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Popular Chalets */}
      {stats?.popularChalets && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            الشاليهات الأكثر حجزاً
          </Typography>
          <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader aria-label="الشاليهات الأكثر حجزاً">
                <TableHead>
                  <TableRow>
                    <TableCell>اسم الشاليه</TableCell>
                    <TableCell>الموقع</TableCell>
                    <TableCell>عدد الحجوزات</TableCell>
                    <TableCell>معدل التقييم</TableCell>
                    <TableCell>السعر اليومي</TableCell>
                    <TableCell>الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.popularChalets.map((chalet) => (
                    <TableRow key={chalet.id} hover>
                      <TableCell>{chalet.name}</TableCell>
                      <TableCell>{chalet.location}</TableCell>
                      <TableCell>{chalet.bookingsCount}</TableCell>
                      <TableCell>{chalet.rating} / 5</TableCell>
                      <TableCell>{chalet.dailyPrice} جنية</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/admin/chalets/${chalet.id}`)}
                        >
                          عرض
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default OverviewManage;