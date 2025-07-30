import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const RoomInfo = styled(Box)(({ theme }) => ({
  position: 'relative',
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1, 2),
  paddingTop: theme.spacing(3.5),
  marginBlockStart: theme.spacing(1),
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
}));

export const RoomInfoIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '-8px',
  left: '50%',
  zIndex: 2,
  transform: 'translateX(-50%)',
  padding: theme.spacing(1),
  "& svg": {
    color: "transparent",
    stroke: theme.palette.primary.main,
    fontSize: '2rem',
  }
}));

export const RoomInfoNumber = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  position: 'absolute',
  top: '-12px',
  left: '-10px',
  width: '24px',
  height: '24px',
  fontSize: '1rem',
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  zIndex: 3,
  boxShadow: `0px 1px 1px rgba(0, 0, 0, 0.2)`,
  backgroundColor: "white",
  borderRadius: '50%',
  padding: theme.spacing(0.25),
}));

export const RoomInfoText = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  fontWeight: 500,
  lineHeight: "3ch",
  color: theme.palette.text.primary,
  
}))