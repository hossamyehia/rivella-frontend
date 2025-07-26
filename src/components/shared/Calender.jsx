// const CalendarContainer = styled(Box)(({ theme }) => ({
//   backgroundColor: '#fff',
//   padding: theme.spacing(2),
//   borderRadius: '8px',
//   boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
// }));

// const CalendarDay = styled(Box)(({ theme, isDisabled, isSelected, isToday }) => ({
//   width: '40px',
//   height: '40px',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   cursor: isDisabled ? 'not-allowed' : 'pointer',
//   borderRadius: '50%',
//   backgroundColor: isSelected
//     ? theme.palette.primary.main
//     : isDisabled
//       ? '#f44336'
//       : isToday
//         ? theme.palette.grey[200]
//         : 'transparent',
//   color: isSelected ? '#fff' : isDisabled ? '#fff' : 'inherit',
//   '&:hover': {
//     backgroundColor: isDisabled
//       ? '#f44336'
//       : isSelected
//         ? theme.palette.primary.dark
//         : theme.palette.grey[100],
//   },
// }));