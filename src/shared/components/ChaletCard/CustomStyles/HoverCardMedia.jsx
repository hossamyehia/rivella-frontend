import { styled, CardMedia } from '@mui/material';

const HoverCardMedia = styled(CardMedia, {
    shouldForwardProp: (prop) => prop !== 'isHovered'
})(({ isHovered }) => ({
    height: '100%',
    width: '350px',
    minHeight: '220px',
    objectFit: 'cover',
    objectPosition: 'center',
    cursor: 'pointer',
    transition: 'transform 0.5s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)'
}));
export default HoverCardMedia;