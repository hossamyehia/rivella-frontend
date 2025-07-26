import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Container,
  Box,
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
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import logo from "../../../components/logo.png";
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import PrintIcon from '@mui/icons-material/Print';
import HomeIcon from '@mui/icons-material/Home';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PeopleIcon from '@mui/icons-material/People';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Loader from '../../../components/Loader';
import Swal from 'sweetalert2';
import { useApiContext } from '../../../context/ApiContext';
import { useUserContext } from '../../../context/UserContext';

const Checkout = () => {
  const { axiosInstance } = useApiContext();
  const { isLogin, userData } = useUserContext();
  const printRef = useRef();

  const [bookingDetails, setBookingDetails] = useState(null);
  const [chalet, setChalet] = useState(null);
  const [guestInfo, setGuestInfo] = useState({ fullName: '', email: '', phone: '', additionalDetails: '' });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [termsChecked, setTermsChecked] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({ fullName: '', email: '', phone: '' });
  const [receipt, setReceipt] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [formIsValid, setFormIsValid] = useState(false);

  // load bookingDetails
  useEffect(() => {
    const stored = sessionStorage.getItem('bookingDetails');
    if (!stored) return window.location.href = '/';
    const parsedDetails = JSON.parse(stored);
    setBookingDetails(parsedDetails);
    setFinalPrice(parsedDetails.totalPrice);
    
    // حساب العربون كثُلث السعر الكامل مع تقريب للأعلى
    const depositAmount = Math.ceil(parsedDetails.totalPrice / 3);

    setDepositAmount(depositAmount);

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
        phone: userData.phone,
        additionalDetails: ''
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

  // Check form validity
  useEffect(() => {
    if (isLogin) {
      setFormIsValid(termsChecked);
    } else {
      const isValid = guestInfo.fullName.trim() !== '' && 
                     guestInfo.email.trim() !== '' && 
                     guestInfo.phone.trim() !== '' &&
                     termsChecked;
      setFormIsValid(isValid);
    }
  }, [guestInfo, termsChecked, isLogin]);

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
      
      // Recalculate deposit
      const newFinalPrice = bookingDetails.totalPrice - amt;
      const deposit = Math.ceil(newFinalPrice * 0.3);
      const oneNightPrice = newFinalPrice / bookingDetails.totalNights;
      setDepositAmount(Math.max(deposit, oneNightPrice));
      
      Swal.fire('تم تطبيق الكوبون!', '', 'success');
    } catch {
      Swal.fire('رمز غير صحيح أو منتهي!', '', 'error');
    }
  };

  const validateForm = () => {
    let valid = true;
    const errors = { fullName: '', email: '', phone: '' };
    
    // Validate fullName
    if (!guestInfo.fullName.trim()) {
      errors.fullName = 'الاسم مطلوب';
      valid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!guestInfo.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
      valid = false;
    } else if (!emailRegex.test(guestInfo.email)) {
      errors.email = 'البريد الإلكتروني غير صحيح';
      valid = false;
    }
    
    // Validate phone
    const phoneRegex = /^[0-9]{11}$/;
    if (!guestInfo.phone.trim()) {
      errors.phone = 'رقم الهاتف مطلوب';
      valid = false;
    } else if (!phoneRegex.test(guestInfo.phone)) {
      errors.phone = 'رقم الهاتف غير صحيح (11 رقم)';
      valid = false;
    }
    
    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!termsChecked) {
      setError('يجب الموافقة على الشروط والأحكام');
      return;
    }
    
    if (!isLogin && !validateForm()) {
      return;
    }
    
    setError(''); 
    setLoading(true);

    const payload = {
      chaletId: bookingDetails.chaletId,
      checkIn: bookingDetails.startDate.split('T')[0],
      checkOut: bookingDetails.endDate.split('T')[0],
      couponCode: appliedCoupon?.code || '',
      guests: bookingDetails.guestCount || 1,
      additionalDetails: guestInfo.additionalDetails || ''
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
      Swal.fire('تم إرسال الطلب بنجاح', 'برجاء دفع العربون لتأكيد الحجز', 'success');
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
                تفاصيل طلب الحجز
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
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                تم إرسال طلب الحجز إلى الشركة ولم يتم الموافقة عليه حتى الآن
              </Typography>
              <Typography>
                لتأكيد الحجز، يرجى دفع العربون بقيمة <strong>{depositAmount} جنية</strong> وإرسال صورة من التحويل إلى رقم الشركة
              </Typography>
              <Typography sx={{ mt: 1 }}>
                رقم الحساب: <strong>01025582302</strong>
              </Typography>
            </Alert>
            
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
                <Typography>{bookingDetails.guestCount || 1} ضيف</Typography>
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
              
              {guestInfo.additionalDetails && (
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 'bold' }}>تفاصيل إضافية:</Typography>
                  <Typography>{guestInfo.additionalDetails}</Typography>
                </Grid>
              )}
            </Grid>

            <Box
              sx={{
                textAlign: 'center',
                mt: 2,
                px: 2
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Rivella Explore"
                sx={{ height: 60, width: 'auto', mb: 1, mx: 'auto' }}
              />
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                Rivella Explore
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                <EmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                rivellaexplore1@gmail.com
              </Typography>
              <Typography variant="body2">
                <CallIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                01107973962
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 2 }} color="text.secondary">
                شكرًا لتعاملك مع شركة Rivella Explore
              </Typography>
            </Box>
            
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
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Card sx={{ overflow: 'visible', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
              تأكيد الحجز
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Guest Info (stacked) - Always shown first */}
            {!isLogin && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  معلومات الضيف
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="الاسم الكامل"
                      fullWidth
                      value={guestInfo.fullName}
                      onChange={e => setGuestInfo({...guestInfo, fullName: e.target.value})}
                      error={!!formErrors.fullName}
                      helperText={formErrors.fullName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="البريد الإلكتروني"
                      fullWidth
                      value={guestInfo.email}
                      onChange={e => setGuestInfo({...guestInfo, email: e.target.value})}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="رقم الهاتف"
                      fullWidth
                      value={guestInfo.phone}
                      onChange={e => setGuestInfo({...guestInfo, phone: e.target.value})}
                      error={!!formErrors.phone}
                      helperText={formErrors.phone}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="تفاصيل إضافية (اختيارية)"
                      multiline
                      rows={4}
                      fullWidth
                      placeholder="أي تفاصيل أو طلبات خاصة..."
                      value={guestInfo.additionalDetails}
                      onChange={e => setGuestInfo({...guestInfo, additionalDetails: e.target.value})}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {isLogin && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  تفاصيل إضافية
                </Typography>
                <TextField
                  label="تفاصيل إضافية (اختيارية)"
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="أي تفاصيل أو طلبات خاصة..."
                  value={guestInfo.additionalDetails}
                  onChange={e => setGuestInfo({...guestInfo, additionalDetails: e.target.value})}
                />
              </Box>
            )}

            {/* Chalet & dates */}
            <Card variant="outlined" sx={{ mb: 3, p: 2, bgcolor: '#f5f9ff' }}>
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

            {/* Coupon (full-width stacking) */}
            <Box sx={{ mb: 3 }}>
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
                <Alert severity="success" sx={{ mt: 2 }}>
                  كوبون مفعل: <b>{appliedCoupon.code}</b> — خصم {appliedCoupon.discountValue}
                  {appliedCoupon.discountType==='percentage'? '%' : ' جنية'}
                </Alert>
              )}
            </Box>

            {/* Terms & Conditions - Simplified with Modal */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={termsChecked}
                      onChange={(e) => setTermsChecked(e.target.checked)}
                    />
                  }
                  label="أوافق على الشروط والأحكام"
                />
                <Button 
                  color="primary"
                  onClick={() => setTermsOpen(true)}
                  sx={{ mr: 1, textDecoration: 'underline', fontWeight: 'normal' }}
                >
                  قراءة الشروط والأحكام
                </Button>
              </Box>
            </Box>

            {/* Confirm Button */}
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large"
                onClick={handleSubmit}
                disabled={!formIsValid}
                sx={{ py: 1.5 }}
              >
                تأكيد الحجز
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Terms and Conditions Modal */}
      <Modal
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={termsOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 600 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              الشروط والأحكام
            </Typography>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              ملاحظات خاصه بالحجوزات:
            </Typography>
            <ol style={{ paddingRight: '20px', marginTop: '5px' }}>
              <li>لا يتم تأكيد الحجز الا بدفع مقدم الحجز ، قيمه المقدم هي ثلث قيمه الحجز بحد ادني قيمه حجز ليله</li>
              <li>اسعار الوحدات تختلف باختلاف الفترات خصوصا في فترات الاعياد والمناسبات الخاصه</li>
              <li>بعد دفع المقدم يصلك من الموقع ايميل بتأكيد الحجز و ارسال كافه التفاصيل</li>
              <li>يتواصل مع حضرتك أحد مسؤولي التسليم خلال ٢٤ ساعه لتنسيق استلام الوحده</li>
            </ol>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              شروط و احكام الحجز:
            </Typography>
            <ol style={{ paddingRight: '20px', marginTop: '5px' }}>
              <li>يلتزم المستأجر بالعدد الاقصي للأفراد الموضح في كل وحده ولا يحق للمستأجر استضافه اي أفراد اضافيه غير العدد المتفق عند الحجز.</li>
              <li>يلتزم المستأجر بميعاد الاستلام و التسلم المتفق عليه قبل الوصول طبقا للائحة الإيجارية الخاصة بالقرية السياحية.</li>
              <li>لا يتم تأكيد الحجز قبل دفع مبلغ مقدم الحجز الموضح اعلاه </li>
              <li>يسدد المستأجر باقي القيمة الايجارية المستحقة كاملة عند استلام الوحدة من مسؤول الحجوزات.</li>
              <li>يلتزم المستأجر بالمحافظة على الوحدة و محتوياتها اثناء فترة استخدامها بحالة جيدة و نظيفة.</li>
              <li>يلتزم المستأجر بعدم الاساءة الى سمعة المكان او الشركة بأي وسيلة من وسائل التواصل الاجتماعي.</li>
              <li>يلتزم المستأجر بعدم احداث اي اتلاف بالوحدة او محتوياتها و اذا حدث يتحمل قيمتها.</li>
              <li>عند التأخر عن موعد تسليم الوحدة تحتسب غرامة تأخير.</li>
              <li>يلتزم المستأجر بعدم اصطحاب الحيوانات الاليفة او احضار بضائع غير قانونية او مخدرات او سلاح.</li>
              <li>تكون مسئولية الامن و الضيوف و المحافظة على الممتلكات الشخصية هي مسئولية المستأجر.</li>
            </ol>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              سياسة الإلغاء:
            </Typography>
            <ol style={{ paddingRight: '20px', marginTop: '5px' }}>
              <li>في حالة إلغاء الحجز قبل الموعد المحدد ب 10 أيام يسترد العميل كامل المبلغ المدفوع.</li>
              <li>في حالة إلغاء الحجز قبل الموعد المحدد ب 7 أيام يسترد العميل 75% من قيمة المقدم المدفوع.</li>
              <li>في حالة إلغاء الحجز قبل الموعد المحدد ب 3 أيام يسترد العميل 50% من قيمة المقدم المدفوع.</li>
              <li>في حالة إلغاء الحجز قبل الموعد المحدد بأقل من 3 أيام لا يسترد العميل قيمة المقدم المدفوع.</li>
            </ol>
            
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }} 
              onClick={() => {
                setTermsChecked(true);
                setTermsOpen(false);
              }}
              fullWidth
            >
              موافق على الشروط والأحكام
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Checkout;
