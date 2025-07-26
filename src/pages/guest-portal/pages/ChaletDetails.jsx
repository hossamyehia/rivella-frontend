import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogContent,
  MenuItem,
  Select,
  FormControl,
  IconButton,
  Modal,
  Fade,
  Backdrop,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import PeopleIcon from '@mui/icons-material/People';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { MyContext } from '../../../context/MyContext';
import Loader from '../../../components/Loader';
import showAlert from '../../../components/Alerts';
import { buildShareText, getDayDifference } from '../../../_helper/_helper';
import Alerts from '../../../components/Alerts';
import IndexIcon from '../../../components/shared/IndexIcon';
import { RoomInfo, RoomInfoIcon, RoomInfoNumber, RoomInfoText } from '../../../components/_cards/RoomInfo';
import { TermInfo, TermInfoIcon } from '../../../components/_cards/TermInfo';
import { useApiContext } from '../../../context/ApiContext';
import { ShareButton } from '../../../components/shared/Tags';
import CopyButton from '../../../components/shared/CopyButton';

// Styled components
const InfoList = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginBlockEnd: theme.spacing(2),
}));

////////////////////////////////////

// بداية التصميمات المخصصة
const IconListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 0),
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
  fontSize: "0.9rem",
  fontWeight: 500,
  lineHeight: "3ch",
  // margin: theme.spacing(0.5),
  marginInlineEnd: theme.spacing(0.5),
  borderRadius: '8px',
}));

// تعديل عرض الصور ليأخذ كامل العرض
const ImageSlider = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 500, // ارتفاع ثابت للصور
  width: '100%',
  overflow: 'hidden',
  borderRadius: '8px',
  '&:hover .controls': {
    opacity: 1,
  },
  [theme.breakpoints.down('sm')]: {
    height: 300, // ارتفاع أقل للأجهزة الصغيرة
  },
}));

// تحسين عرض الصورة لتأخذ العرض والارتفاع بالكامل
const SliderImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

const SliderButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  zIndex: 2,
}));

// تحسين مصغرات الصور
const SliderThumbsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflow: 'auto',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 0),
  marginTop: theme.spacing(1),
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.light,
    borderRadius: '3px',
  },
}));

// تحسين عرض مصغرات الصور
const SliderThumb = styled('img')(({ theme, active }) => ({
  width: 100,
  height: 70,
  objectFit: 'cover',
  borderRadius: '8px',
  cursor: 'pointer',
  border: active ? `2px solid ${theme.palette.primary.main}` : 'none',
  opacity: active ? 1 : 0.7,
  '&:hover': {
    opacity: 1,
  },
}));

// تعديل وضع النافذة المنبثقة لعرض الصور بالكامل
const ImageModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// تحسين عرض الصورة في النافذة المنبثقة
const ModalImage = styled('img')(({ theme }) => ({
  maxWidth: '95vw',
  maxHeight: '95vh',
  objectFit: 'contain',
  outline: 'none',
}));



// تعديل لوحة الحجز لتكون ثابتة أثناء التمرير
const BookingPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  position: 'sticky',
  top: '20px', // تقليل المسافة
  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
}));

// كومبوننت الإغلاق للصور المكبرة
const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}));

///////////////////////////////////////
const RIPPONS = (theme) => {
  const [HEIGHT, HEIGHT_UNIT, WIDTH, WIDTH_UNIT] = [85, "%", 5, "px"];
  const [TOP, TOP_UNIT] = [(100 - HEIGHT) / 2, HEIGHT_UNIT]
  return {
    content: "''",
    position: "absolute",
    top: `${TOP}${TOP_UNIT}`,
    height: `${HEIGHT}${HEIGHT_UNIT}`,
    width: `${WIDTH}${WIDTH_UNIT}`,
    backgroundColor: theme.palette.primary.main,
  }
}
const DetailsCard = styled(Box)(({ theme }) => ({
  position: "relative",
  backgroundColor: 'hsl(0, 100%, 100%)',
  borderBlock: "1px solid hsla(0, 0%, 49%, 0.2)",
  padding: "0.5rem 1.2rem",
  marginBlockEnd: "1rem",
  '&::before': {
    ...RIPPONS(theme),
    borderRadius: "5px 0px 0px 5px",
    right: 0,
  },
  '&::after': {
    ...RIPPONS(theme),
    borderRadius: "0px 5px 5px 0px",
    left: 0
  }
}));
const DetailsCardTiTle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: "bold",
  lineHeight: "3.25ch",
  marginBlockEnd: "0.25rem",
}))
//////////////////////////////////////

const ChaletDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const { axiosInstance, isLogin } = useApiContext();

  const [loading, setLoading] = useState(true);
  const [chalet, setChalet] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [totalNights, setTotalNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [disabledDates, setDisabledDates] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarView, setCalendarView] = useState('start'); // 'start' or 'end'
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  // تحميل بيانات الشاليه
  useEffect(() => {
    const fetchChaletDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/chalet/${id}`);

        if (response.data.success) {
          setChalet(response.data.data);

          // معالجة الفترات المحجوزة لإنشاء مصفوفة التواريخ المعطلة
          if (response.data.data.reservedPeriods && response.data.data.reservedPeriods.length > 0) {
            const disabled = [];
            response.data.data.reservedPeriods.forEach(period => {
              const currentDate = new Date(period.checkIn);
              const endDate = new Date(period.checkOut);

              while (currentDate <= endDate) {
                disabled.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
              }
            });

            setDisabledDates(disabled);
          }

          // تعيين عدد الزوار الافتراضي إلى 1
          setGuestCount(1);
        }
      } catch (error) {
        console.error('Error fetching chalet details:', error);
        showAlert('error', 'حدث خطأ أثناء تحميل بيانات الشاليه');
      } finally {
        setLoading(false);
      }
    };

    fetchChaletDetails();
  }, [id, axiosInstance]);

  // حساب إجمالي الليالي والسعر عند تغيير تواريخ الحجز
  useEffect(() => {
    if (startDate && endDate) {
      // حساب عدد الليالي
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setTotalNights(diffDays);

      // حساب السعر الإجمالي
      if (chalet && chalet.price) {
        setTotalPrice(diffDays * chalet.price);
      }
    } else {
      setTotalNights(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, chalet]);

  // التحقق من التواريخ المعطلة
  const isDateDisabled = (date) => {
    return disabledDates.some(disabledDate =>
      date.getFullYear() === disabledDate.getFullYear() &&
      date.getMonth() === disabledDate.getMonth() &&
      date.getDate() === disabledDate.getDate()
    );
  };

  // التنقل بين الصور
  const handleNextImage = () => {
    if (!chalet) return;

    const images = [chalet.mainImg, ...chalet.imgs];
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    if (!chalet) return;

    const images = [chalet.mainImg, ...chalet.imgs];
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleThumbClick = (index) => {
    setCurrentImageIndex(index);
  };

  // فتح صورة في وضع ملء الشاشة
  const handleOpenImageModal = (index) => {
    setModalImageIndex(index);
    setOpenImageModal(true);
  };

  // التقويم وحجز التواريخ
  const handleCalendarOpen = (view) => {
    setCalendarView(view);
    setIsCalendarOpen(true);
  };

  const handleDateSelect = (date) => {
    if (calendarView === 'start') {
      setStartDate(date);
      // إذا كان تاريخ البداية بعد تاريخ النهاية، إعادة تعيين تاريخ النهاية
      if (endDate && date > endDate) {
        setEndDate(null);
      }
      // التبديل تلقائيًا إلى اختيار تاريخ النهاية
      setCalendarView('end');
    } else {
      const minNights = chalet?.minNights || 1;
      if (getDayDifference(startDate, date) < minNights) {
        Alerts.warning('خطأ', 'لا يمكنك اختيار تاريخ مغادرة قبل ' + chalet.minNights + ' ليالي من تاريخ الوصول');
        setIsCalendarOpen(false);
        return;
      }
      setEndDate(date);
      setIsCalendarOpen(false);
    }
  };

  // إعداد نموذج الحجز
  const handleBookNow = () => {
    if (!startDate || !endDate) {
      Alerts.warning('خطأ', 'يرجى اختيار تواريخ الحجز');
      return;
    }

    // فتح نافذة التأكيد
    setConfirmationOpen(true);
  };

  // تأكيد الحجز وحفظ البيانات
  const confirmBooking = () => {
    // إعداد بيانات الحجز
    const bookingDetails = {
      chaletId: chalet._id,
      name: chalet.name,
      image: chalet.mainImg,
      location: `${chalet.city?.name} - ${chalet.village?.name}`,
      price: chalet.price,
      startDate,
      endDate,
      totalNights,
      guestCount,
      totalPrice
    };

    // حفظ البيانات في Session Storage
    sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));

    // الانتقال إلى صفحة الدفع
    navigate('/checkout');

    // إغلاق نافذة التأكيد
    setConfirmationOpen(false);
  };

  // عرض مؤشر التحميل
  if (loading) {
    return <Loader />;
  }

  // التحقق من وجود بيانات الشاليه
  if (!chalet) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: '16px' }}>
          <Typography variant="h5" color="error">
            لم يتم العثور على الشاليه
          </Typography>
        </Paper>
      </Container>
    );
  }

  // إعداد مصفوفة الصور
  const allImages = [chalet.mainImg, ...chalet.imgs];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>

      {/* قسم عرض الصور بالكامل في الأعلى */}
      <Box sx={{ mb: 4, width: '100%' }}>
        <ImageSlider>
          <SliderImage
            src={allImages[currentImageIndex]}
            alt={chalet.name}
            onClick={() => handleOpenImageModal(currentImageIndex)}
          />

          <SliderButton
            className="controls"
            sx={{ left: 16 }}
            onClick={handlePrevImage}
          >
            <ArrowForwardIosIcon />
          </SliderButton>

          <SliderButton
            className="controls"
            sx={{ right: 16 }}
            onClick={handleNextImage}
          >
            <ArrowBackIosIcon />
          </SliderButton>
        </ImageSlider>

        <SliderThumbsContainer>
          {allImages.map((img, index) => (
            <SliderThumb
              key={index}
              src={img}
              alt={`thumbnail-${index}`}
              active={index === currentImageIndex}
              onClick={() => handleThumbClick(index)}
            />
          ))}
        </SliderThumbsContainer>
      </Box>

      {/* نافذة لعرض الصور بحجم كامل تغطي الصفحة */}
      <ImageModal
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          style: { backgroundColor: 'rgba(0, 0, 0, 0.9)' } // خلفية داكنة أكثر
        }}
      >
        <Fade in={openImageModal}>
          <Box sx={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ModalImage
              src={allImages[modalImageIndex]}
              alt={chalet.name}
            />
            <CloseButton
              onClick={() => setOpenImageModal(false)}
            >
              <CloseIcon />
            </CloseButton>

            <SliderButton
              sx={{ left: 16 }}
              onClick={() => setModalImageIndex(prev =>
                prev === 0 ? allImages.length - 1 : prev - 1
              )}
            >
              <ArrowForwardIosIcon />
            </SliderButton>

            <SliderButton
              sx={{ right: 16 }}
              onClick={() => setModalImageIndex(prev =>
                prev === allImages.length - 1 ? 0 : prev + 1
              )}
            >
              <ArrowBackIosIcon />
            </SliderButton>
          </Box>
        </Fade>
      </ImageModal>

      <Grid container justifyContent="space-between" alignItems="baseline" sx={{ mb: 2 }}>
        <Grid item xs={12} md={6} sx={{ my: 2 }}>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography component="span" fontWeight="bold" sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '4px 12px',
              marginRight: 2,
              borderRadius: 20,
              fontWeight: 'bold',
              backgroundColor: theme.palette.secondary.text,
              color: 'white',
            }}>
              {chalet.code}
            </Typography>
            <Typography variant="h3" color="primary" gutterBottom fontWeight="bold" mb={0}>
              {chalet.name}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1" color="text.secondary">
              {chalet.city?.name} - {chalet.village?.name}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ my: 2 }}>
          <Grid container alignItems="center" sx={{ maxWidth: "max-content" }}>
            <Grid item xs={6} sm={3} sx={{ borderRight: "1px solid gray", px: 1.5 }}>
              <Box textAlign="center">
                <PriceChangeIcon color="primary" sx={{ fontSize: 24 }} />
                <Typography variant="subtitle1" fontWeight="bold">{chalet.price} جنية</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} sx={{ borderRight: "1px solid gray", px: 1.5 }}>
              <Box textAlign="center">
                <BusinessIcon color="primary" sx={{ fontSize: 24 }} />
                <Typography variant="subtitle1" fontWeight="bold">{chalet.type}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} sx={{ borderRight: "1px solid gray", px: 1.5 }}>
              <Box textAlign="center">
                <BedIcon color="primary" sx={{ fontSize: 24 }} />
                <Typography variant="subtitle1" fontWeight="bold">{chalet.bedrooms} غرفة</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} sx={{ borderRight: "1px solid gray", px: 1.5 }} >
              <Box textAlign="center">
                <BathtubIcon color="primary" sx={{ fontSize: 24 }} />
                <Typography variant="subtitle1" fontWeight="bold">{chalet.bathrooms} حمام</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} sx={{ my: 0.5, px: 1.5 }}>
              <Box textAlign="center">
                <PeopleIcon color="primary" sx={{ fontSize: 24 }} />
                <Typography variant="subtitle1" fontWeight="bold">{chalet.guests} أفراد</Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={12} size={12}>
          {chalet.description && (
            <DetailsCard>
              <DetailsCardTiTle>
                الوصف
              </DetailsCardTiTle>
              <Typography variant="body1" color="text.secondary" mb={2}>
                {chalet.description || 'لا يوجد وصف متاح لهذا الشاليه.'}
              </Typography>
            </DetailsCard>
          )}
        </Grid> */}
      </Grid>

      {/* <Divider sx={{ my: 2 }} /> */}

      {/* قسم المعلومات والحجز */}
      <Grid container spacing={4}>
        {/* معلومات الشاليه - على اليسار */}
        <Grid item size={12} sx={{ order: { xs: 1, md: 1 } }}>
          <Box mb={4}>
            {chalet.description && (
              <DetailsCard>
                <DetailsCardTiTle>
                  الوصف
                </DetailsCardTiTle>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  {chalet.description || 'لا يوجد وصف متاح لهذا الشاليه.'}
                </Typography>
              </DetailsCard>
            )}
            {/* مميزات الشاليه الأساسية */}
            {/* فيديو الشاليه */}
            {chalet.video && (
              <Box mb={4}>
                <Typography
                  variant="h6"
                  color="primary"
                  gutterBottom
                  fontWeight="bold"
                >
                  فيديو الشاليه
                </Typography>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    // نسبة الارتفاع = 9/16 = 56.25%
                    paddingTop: '56.25%',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="video"
                    src={chalet.video}
                    controls
                    preload="metadata"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* تفاصيل غرف النوم */}
            {chalet.rooms && chalet.rooms.length > 0 && (
              <DetailsCard>
                <DetailsCardTiTle>
                  الغرف
                </DetailsCardTiTle>
                <InfoList>
                  {chalet.rooms.map(({ _id, beds, moreDetails }, index) => (
                    <RoomInfo key={_id}>
                      <RoomInfoIcon>
                        <BedIcon color="primary" />
                      </RoomInfoIcon>
                      <RoomInfoNumber>
                        {index + 1}
                      </RoomInfoNumber>
                      {beds.map(({ count, bedType }, index) => (
                        <RoomInfoText key={index}>
                          {count} {bedType}
                        </RoomInfoText>
                      ))}
                      {(moreDetails && moreDetails !== '') && (
                        <RoomInfoText>
                          {moreDetails}
                        </RoomInfoText>
                      )
                      }
                    </RoomInfo>
                  ))}
                </InfoList>
              </DetailsCard>
            )}

            {/* المميزات */}
            {chalet.features && chalet.features.length > 0 && (
              <DetailsCard >
                <DetailsCardTiTle>
                  المميزات
                </DetailsCardTiTle>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBlockEnd: theme.spacing(2), }}>
                  {chalet.features.map((value, index) => (
                    <Box
                      key={value._id}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      {/* <CheckCircleIcon /> */}
                      <FeatureChip
                        // icon={<IndexIcon number={index + 1} backgroundColor={theme.palette.primary.main} />}
                        label={`${value.feature.name} - ${value.price ? `${value.price} جنية` : 'مجاني'}`}
                        color="primary"
                        variant="outlined"
                      />
                      {/* <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ mt: 0.5 }}
                      >
                        {feature.description}
                      </Typography> */}
                    </Box>
                  ))}
                </Box>
              </DetailsCard>
            )}

            {/* قواعد المكان */}
            {chalet.terms && chalet.terms.length > 0 && (
              <DetailsCard>
                <DetailsCardTiTle>
                  القواعد
                </DetailsCardTiTle>
                <InfoList>
                  {chalet.terms.map((term, index) => (
                    <TermInfo key={index} borderColor={term.allowed ? 'green' : 'red'}>
                      <TermInfoIcon>
                        {term.allowed ?
                          <CheckCircleIcon color="success" fontSize="small" /> :
                          <CancelIcon color="error" fontSize="small" />
                        }
                      </TermInfoIcon>
                      <ListItemText primary={term.term} />
                    </TermInfo>
                  ))}
                </InfoList>
              </DetailsCard>
            )}
          </Box>
        </Grid>
        <Grid item size={12} sx={{ order: { xs: 2, md: 2 } }}>
          <BookingPanel>
            {/* <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {chalet.price} جنية
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              / ليلة
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} /> */}

            {/* اختيار تواريخ الحجز */}
            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                تواريخ الإقامة
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleCalendarOpen('start')}
                    sx={{
                      justifyContent: 'flex-start',
                      height: '56px',
                      borderColor: startDate ? theme.palette.primary.main : theme.palette.grey[300],
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                      }
                    }}
                  >
                    <CalendarMonthIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="caption" display="block" textAlign="left" color="text.secondary">
                        تاريخ الوصول
                      </Typography>
                      <Typography variant="body2" textAlign="left">
                        {startDate ? new Date(startDate).toLocaleDateString('ar-EG') : 'اختر التاريخ'}
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleCalendarOpen('end')}
                    disabled={!startDate}
                    sx={{
                      justifyContent: 'flex-start',
                      height: '56px',
                      borderColor: endDate ? theme.palette.primary.main : theme.palette.grey[300],
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                      }
                    }}
                  >
                    <CalendarMonthIcon sx={{ mr: 1, color: startDate ? 'primary.main' : 'text.disabled' }} />
                    <Box>
                      <Typography variant="caption" display="block" textAlign="left" color="text.secondary">
                        تاريخ المغادرة
                      </Typography>
                      <Typography variant="body2" textAlign="left">
                        {endDate ? new Date(endDate).toLocaleDateString('ar-EG') : 'اختر التاريخ'}
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* اختيار عدد الضيوف */}
            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                عدد الضيوف
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                >
                  {[...Array(chalet.guests)].map((_, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {index + 1} {index === 0 ? 'ضيف' : index < 10 ? 'ضيوف' : 'ضيف'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* حساب التكلفة الإجمالية */}
            {totalNights > 0 && (
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body1">
                    {chalet.price} × {totalNights} ليلة
                  </Typography>
                  <Typography variant="body1">
                    {totalPrice} جنية
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" fontWeight="bold">
                    المجموع
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {totalPrice} جنية
                  </Typography>
                </Box>
              </Box>
            )}

            {/* زر الحجز */}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleBookNow}
              disabled={!startDate || !endDate}
              sx={{ borderRadius: '8px', py: 1.5 }}
            >
              احجز الآن
            </Button>
          </BookingPanel>
        </Grid>
        {/* قسم الحجز - على اليمين وثابت أثناء التمرير */}
      </Grid>
      {/* نافذة التقويم */}
      <Dialog
        open={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" color="primary">
              {calendarView === 'start' ? 'اختر تاريخ الوصول' : 'اختر تاريخ المغادرة'}
            </Typography>
            <IconButton onClick={() => setIsCalendarOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              disablePast
              value={calendarView === 'start' ? startDate : endDate}
              onChange={handleDateSelect}
              shouldDisableDate={isDateDisabled}
              minDate={calendarView === 'end' && startDate ? new Date(new Date(startDate).getTime() + 86400000) : undefined}
              views={['day']}
              showDaysOutsideCurrentMonth
              sx={{
                '& .MuiPickersDay-root.Mui-disabled': {
                  backgroundColor: '#ffcdd2',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#ef9a9a',
                  }
                }
              }}
            />
          </LocalizationProvider>
        </DialogContent>
      </Dialog>

      {/* نافذة تأكيد الحجز */}
      <Dialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Box textAlign="center" mb={2}>
            <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
              تأكيد الحجز
            </Typography>
          </Box>

          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {chalet.name}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {chalet.city?.name} - {chalet.village?.name}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  تاريخ الوصول
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {startDate && new Date(startDate).toLocaleDateString('ar-EG')}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  تاريخ المغادرة
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {endDate && new Date(endDate).toLocaleDateString('ar-EG')}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  عدد الليالي
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {totalNights} ليلة
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  عدد الضيوف
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {guestCount} {guestCount === 1 ? 'ضيف' : 'ضيوف'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  سعر الليلة
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {chalet.price} جنية
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  المجموع
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {totalPrice} جنية
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Box display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setConfirmationOpen(false)}
              sx={{ borderRadius: '8px', px: 3 }}
            >
              إلغاء
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={confirmBooking}
              sx={{ borderRadius: '8px', px: 3 }}
            >
              متابعة الدفع
            </Button>
          </Box>


        </DialogContent>
      </Dialog>

      <ShareButton position={'fixed'} dark={true} size={4}>
        <CopyButton text={buildShareText({ ...chalet, link: `${window.location.origin}/chalet/${chalet._id}` })}></CopyButton>
      </ShareButton>
    </Container>
  );
};

export default ChaletDetails;
