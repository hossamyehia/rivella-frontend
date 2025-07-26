import { styled, Box } from '@mui/material';

const ImageContainer = styled(Box)({
  position: 'relative',
  maxHeight: 220,
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
    zIndex: 1,
    pointerEvents: 'none'
  }
});

export default ImageContainer;