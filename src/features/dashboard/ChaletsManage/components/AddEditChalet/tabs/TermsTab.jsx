import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip } from '@mui/material';

export default function TermsTab({ chaletForm, setChaletForm, terms, formErrors }) {

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
