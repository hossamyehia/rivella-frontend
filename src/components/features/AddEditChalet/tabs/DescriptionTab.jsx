import { Box, Typography, TextField } from '@mui/material';

export default function DescriptionTab({ chaletForm, handleFormChange, formErrors }) {
    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>وصف الشاليه</Typography>
            <TextField
                fullWidth
                multiline
                rows={8}
                name="description"
                value={chaletForm.description}
                onChange={handleFormChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
                placeholder="أدخل وصفًا تفصيليًا للشاليه هنا..."
                variant="outlined"
                required
            />
        </Box>
    );
}