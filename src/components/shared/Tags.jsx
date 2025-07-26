import { styled } from "@mui/material";
import { Box } from "@mui/material";

const TagStyle = {
    position: 'absolute',
    padding: '4px 12px',
    borderRadius: 20,
    fontWeight: 'bold',
    zIndex: 2,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center'
}

export const PriceTag = styled(Box)(({ theme }) => ({
    ...TagStyle,
    top: 12,
    right: 12,
    backgroundColor: theme.palette.primary.main,
    color: 'white',
}));

export const CodeTag = styled(Box)(({ theme }) => ({
    ...TagStyle,
    bottom: 12,
    right: 12,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.text || 'white',
}));

export const ShareButton = styled(Box)(({ position, dark, size }) => ({
    ...TagStyle,
    position: position || "absolute",
    padding: size || 3,
    bottom: 12,
    left: 12,
    backgroundColor: dark ? "black" : "white",
    color: dark ? "white" : 'gray',
}));