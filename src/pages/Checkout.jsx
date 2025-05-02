import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import PrintIcon from '@mui/icons-material/Print';
import HomeIcon from '@mui/icons-material/Home';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PeopleIcon from '@mui/icons-material/People';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { MyContext } from '../context/MyContext';
import Loader from '../components/Loader';
import Swal from 'sweetalert2';

const Checkout = () => {
  const { axiosInstance, isLogin, userData } = useContext(MyContext);
  const printRef = useRef();

  const [bookingDetails, setBookingDetails] = useState(null);
  const [chalet, setChalet] = useState(null);
  const [guestInfo, setGuestInfo] = useState({ fullName: '', email: '', phone: '' });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [termsChecked, setTermsChecked] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);

  // load bookingDetails
  useEffect(() => {
    const stored = sessionStorage.getItem('bookingDetails');
    if (!stored) return window.location.href = '/';
    const parsedDetails = JSON.parse(stored);
    setBookingDetails(parsedDetails);
    setFinalPrice(parsedDetails.totalPrice);
  }, []);

  // fetch chalet
  useEffect(() => {
    if (!bookingDetails) return;
    axiosInstance.get(`/chalet/${bookingDetails.chaletId}`)
      .then(res => setChalet(res.data.data))
      .catch(() => setError('فشل في جلب بيانات الشاليه'))
      .finally(() => setLoading(false));
  }, [bookingDetails]);

  // auto-fill guest
  useEffect(() => {
    if (isLogin && userData) {
      setGuestInfo({
        fullName: userData.name,
        email: userData.email,
        phone: userData.phone
      });
    }
  }, [isLogin, userData]);

  // restore coupon from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('appliedCoupon');
    if (stored && bookingDetails) {
      const c = JSON.parse(stored);
      setAppliedCoupon(c);
      const amt = c.discountType === 'percentage'
        ? Math.round(bookingDetails.totalPrice * c.discountValue / 100)
        : c.discountValue;
      setDiscountAmount(amt);
      setFinalPrice(bookingDetails.totalPrice - amt);
    }
  }, [bookingDetails]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await axiosInstance.post('/coupon/apply', { code: couponCode });
      const c = res.data.data;
      sessionStorage.setItem('appliedCoupon', JSON.stringify(c));
      setAppliedCoupon(c);
      const amt = c.discountType === 'percentage'
        ? Math.round(bookingDetails.totalPrice * c.discountValue / 100)
        : c.discountValue;
      setDiscountAmount(amt);
      setFinalPrice(bookingDetails.totalPrice - amt);
      Swal.fire('تم تطبيق الكوبون!', '', 'success');
    } catch {
      Swal.fire('رمز غير صحيح أو منتهي!', '', 'error');
    }
  };

  const handleSubmit = async () => {
    if (!termsChecked) return setError('يجب الموافقة على الشروط والأحكام');
    setError(''); setLoading(true);

    const payload = {
      chaletId: bookingDetails.chaletId,
      checkIn: bookingDetails.startDate.split('T')[0],
      checkOut: bookingDetails.endDate.split('T')[0],
      couponCode: appliedCoupon?.code || '',
      guests: bookingDetails.guests || 1 // إضافة عدد الزوار
    };
    if (!isLogin) Object.assign(payload, {
      name: guestInfo.fullName,
      email: guestInfo.email,
      phone: guestInfo.phone
    });

    try {
      const headers = isLogin
        ? { headers: { token: localStorage.getItem('token') } }
        : {};
      const res = await axiosInstance.post('/booking', payload, headers);
      setReceipt(res.data.data);
      sessionStorage.clear();
      Swal.fire('تم الطلب بنجاح', 'سنتواصل معك لارسال النقود على الرقم المسجل.', 'success');
    } catch (e) {
      setError(e.response?.data?.message || 'خطأ في تأكيد الحجز');
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = () => window.print();
  const goToHome = () => window.location.href = '/';

  if (loading) return <Loader />;

  // only-print CSS
  const printStyles = `
    @media print {
      body * { visibility: hidden; }
      #receipt, #receipt * { visibility: visible; }
      #receipt { position: absolute; top:0; left:0; width:100%; }
      .no-print { display: none !important; }
    }
  `;

  // RECEIPT VIEW
  if (receipt) {
    return (
      <>
        <style>{printStyles}</style>
        <Container id="receipt" ref={printRef} maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
          <Card sx={{ p: 2, position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                إيصال الحجز
              </Typography>
              <Box>
                <IconButton
                  className="no-print"
                  sx={{ mx: 1 }}
                  onClick={printReceipt}
                  color="primary"
                >
                  <PrintIcon />
                </IconButton>
                <IconButton
                  className="no-print"
                  sx={{ mx: 1 }}
                  onClick={goToHome}
                  color="secondary"
                >
                  <HomeIcon />
                </IconButton>
              </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Chip
                  icon={<LocalOfferIcon />}
                  label={`رقم الطلب: ${receipt._id}`}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: 'bold' }}>الشاليه:</Typography>
                <Typography>{chalet.name}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: 'bold' }}>عدد الضيوف:</Typography>
                <Typography>{bookingDetails.guests || 1} ضيف</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 'bold' }}>المدة:</Typography>
                <Typography>
                  {format(new Date(bookingDetails.startDate),'dd/MM/yyyy',{locale:ar})}
                  {' '}–{' '}
                  {format(new Date(bookingDetails.endDate),'dd/MM/yyyy',{locale:ar})}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: 'bold' }}>عدد الليالي:</Typography>
                <Typography>{bookingDetails.totalNights}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: 'bold' }}>السعر الأساسي:</Typography>
                <Typography>{bookingDetails.totalPrice} جنية</Typography>
              </Grid>
              
              {appliedCoupon && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontWeight: 'bold', color: 'green' }}>الخصم:</Typography>
                    <Typography color="green">{discountAmount} جنية</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>السعر النهائي:</Typography>
                    <Typography color="primary.main" sx={{ fontWeight: 'bold' }}>
                      {bookingDetails.totalPrice - discountAmount} جنية
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography sx={{ fontWeight: 'bold' }}>كود الكوبون:</Typography>
                    <Typography>{appliedCoupon.code}</Typography>
                  </Grid>
                </>
              )}
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 'bold' }}>كود الطلب:</Typography>
                <Typography sx={{ fontSize: '1.2rem', color: 'primary.main' }}>{receipt.code}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 'bold' }}>اسم الضيف:</Typography>
                <Typography>{receipt.user?.name || receipt.guestName}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: 'bold' }}>البريد:</Typography>
                <Typography>{receipt.user?.email || receipt.guestEmail}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontWeight: 'bold' }}>الهاتف:</Typography>
                <Typography>{receipt.user?.phone || receipt.guestPhone}</Typography>
              </Grid>
            </Grid>
            
            <Alert severity="success" sx={{ mt: 3 }}>
              تم إرسال بيانات الطلب على بريدك الإلكتروني.
            </Alert>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                className="no-print"
                startIcon={<HomeIcon />}
                onClick={goToHome}
              >
                العودة للصفحة الرئيسية
              </Button>
            </Box>
          </Card>
        </Container>
      </>
    );
  }

  // MAIN FORM
  return (
    <>
      <style>{printStyles}</style>
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}
        <Card sx={{ overflow: 'visible', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p:3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
              تأكيد الحجز
            </Typography>
            <Divider sx={{ mb:3 }} />

            {/* Chalet & dates */}
            <Card variant="outlined" sx={{ mb:3, p:2, bgcolor: '#f5f9ff' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {chalet.name}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>
                      {chalet.city.name} - {chalet.village.name}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>
                      عدد الضيوف: {bookingDetails.guestCount || 1}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <NightsStayIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>
                      {format(new Date(bookingDetails.startDate),'dd/MM/yyyy',{locale:ar})}
                      {' '}–{' '}
                      {format(new Date(bookingDetails.endDate),'dd/MM/yyyy',{locale:ar})}
                      {' • '}
                      {bookingDetails.totalNights} ليالي
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>السعر الأساسي:</Typography>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {bookingDetails.totalPrice} جنية
                    </Typography>
                  </Box>
                  
                  {appliedCoupon && (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography color="green">الخصم:</Typography>
                        <Typography color="green">
                          {discountAmount} جنية
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography color="primary">السعر النهائي:</Typography>
                        <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                          {finalPrice} جنية
                        </Typography>
                      </Box>
                    </>
                  )}
                </Grid>
              </Grid>
            </Card>

            {/* Transfer instructions */}
            <Alert severity="info" sx={{ mb:3 }}>
              <Typography variant="subtitle2">لتحويل الأموال:</Typography>
              <Typography>رقم الحساب: <b>0123456789</b></Typography>
              <Typography>ثم أرسل لنا صورة التحويل على الواتس.</Typography>
            </Alert>

            {/* Coupon (full-width stacking) */}
            <Box sx={{ mb:3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                كود الخصم
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={8} sm={9}>
                  <TextField
                    placeholder="أدخل كود الخصم هنا"
                    fullWidth
                    size="small"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    InputProps={{
                      startAdornment: <LocalOfferIcon color="action" sx={{ mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={4} sm={3}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ height: '100%' }}
                    onClick={applyCoupon}
                  >
                    تطبيق
                  </Button>
                </Grid>
              </Grid>
              
              {appliedCoupon && (
                <Alert severity="success" sx={{ mt:2 }}>
                  كوبون مفعل: <b>{appliedCoupon.code}</b> — خصم {appliedCoupon.discountValue}
                  {appliedCoupon.discountType==='percentage'? '%' : ' جنية'}
                </Alert>
              )}
            </Box>

            {/* Guest Info (stacked) */}
            {!isLogin && (
              <Box sx={{ mb:3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  معلومات الضيف
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="الاسم الكامل"
                      fullWidth
                      value={guestInfo.fullName}
                      onChange={e => setGuestInfo({...guestInfo, fullName:e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="البريد الإلكتروني"
                      fullWidth
                      value={guestInfo.email}
                      onChange={e => setGuestInfo({...guestInfo, email:e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="رقم الهاتف"
                      fullWidth
                      value={guestInfo.phone}
                      onChange={e => setGuestInfo({...guestInfo, phone:e.target.value})}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Terms & Conditions */}
            <Box sx={{ mb:3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsChecked}
                    onChange={e => setTermsChecked(e.target.checked)}
                  />
                }
                label={
                  <>
                    أوافق على{' '}
                    <Button 
                      size="small" 
                      color="primary"
                      sx={{ textDecoration: 'underline' }}
                      onClick={() => setTermsOpen(true)}
                    >
                      الشروط والأحكام
                    </Button>
                  </>
                }
              />
            </Box>

            {/* Submit */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ py: 1.5, fontSize: '1.1rem' }}
              disabled={
                (!isLogin && (!guestInfo.fullName||!guestInfo.email||!guestInfo.phone))
                || !termsChecked
              }
              onClick={handleSubmit}
            >
              تأكيد الحجز
            </Button>
          </CardContent>
        </Card>
      </Container>

      {/* Terms Modal */}
      <Modal
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 300 }}
      >
        <Fade in={termsOpen}>
          <Paper sx={{
            position:'absolute', top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
            p:4, width: { xs: '90%', sm: 400 }, maxHeight: '80vh', overflow:'auto',
            borderRadius: 2,
            boxShadow: 24
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              الشروط والأحكام
            </Typography>
            <Divider sx={{ mb:2 }}/>
            <Box sx={{ mb: 2 }}>
              {chalet.terms.map(t => (
                <Card key={t._id} sx={{ mb:1, p: 1, bgcolor: t.allowed ? '#f0f7ff' : '#fff0f0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2">{t.term}</Typography>
                    <Chip 
                      size="small"
                      label={t.allowed ? 'مسموح' : 'غير مسموح'}
                      color={t.allowed ? 'success' : 'error'}
                    />
                  </Box>
                </Card>
              ))}
            </Box>
            <Box sx={{ textAlign:'center', mt:2 }}>
              <Button 
                variant="contained"
                onClick={() => setTermsOpen(false)}
              >
                إغلاق
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
};

export default Checkout;