import {
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Typography,
    FormControlLabel,
    Switch,
} from '@mui/material';

export default function BasicInfoTab({ chaletForm, handleFormChange, formErrors, cities, villages }) {
    return (<Grid container wrap='wrap' spacing={2} sx={{ mt: 1 }}>

        <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="اسم الشاليه"
                name="name"
                value={chaletForm.name}
                onChange={handleFormChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
            />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
                <InputLabel id="add-type-label">النوع</InputLabel>
                <Select
                    fullWidth
                    labelId="add-type-label"
                    name="type"
                    value={chaletForm.type}
                    label="النوع"
                    onChange={handleFormChange}
                >
                    <MenuItem value="شاليه">شاليه</MenuItem>
                    <MenuItem value="فيلا">فيلا</MenuItem>
                </Select>
            </FormControl>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth error={!!formErrors.city} required>
                <InputLabel id="add-city-label">المدينة</InputLabel>
                <Select
                    fullWidth
                    labelId="add-city-label"
                    name="city"
                    value={chaletForm.city}
                    label="المدينة"
                    onChange={handleFormChange}
                >
                    {cities.map(city => (
                        <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                    ))}
                </Select>
                {formErrors.city && (
                    <Typography color="error" variant="caption">
                        {formErrors.city}
                    </Typography>
                )}
            </FormControl>
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth error={!!formErrors.village} required>
                <InputLabel id="add-village-label">القرية</InputLabel>
                <Select
                    fullWidth
                    labelId="add-village-label"
                    name="village"
                    value={chaletForm.village}
                    label="القرية"
                    onChange={handleFormChange}
                    disabled={chaletForm.city === ''}
                >
                    {villages.filter((village)=> chaletForm.city ? village.city._id === chaletForm.city: true).map(village => (
                        <MenuItem key={village._id} value={village._id}>{village.name}</MenuItem>
                    ))}
                </Select>
                {formErrors.village && (
                    <Typography color="error" variant="caption">
                        {formErrors.village}
                    </Typography>
                )}
            </FormControl>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="الموقع"
                name="location"
                value={chaletForm.location}
                onChange={handleFormChange}
                error={!!formErrors.location}
                helperText={formErrors.location}
                required
            />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="السعر لليلة"
                name="price"
                type="number"
                value={chaletForm.price}
                onChange={handleFormChange}
                error={!!formErrors.price}
                helperText={formErrors.price}
                required
                InputProps={{
                    startAdornment: <InputAdornment position="start">جنيه</InputAdornment>,
                }}
            />
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="الكود"
                name="code"
                value={chaletForm.code}
                onChange={handleFormChange}
                error={!!formErrors.code}
                helperText={formErrors.code}
                required
            />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="الحد الأدنى للإقامة (ليالي)"
                name="minNights"
                type="number"
                value={chaletForm.minNights}
                onChange={handleFormChange}
                inputProps={{ min: 1 }}
                error={!!formErrors.minNights}
                helperText={formErrors.minNights}
                required
            />
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
            <TextField
                fullWidth
                label="عدد الغرف"
                name="bedrooms"
                type="number"
                value={chaletForm.bedrooms}
                onChange={handleFormChange}
                inputProps={{ min: 1 }}
            />
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
            <TextField
                fullWidth
                label="عدد الحمامات"
                name="bathrooms"
                type="number"
                value={chaletForm.bathrooms}
                onChange={handleFormChange}
                error={!!formErrors.code}
                helperText={formErrors.code}
                inputProps={{ min: 1 }}
            />
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
            <TextField
                fullWidth
                label="عدد الضيوف"
                name="guests"
                type="number"
                value={chaletForm.guests}
                onChange={handleFormChange}
                inputProps={{ min: 1 }}
            />
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
            <FormControlLabel
                control={
                    <Switch
                        checked={chaletForm.isVisiable}
                        onChange={handleFormChange}
                        name={`isVisiable`}
                    />
                }
                label={chaletForm.isVisiable ? "موجود في الواجهة" : "غير موجود في الواجهة"}
            />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
            <FormControlLabel
                control={
                    <Switch
                        checked={chaletForm.isActive}
                        onChange={handleFormChange}
                        name={`isActive`}
                    />
                }
                label={chaletForm.isActive ? "مفعل" : "غير مفعل"}
            />
        </Grid>
    </Grid>)
}