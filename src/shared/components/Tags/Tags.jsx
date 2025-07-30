import { styled } from "@mui/material";
import { Box } from "@mui/material";
import TagStyle from "../../styles/tag.style";

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

