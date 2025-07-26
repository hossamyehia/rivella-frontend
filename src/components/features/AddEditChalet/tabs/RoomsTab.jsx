import { Box, Button, Typography, Paper, Grid, TextField, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';


export default function RoomsTab({ chaletForm, setChaletForm, bedTypes, formErrors }) {

    const addBed = (roomIndex) => {
        const updated = [...chaletForm.rooms];
        updated[roomIndex].beds.push({ count: 1, bedType: '' });
        setChaletForm({ ...chaletForm, rooms: updated });
    };

    const removeBed = (roomIndex, bedIndex) => {
        const updated = [...chaletForm.rooms];
        updated[roomIndex].beds.splice(bedIndex, 1);
        setChaletForm({ ...chaletForm, rooms: updated });
    };

    const handleBedChange = (roomIndex, bedIndex, field, value) => {
        const updated = [...chaletForm.rooms];
        updated[roomIndex].beds[bedIndex][field] = value;
        setChaletForm({ ...chaletForm, rooms: updated });
    };

    const handleRoomChange = (roomIndex, field, value) => {
        const updated = [...chaletForm.rooms];
        updated[roomIndex][field] = value;
        setChaletForm({ ...chaletForm, rooms: updated });
    };

    const addArrayItem = (arrayName) => {
        if (arrayName === 'rooms') {
            setChaletForm({
                ...chaletForm,
                rooms: [
                    ...chaletForm.rooms,
                    { beds: [{ count: 1, bedType: '' }], moreDetails: '' }
                ]
            });
        }
    };

    const removeRoom = (roomIndex) => {
        const updated = [...chaletForm.rooms];
        updated.splice(roomIndex, 1);
        setChaletForm({ ...chaletForm, rooms: updated });
    };

    return (
        <Box sx={{ mt: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">تفاصيل الغرف</Typography>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => addArrayItem('rooms')}
                >
                    إضافة غرفة
                </Button>
            </Box>

            {formErrors.rooms && (
                <Typography color="error" variant="caption" display="block" mb={2}>
                    {formErrors.rooms}
                </Typography>
            )}

            {!chaletForm.rooms.length && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    لم يتم إضافة أي غرف بعد. انقر على "إضافة غرفة" لإضافة غرف.
                </Typography>
            )}

            {chaletForm.rooms.map((room, roomIndex) => (
                <Paper key={roomIndex} variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Grid container sx={{ mb: 1 }} justifyContent={"space-between"} alignItems={"center"}>
                        <Grid item>
                            <Typography variant="subtitle" mb={1}>
                                غرفة رقم {roomIndex + 1}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <IconButton
                                color="error"
                                onClick={() => removeRoom(roomIndex)}
                                disabled={chaletForm.rooms.length <= 1}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>


                    {room.beds.map((bed, bedIndex) => (
                        <Grid container spacing={2} key={bedIndex} sx={{ mb: 2 }} alignItems="center">
                            <Grid item size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    sx={{ mb: 0 }}
                                    type="number"
                                    label="عدد الأسرة"
                                    value={bed.count}
                                    onChange={(e) =>
                                        handleBedChange(roomIndex, bedIndex, 'count', e.target.value)
                                    }
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            </Grid>
                            <Grid item size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel>نوع السرير</InputLabel>
                                    <Select
                                        value={bed.bedType}
                                        label="نوع السرير"
                                        onChange={(e) =>
                                            handleBedChange(roomIndex, bedIndex, 'bedType', e.target.value)
                                        }
                                    >
                                        {bedTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item size={{ xs: 12, md: 2 }}>
                                <IconButton
                                    color="error"
                                    onClick={() => removeBed(roomIndex, bedIndex)}
                                    disabled={room.beds.length <= 1}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}

                    <Box mt={1} mb={2}>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => addBed(roomIndex)}
                            startIcon={<AddIcon />}
                        >
                            إضافة سرير
                        </Button>
                    </Box>


                    <TextField
                        fullWidth
                        label="تفاصيل إضافية"
                        value={room.moreDetails}
                        onChange={(e) =>
                            handleRoomChange(roomIndex, 'moreDetails', e.target.value)
                        }
                        multiline
                        rows={2}
                    />
                </Paper>
            ))}
        </Box>
    );
}
// <Box sx={{ mt: 1 }}>
//     <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="subtitle1">تفاصيل الغرف</Typography>
//         <Button
//             variant="outlined"
//             size="small"
//             startIcon={<AddIcon />}
//             onClick={() => addArrayItem('rooms')}
//         >
//             إضافة غرفة
//         </Button>
//     </Box>

//     {formErrors.rooms && (
//         <Typography color="error" variant="caption" display="block" mb={2}>
//             {formErrors.rooms}
//         </Typography>
//     )}

//     {chaletForm.rooms.map((room, index) => (
//         <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
//             <Grid container spacing={2}>
//                 <Grid item xs={12} sm={5}>
//                     <TextField
//                         fullWidth
//                         label="عنوان الغرفة"
//                         value={room.title}
//                         onChange={(e) => handleArrayItemChange('rooms', index, 'title', e.target.value)}
//                         required={index === 0}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={5}>
//                     <TextField
//                         fullWidth
//                         label="وصف الغرفة"
//                         value={room.text}
//                         onChange={(e) => handleArrayItemChange('rooms', index, 'text', e.target.value)}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={2} display="flex" alignItems="center" justifyContent="center">
//                     <IconButton
//                         color="error"
//                         onClick={() => removeArrayItem('rooms', index)}
//                         disabled={chaletForm.rooms.length <= 1}
//                     >
//                         <DeleteIcon />
//                     </IconButton>
//                 </Grid>
//             </Grid>
//         </Paper>
//     ))}
// </Box>