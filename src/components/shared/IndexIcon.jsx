import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

// Styled wrapper for the SVG element
// const StyledSvg = styled('svg')(({ size }) => ({
//   width: size,
//   height: size,
//   display: 'inline-block',
// }));
const StyledIcon = styled(Box)(({ size, backgroundColor, color, fontSize }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: size,
  height: size,
  fontSize: fontSize,
  backgroundColor: backgroundColor,
  color: color,
  borderRadius: '50%',
  marginLeft: '8px',
  userSelect: 'none',
}));

const IndexIcon = ({
  number,
  color = 'white',
  backgroundColor = 'inherit',
  size = "1.25rem",
  fontSize = "0.7rem",
}) => (
  <StyledIcon size={size} backgroundColor={backgroundColor} color={color} fontSize={fontSize}>
    {number}
  </StyledIcon>
);

IndexIcon.propTypes = {
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  size: PropTypes.string,
  fontSize: PropTypes.string,
};

export default IndexIcon;