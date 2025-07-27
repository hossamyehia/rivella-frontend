import { Box, Button, Typography, Paper, Grid, TextField, IconButton, Select, FormControl, InputLabel, MenuItem, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ServicesTab({ dataForm, setDataForm, services, formErrors }) {

    const addArrayItem = (arrayName) => {
        if (arrayName === 'services') {
            setDataForm((prev) => ({
                ...prev,
                services: [...prev.services, { service: '', price: 0 }],
            }));
        }
    };

    const removeArrayItem = (arrayName, index) => {
        if (arrayName === 'services') {
            setDataForm((prev) => {
                const updated = [...prev.services];
                updated.splice(index, 1);
                return { ...prev, services: updated };
            });
        }
    };

    const handleArrayItemChange = (arrayName, index, field, value) => {
        if (arrayName === 'services') {
            const updated = [...dataForm.services];
            updated[index][field] = value;
            setDataForm({ ...dataForm, services: updated });
        }
    };

    return (
        <Box sx={{ mt: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">الخدمات</Typography>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => addArrayItem('services')}
                >
                    إضافة خدمة
                </Button>
            </Box>

            {formErrors.services && (
                <Typography color="error" variant="caption" display="block" mb={2}>
                    {formErrors?.services ? formErrors?.services : ""}
                </Typography>
            )}

            {dataForm.services && !dataForm.services.length && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    لم يتم إضافة أي خدمات بعد. انقر على "إضافة خدمة" لإضافة خدمات.
                </Typography>
            )}

            {dataForm.services.map((item, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth required>
                                <InputLabel>الخدمة</InputLabel>
                                <Select
                                    label="الخدمة"
                                    value={item.service}
                                    onChange={(e) =>
                                        handleArrayItemChange('services', index, 'service', e.target.value)
                                    }
                                >
                                    {services.map((service) => {
                                        const isSelected = dataForm.services.some(
                                            (f, i) => f.service === service._id && i !== index
                                        );

                                        return (
                                            <MenuItem
                                                key={service._id}
                                                value={service._id}
                                                disabled={isSelected}
                                            >
                                                {service.name}
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
                                    handleArrayItemChange('services', index, 'price', e.target.value)
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
                                onClick={() => removeArrayItem('services', index)}
                                disabled={dataForm.services.length <= 1}
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