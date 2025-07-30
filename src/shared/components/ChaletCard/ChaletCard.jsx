import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  Person,
  Hotel,
  Bathtub
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { PriceTag, CodeTag, ShareButton } from '../Tags/Tags.jsx';
import { useUserContext } from '../../context/user.context';
import HoverCardMedia from './CustomStyles/HoverCardMedia.jsx';
import ImageContainer from './CustomStyles/ImageContainer.jsx';
import Swal from 'sweetalert2';
import CopyButton from '../CopyButton';
import { buildShareText } from '../../utils/_helper.js';

const ChaletCard = ({ chalet }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isLogin, wishlist, addToWishlist, removeFromWishlist } = useUserContext();
  const [inWishlist, setInWishlist] = useState(() => {
    return wishlist && wishlist.some(v => chalet._id === v._id);
  })
  const navigate = useNavigate();
  const theme = useTheme();

  const handleViewDetails = () => {
    navigate(`/chalet/${chalet._id}`);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isLogin) {
      Swal.fire({
        icon: 'info',
        title: "",
        text: "يرجي تسجيل الدخول اولا",
      });
      return;
    }
    (async () => {
      const res = inWishlist ? await removeFromWishlist(chalet._id) : await addToWishlist(chalet);
      if (res.success) {
        // Optionally show a toast or feedback message
        Swal.fire({
          icon: 'success',
          title: "تم تحديث القائمة المفضلة",
          text: res.message,
        });
        setInWishlist(value => !value);
      } else {
        Swal.fire({
          icon: res.isWarning ? 'info' : 'error',
          title: "خطأ",
          text: res.message || "حدث خطأ أثناء تحديث القائمة المفضلة",
        });
      }
    })()

  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        maxWidth: '350px',
        minHeight: '360px',
        boxShadow: isHovered ? 4 : 2,
        transition: 'box-shadow 0.3s ease-in-out',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ImageContainer>
        <PriceTag>
          <Typography component="span" fontWeight="bold">
            {chalet.price} ج.م
          </Typography>
          <Typography component="span" variant="caption" sx={{ mr: 0.5, opacity: 0.9 }}>
            / ليلة
          </Typography>
        </PriceTag>

        <CodeTag>
          <Typography component="span" fontWeight="bold">
            {chalet.code}
          </Typography>
        </CodeTag>

        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': { backgroundColor: 'white' },
            zIndex: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          onClick={handleWishlistToggle}
        >
          {inWishlist ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>

        <ShareButton>
          <CopyButton text={buildShareText({ ...chalet, link: `${window.location.origin}/chalet/${chalet._id}` })}></CopyButton>
        </ShareButton>

        <HoverCardMedia
          component="img"
          image={chalet.mainImg || '/placeholder-chalet.jpg'}
          alt={chalet.name}
          isHovered={isHovered}
          role='button'
          tabIndex={0}
          onClick={handleViewDetails}
        />
      </ImageContainer>

      <CardContent sx={{ flexGrow: 1, pt: 3, pb: 2, px: 2 }}>

        <Typography
          gutterBottom
          variant="h5"
          // fontWeight="bold"
          component="div"
          noWrap
          align="right"
          role='button'
          tabIndex={0}
          onClick={handleViewDetails}
          sx={{
            cursor: 'pointer',
            color: theme.palette.text.primary,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            mb: 1.5,
          }}
        >
          {chalet.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, justifyContent: 'flex-start' }}>
          <LocationOn color="primary" fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {chalet.city?.name}{chalet.village?.name ? ` - ${chalet.village.name}` : ''}
          </Typography>
        </Box>

        <Stack direction="row" sx={{ justifyContent: 'space-evenly', textAlign: 'right' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Hotel color="primary" fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">{chalet.bedrooms} غرفة</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Person color="primary" fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">{chalet.guests} ضيف</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Bathtub color="primary" fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">{chalet.bathrooms} حمام</Typography>
          </Box>
        </Stack>

      </CardContent>

    </Card>
  );
};

export default ChaletCard;
