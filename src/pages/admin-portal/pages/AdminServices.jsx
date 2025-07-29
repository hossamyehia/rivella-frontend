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
import Loader from '../../../components/Loader';
import Swal from 'sweetalert2';
import { useApiContext } from '../../../context/ApiContext';
import ServicesService from '../../../services/Services.service';

const defaultFormValues = {
    name: "",
    description: ""
}

const AdminServices = () => {
    const { axiosInstance, isLoading, setIsLoading } = useApiContext();
    const _ServiceService = new ServicesService(axiosInstance);
    const [services, setServices] = useState([]);
    const [serviceForm, setServiceForm] = useState(defaultFormValues)
    const [error, setError] = useState('');
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const response = await _ServiceService.getServices();
                if (response.success) {
                    setServices(response.data.data);
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
        setSelectedServiceId(data._id);
        setServiceForm({
            name: data.name,
            description: data.description
        });
        setIsEditing(true);
        setFormErrors({});
        setFormDialogOpen(true);
    };

    const handleAddClick = () => {
        setServiceForm({ name: '', description: '' });
        setIsEditing(false);
        setFormErrors({});
        setFormDialogOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setServiceForm({ ...serviceForm, [name]: value });
        if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
    };

    const validateForm = () => {
        const errors = {};
        if (!serviceForm.name.trim()) errors.name = 'اسم الخدمة مطلوب';
        if (!serviceForm.description.trim()) errors.description = 'وصف الخدمة مطلوب';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!isEditing && !validateForm()) return;

        setIsLoading(true);
        try {
            const response = isEditing ? await _ServiceService.updateService(selectedServiceId, serviceForm) : await _ServiceService.createService(serviceForm);
            if (!response.success) {
                Swal.fire({
                    title: 'خطأ',
                    text: response.message || `حدث خطأ أثناء ${isEditing ? 'تحديث' : 'إضافة'} الخدمة`,
                    icon: 'error',
                    confirmButtonText: 'حسناً'
                });
                return;
            }
            setServices((value) =>  isEditing ? value.map(f => f._id === selectedServiceId ? response.data.data : f) : [...value, response.data.data]);
            setFormDialogOpen(false);
            setServiceForm({ name: '', description: '' });
            Swal.fire({
                title: 'تمت العملية بنجاح',
                text: `تم ${isEditing ? 'تحديث' : 'إضافة'} الخدمة بنجاح`,
                icon: 'success',
                confirmButtonText: 'حسناً'
            });
            setSelectedServiceId(null);
        } finally {
            setIsLoading(false);
        }

    };

    const handleDeleteClick = (serviceId) => {
        setSelectedServiceId(serviceId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setIsLoading(true);
        try {
            const response = await _ServiceService.deleteService(selectedServiceId);
            if (!response.success) {
                Swal.fire({
                    title: 'خطأ',
                    text: response.message,
                    icon: 'error',
                    confirmButtonText: 'حسناً'
                });
                return;
            }

            setServices(services.filter(user => user._id !== selectedServiceId));
            Swal.fire({
                title: 'تم الحذف',
                text: 'تم حذف الخدمة بنجاح',
                icon: 'success',
                confirmButtonText: 'حسناً'
            });
        } finally {
            setDeleteDialogOpen(false);
            setSelectedServiceId(null);
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

    if (isLoading && services.length === 0) {
        return <Loader />;
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">إدارة الخدمات </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>إضافة خدمة</Button>
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
                    rows={services}
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
                <DialogTitle>{isEditing ? 'تحديث الخدمة' : 'إضافة خدمة'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sx={{ width: "100%" }}>
                            <TextField
                                name="name"
                                label="اسم الخدمة"
                                value={serviceForm.name}
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
                                label="وصف الخدمة (اختياري)"
                                value={serviceForm.description}
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
                        {isEditing ? 'تحديث' : 'اضافة'}
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
                        هل أنت متأكد من رغبتك في حذف هذا الخدمة؟ لا يمكن التراجع عن هذا الإجراء.
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

export default AdminServices;