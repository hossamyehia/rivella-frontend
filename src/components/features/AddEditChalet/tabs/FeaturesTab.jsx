import { Box, Button, Typography, Paper, Grid, TextField, IconButton, Select, FormControl, InputLabel, MenuItem, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FeaturesTab({ dataForm, setDataForm, features, formErrors }) {

    const addArrayItem = (arrayName) => {
        if (arrayName === 'features') {
            setDataForm((prev) => ({
                ...prev,
                features: [...prev.features, { feature: '', price: 0 }],
            }));
        }
    };

    const removeArrayItem = (arrayName, index) => {
        if (arrayName === 'features') {
            setDataForm((prev) => {
                const updated = [...prev.features];
                updated.splice(index, 1);
                return { ...prev, features: updated };
            });
        }
    };

    const handleArrayItemChange = (arrayName, index, field, value) => {
        if (arrayName === 'features') {
            const updated = [...dataForm.features];
            updated[index][field] = value;
            setDataForm({ ...dataForm, features: updated });
        }
    };

    return (
        <Box sx={{ mt: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">المميزات</Typography>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => addArrayItem('features')}
                >
                    إضافة ميزة
                </Button>
            </Box>

            {formErrors.features && (
                <Typography color="error" variant="caption" display="block" mb={2}>
                    {formErrors.features}
                </Typography>
            )}

            {!dataForm.features.length && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    لم يتم إضافة أي ميزات بعد. انقر على "إضافة ميزة" لإضافة ميزات.
                </Typography>
            )}

            {dataForm.features.map((item, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth required>
                                <InputLabel>الميزة</InputLabel>
                                <Select
                                    label="الميزة"
                                    value={item.feature}
                                    onChange={(e) =>
                                        handleArrayItemChange('features', index, 'feature', e.target.value)
                                    }
                                >
                                    {features.map((feature) => {
                                        const isSelected = dataForm.features.some(
                                            (f, i) => f.feature === feature._id && i !== index
                                        );

                                        return (
                                            <MenuItem
                                                key={feature._id}
                                                value={feature._id}
                                                disabled={isSelected}
                                            >
                                                {feature.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                type="number"
                                label="السعر"
                                sx={{ mb: 0 }}
                                value={item.price}
                                onChange={(e) =>
                                    handleArrayItemChange('features', index, 'price', e.target.value)
                                }
                                InputProps={{
                                    inputProps: { min: 0 },
                                    startAdornment: <InputAdornment position="start">جنيه</InputAdornment>,
                                }}
                            />
                        </Grid>

                        <Grid item size={{ xs: 12, md: 2 }} display="flex" alignItems="center" justifyContent="center">
                            <IconButton
                                color="error"
                                onClick={() => removeArrayItem('features', index)}
                                disabled={dataForm.features.length <= 1}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Paper>
            ))}

        </Box>
    );
}
// <Box sx={{ mt: 1 }}>
//     <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="subtitle1">المميزات</Typography>
//         <Button
//             variant="outlined"
//             size="small"
//             startIcon={<AddIcon />}
//             onClick={() => addArrayItem('features')}
//         >
//             إضافة ميزة
//         </Button>
//     </Box>

//     {formErrors.features && (
//         <Typography color="error" variant="caption" display="block" mb={2}>
//             {formErrors.features}
//         </Typography>
//     )}

//     {dataForm.features.map((feature, index) => (
//         <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
//             <Grid container spacing={2}>
//                 <Grid item xs={12} sm={5}>
//                     <TextField
//                         fullWidth
//                         label="اسم الميزة"
//                         value={feature.name}
//                         onChange={(e) => handleArrayItemChange('features', index, 'name', e.target.value)}
//                         required={index === 0}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={5}>
//                     <TextField
//                         fullWidth
//                         label="وصف الميزة"
//                         value={feature.description}
//                         onChange={(e) => handleArrayItemChange('features', index, 'description', e.target.value)}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={2} display="flex" alignItems="center" justifyContent="center">
//                     <IconButton
//                         color="error"
//                         onClick={() => removeArrayItem('features', index)}
//                         disabled={dataForm.features.length <= 1}
//                     >
//                         <DeleteIcon />
//                     </IconButton>
//                 </Grid>
//             </Grid>
//         </Paper>
//     ))}
// </Box>