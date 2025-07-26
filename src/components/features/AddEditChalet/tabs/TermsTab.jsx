import { Box, Button, Typography, Paper, Grid, TextField, IconButton, Switch, FormControlLabel, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function TermsTab({ chaletForm, setChaletForm, terms, formErrors }) {
    const addTerm = (id) => {
        setChaletForm((prev) => ({
            ...prev,
            terms: [...prev.terms, id]
        }));
    };

    const removeTerm = (id) => {
        setChaletForm((prev) => ({
            ...prev,
            terms: prev.terms.filter(termId => termId !== id)
        }));
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" mb={1}>الشروط</Typography>
            {formErrors.terms && (
                <Typography variant="caption" color="error" display="block" mb={2}>
                    {formErrors.terms}
                </Typography>
            )}
            <Paper variant="outlined" sx={{ p: 2 }}>
                <FormControl fullWidth error={!!formErrors.terms}>
                    <InputLabel>اختيار الشروط</InputLabel>
                    <Select
                        multiple
                        value={chaletForm.terms}
                        onChange={(e) =>
                            setChaletForm((prev) => ({
                                ...prev,
                                terms: e.target.value
                            }))
                        }
                        input={<OutlinedInput label="اختيار الشروط" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((id) => {
                                    const termObj = terms.find((t) => t._id === id);
                                    return (
                                        <Chip
                                            key={id}
                                            label={
                                                `${termObj?.term || id} - ${termObj?.allowed ? 'مسموح' : 'غير مسموح'}`
                                            }
                                            color={termObj?.allowed ? 'success' : 'error'}
                                            variant="outlined"
                                        />
                                    );
                                })}
                            </Box>
                        )}
                    >
                        {terms.map((term) => (
                            <MenuItem key={term._id} value={term._id}>
                                {term.term} - {term.allowed ? 'مسموح' : 'غير مسموح'}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>
        </Box>
    );
}



/////////////////////////////////////////////////////////
// <Box sx={{ mt: 1 }}>
//     <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="subtitle1">الشروط</Typography>
//         <Button
//             variant="outlined"
//             size="small"
//             startIcon={<AddIcon />}
//             onClick={() => addArrayItem('terms')}
//         >
//             إضافة شرط
//         </Button>
//     </Box>

//     {formErrors.terms && (
//         <Typography color="error" variant="caption" display="block" mb={2}>
//             {formErrors.terms}
//         </Typography>
//     )}

//     {chaletForm.terms.map((term, index) => (
//         <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
//             <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                     <TextField
//                         fullWidth
//                         label="الشرط"
//                         value={term.term}
//                         onChange={(e) => handleArrayItemChange('terms', index, 'term', e.target.value)}
//                         required={index === 0}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={4} display="flex" alignItems="center">
//                     <FormControlLabel
//                         control={
//                             <Switch
//                                 checked={term.allowed}
//                                 onChange={(e) => handleArrayItemChange('terms', index, 'allowed', e.target.checked)}
//                                 name={`allowed-${index}`}
//                             />
//                         }
//                         label={term.allowed ? "مسموح" : "غير مسموح"}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={2} display="flex" alignItems="center" justifyContent="center">
//                     <IconButton
//                         color="error"
//                         onClick={() => removeArrayItem('terms', index)}
//                         disabled={chaletForm.terms.length <= 1}
//                     >
//                         <DeleteIcon />
//                     </IconButton>
//                 </Grid>
//             </Grid>
//         </Paper>
//     ))}
// </Box>