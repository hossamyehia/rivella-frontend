import { Grid, Typography, Box, Button } from '@mui/material';

export default function ImagesTab({ chaletForm, handleFormChange, formErrors, isEditMode }) {
    return (
        // <Grid container spacing={2} sx={{ mt: 1 }}>
        //     <Grid item xs={12}>
        //         <Typography variant="subtitle1" gutterBottom>الصورة الرئيسية</Typography>
        //         <input
        //             type="file"
        //             accept="image/*"
        //             name="mainImg"
        //             onChange={handleFormChange}
        //             style={{ display: 'block', marginBottom: '10px' }}
        //             required
        //         />
        //         {formErrors.mainImg && <Typography color="error" variant="caption">{formErrors.mainImg}</Typography>}
        //     </Grid>
        //     <Grid item xs={12}>
        //         <Typography variant="subtitle1" gutterBottom>الصور الإضافية</Typography>
        //         <input
        //             type="file"
        //             accept="image/*"
        //             name="imgs"
        //             onChange={handleFormChange}
        //             multiple
        //             style={{ display: 'block' }}
        //         />
        //     </Grid>
        // </Grid>
        <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>الصورة الرئيسية</Typography>
                <input
                    type="file"
                    accept="image/*"
                    name="mainImg"
                    onChange={handleFormChange}
                    style={{ display: 'block', marginBottom: '10px' }}
                    required
                />
                {chaletForm.mainImg && (
                    <Box mt={2}>
                        <Typography variant="caption">الصورة الحالية:</Typography>
                        <img
                            src={(chaletForm.mainImg && typeof chaletForm.mainImg === 'string') ? chaletForm.mainImg : URL.createObjectURL(chaletForm.mainImg)}
                            alt="الصورة الرئيسية الحالية"
                            style={{ maxWidth: '100%', maxHeight: '200px', display: 'block', marginTop: '5px' }}
                        />
                    </Box>
                )}
                {formErrors.mainImg && <Typography color="error" variant="caption">{formErrors.mainImg}</Typography>}
            </Grid>

            <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>الصور الإضافية</Typography>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const updated = [...chaletForm.imgs, ...files];
                        handleFormChange({
                            target: { name: 'imgs', value: updated }
                        });
                    }}
                    style={{ display: 'block', marginBottom: 10 }}
                />

                <Grid container spacing={1}>
                    {chaletForm.imgs && chaletForm.imgs.map((img, index) => {
                        const imgURL = typeof img === 'string' ? img : URL.createObjectURL(img);
                        return (
                            <Grid item xs={4} sm={3} md={2} key={index}>
                                <Box sx={{ position: 'relative', border: '1px solid #ccc', p: 1, borderRadius: 1 }}>
                                    <img src={imgURL} alt={`img-${index}`} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 4 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Button
                                            size="small"
                                            onClick={() => {
                                                const imgs = [...chaletForm.imgs];
                                                if (index > 0) {
                                                    [imgs[index], imgs[index - 1]] = [imgs[index - 1], imgs[index]];
                                                    handleFormChange({ target: { name: 'imgs', value: imgs } });
                                                }
                                            }}
                                            disabled={index === 0}
                                        >&#8594;</Button>
                                        <Button
                                            size="small"
                                            onClick={() => {
                                                const imgs = [...chaletForm.imgs];
                                                if (index < imgs.length - 1) {
                                                    [imgs[index], imgs[index + 1]] = [imgs[index + 1], imgs[index]];
                                                    handleFormChange({ target: { name: 'imgs', value: imgs } });
                                                }
                                            }}
                                            disabled={index === chaletForm.imgs.length - 1}
                                        >&#8592;</Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => {
                                                const imgs = [...chaletForm.imgs];
                                                imgs.splice(index, 1);
                                                handleFormChange({ target: { name: 'imgs', value: imgs } });
                                            }}
                                        >
                                            🗑️
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        </Grid>
    );
}