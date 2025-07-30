import React, { useState, useEffect, useContext } from 'react';
import {
    Paper,
    Typography,
    Box,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Alert,
    Grid,
    TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';
import Loader from '../../../shared/components/Loader';
import { useApiContext } from '../../../shared/context/api.context';
import FeaturesService from './services/Features.service';

const defaultFormValues = {
    name: "",
    description: ""
}

const FeaturesManage = () => {
    const { axiosInstance, isLoading, setIsLoading } = useApiContext();
    const _FeatureService = new FeaturesService(axiosInstance);
    const [features, setFeatures] = useState([]);
    const [featureForm, setFeatureForm] = useState(defaultFormValues)
    const [error, setError] = useState('');
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedFeatureId, setSelectedFeatureId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const response = await _FeatureService.getFeatures();
                if (response.success) {
                    setFeatures(response.data.data);
                    setError('');
                } else {
                    setError(response.message);
                }
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const handleEditClick = (data) => {
        setSelectedFeatureId(data._id);
        setFeatureForm({
            name: data.name,
            description: data.description
        });
        setIsEditing(true);
        setFormErrors({});
        setFormDialogOpen(true);
    };

    const handleAddClick = () => {
        setFeatureForm({ name: '', description: '' });
        setIsEditing(false);
        setFormErrors({});
        setFormDialogOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFeatureForm({ ...featureForm, [name]: value });
        if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
    };

    const validateForm = () => {
        const errors = {};
        if (!featureForm.name.trim()) errors.name = 'اسم الميزة مطلوب';
        if (!featureForm.description.trim()) errors.description = 'وصف الميزة مطلوب';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!isEditing && !validateForm()) return;

        setIsLoading(true);
        try {
            const response = isEditing ? await _FeatureService.updateFeature(selectedFeatureId, featureForm) : await _FeatureService.createFeature(featureForm);
            if (!response.success) {
                Swal.fire({
                    title: 'خطأ',
                    text: response.message || `حدث خطأ أثناء ${isEditing ? 'تحديث' : 'إضافة'} الميزة`,
                    icon: 'error',
                    confirmButtonText: 'حسناً'
                });
                return;
            }
            setFeatures((value) => isEditing ? value.map(f => f._id === selectedFeatureId ? response.data.data : f) : [...value, response.data.data]);
            setFormDialogOpen(false);
            setFeatureForm({ name: '', description: '' });
            Swal.fire({
                title: `تمت العملية بنجاح`,
                text: `تم ${isEditing ? 'تحديث' : 'إضافة'} الميزة بنجاح`,
                icon: 'success',
                confirmButtonText: 'حسناً'
            });
            setSelectedFeatureId(null);
        } finally {
            setIsLoading(false);
        }

    };

    const handleDeleteClick = (featureId) => {
        setSelectedFeatureId(featureId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setIsLoading(true);
        try {
            const response = await _FeatureService.deleteFeature(selectedFeatureId);
            if (!response.success) {
                Swal.fire({
                    title: 'خطأ',
                    text: response.message,
                    icon: 'error',
                    confirmButtonText: 'حسناً'
                });
                return;
            }

            setFeatures(features.filter(user => user._id !== selectedFeatureId));
            Swal.fire({
                title: 'تم الحذف',
                text: 'تم حذف الميزة بنجاح',
                icon: 'success',
                confirmButtonText: 'حسناً'
            });
        } finally {
            setDeleteDialogOpen(false);
            setSelectedFeatureId(null);
            setIsLoading(false);
        }
    };

    const columns = [
        { field: 'name', headerName: 'الاسم', width: 200, flex: 1 },
        { field: 'description', headerName: 'الوصف', width: 250, flex: 1 },
        {
            field: 'actions',
            headerName: 'الإجراءات',
            width: 100,
            renderCell: (params) => (
                <Box>
                    <IconButton color="primary" onClick={() => handleEditClick(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(params.row._id)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    if (isLoading && features.length === 0) {
        return <Loader />;
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">إدارة المرافق "الميزة"</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>إضافة ميزة</Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            {error && (<Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>)}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={features}
                    columns={columns}
                    pageSize={8}
                    rowsPerPageOptions={[8, 16, 24]}
                    disableSelectionOnClick
                    loading={isLoading}
                    getRowId={row => row._id}
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'primary.main',
                            color: 'black',            // header text
                        },
                        '& .MuiDataGrid-cell': {
                            color: 'black',            // body cells
                        },
                        '& .MuiDataGrid-footerContainer': {
                            color: 'black',            // pagination/footer
                        },
                    }}
                />
            </Paper>

            <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? 'تعديل الميزة' : 'تسجيل الميزة'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sx={{ width: "100%" }}>
                            <TextField
                                name="name"
                                label="اسم الميزة"
                                value={featureForm.name}
                                onChange={handleInputChange}
                                fullWidth
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                                sx={{ fontSize: '18px' }}
                                inputProps={{ style: { fontSize: '16px' } }}
                                InputLabelProps={{ style: { fontSize: '16px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ width: "100%" }}>
                            <TextField
                                name="description"
                                label="وصف الميزة (اختياري)"
                                value={featureForm.description}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                rows={3}
                                error={!!formErrors.description}
                                helperText={formErrors.description}
                                inputProps={{ style: { fontSize: '16px' } }}
                                InputLabelProps={{ style: { fontSize: '16px' } }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setFormDialogOpen(false)} color="inherit" sx={{ fontSize: '16px' }}>إلغاء</Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                        sx={{ fontSize: '16px', px: 4, py: 1 }}
                    >
                        {isEditing ? 'تحديث' : 'تسجيل'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>تأكيد الحذف</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        هل أنت متأكد من رغبتك في حذف هذا الميزة؟ لا يمكن التراجع عن هذا الإجراء.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        إلغاء
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        حذف
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FeaturesManage;