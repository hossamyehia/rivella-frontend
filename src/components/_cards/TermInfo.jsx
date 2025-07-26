import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const TermInfo = styled(Box)(({ theme, borderColor }) => ({
    position: 'relative',
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0, 1.5, 0, 2.35),
    marginInlineStart: theme.spacing(1),
    borderRadius: '3px 5px 5px 3px',
    border: `1px solid ${borderColor || theme.palette.divider}`,
}));

export const TermInfoIcon = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    //   top: '-8px',
    //   left: '50%',
    left: '-10px',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '50%',
    padding: theme.spacing(0.25),
    borderInlineStart: `1px solid ${theme.palette.divider}`,
}));