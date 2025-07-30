import styled from "@emotion/styled";
import { Box } from "@mui/material";
import TagStyle from "../../../../shared/styles/tag.style";

const FloatingTag = styled(Box)(({ position, dark, size }) => ({
    ...TagStyle,
    position: position || "fixed",
    padding: size || 3,
    bottom: 64,
    left: 12,
    backgroundColor: dark ? "black" : "white",
    color: dark ? "white" : 'green',
}));

export default FloatingTag;