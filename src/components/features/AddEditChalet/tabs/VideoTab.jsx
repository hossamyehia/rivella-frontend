import { Box, Typography } from '@mui/material';

export default function VideoTab({ chaletForm, handleFormChange, formErrors }) {
    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>فيديو الشاليه (اختياري)</Typography>
            <input
                type="file"
                accept="video/*"
                name="video"
                onChange={handleFormChange}
                style={{ display: 'block', marginBottom: '10px' }}
            />
            {chaletForm.video && (
                <Typography variant="caption" color="primary">
                    تم اختيار الفيديو: {chaletForm.video.name}
                </Typography>
            )}
        </Box>
    );
}