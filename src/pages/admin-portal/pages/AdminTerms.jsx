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
    TextField,
    FormControlLabel,
    Switch
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Loader from '../../../components/Loader';
import Swal from 'sweetalert2';
import { useApiContext } from '../../../context/ApiContext';
import TermsService from '../../../services/Terms.service';

const defaultFormValues = {
    term: "",
    allowed: false
}

const AdminTerms = () => {
    const { axiosInstance, isLoading, setIsLoading } = useApiContext();
    const _TermService = new TermsService(axiosInstance);
    const [terms, setTerms] = useState([]);
    const [termForm, setTermForm] = useState(defaultFormValues)
    const [error, setError] = useState('');
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedTermId, setSelectedTermId] = useState(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const response = await _TermService.getTerms();
                if (response.success) {
                    setTerms(response.data.data);
                    setError('');
                } else {
                    setError(response.message);
                }
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const handleAddClick = () => {
        setTermForm({ term: '', allowed: '' });
        setFormErrors({});
        setFormDialogOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;
        setTermForm({ ...termForm, [name]: value === "on" ? checked : value });
        if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
    };

    const validateForm = () => {
        const errors = {};
        if (!termForm.term.trim()) errors.term = 'عنوان القاعدة مطلوب';
        // if (!termForm.allowed.trim()) errors.allowed = ' مطلوب';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await _TermService.createTerm(termForm);
            if (!response.success) {
                Swal.fire({
                    title: 'خطأ',
                    text: response.message || 'حدث خطأ أثناء إضافة قاعدة',
                    icon: 'error',
                    confirmButtonText: 'حسناً'
                });
                return;
            }
            setTerms((value) => [...value, response.data.data]);
            setFormDialogOpen(false);
            setTermForm({ term: '', allowed: '' });
            Swal.fire({
                title: 'تمت الإضافة',
                text: 'تم إضافة القاعدة بنجاح',
                icon: 'success',
                confirmButtonText: 'حسناً'
            });
        } finally {
            setIsLoading(false);
        }

    };

    const handleDeleteClick = (userId) => {
        setSelectedTermId(userId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setIsLoading(true);
        try {
            const response = await _TermService.deleteTerm(selectedTermId);
            if (!response.success) {
                Swal.fire({
                    title: 'خطأ',
                    text: response.message,
                    icon: 'error',
                    confirmButtonText: 'حسناً'
                });
                return;
            }

            setTerms(terms.filter(user => user._id !== selectedTermId));
            Swal.fire({
                title: 'تم الحذف',
                text: 'تم حذف القاعدة بنجاح',
                icon: 'success',
                confirmButtonText: 'حسناً'
            });
        } finally {
            setDeleteDialogOpen(false);
            setSelectedTermId(null);
            setIsLoading(false);
        }
    };

    const columns = [
        { field: 'term', headerName: 'الاسم', width: 200, flex: 1 },
        { field: 'allowed', headerName: 'الصلاحية', width: 250, flex: 1, valueGetter: (params) => (params ? 'مسموح' : 'غير مسموح') },
        {
            field: 'actions',
            headerName: 'الإجراءات',
            width: 100,
            renderCell: (params) => (
                <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(params.row._id)}
                    aria-label="حذف"
                >
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    if (isLoading && terms.length === 0) {
        return <Loader />;
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">إدارة القواعد</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>إضافة قاعدة</Button>
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
                    rows={terms}
                    columns={columns}
                    pageSize={8}
                    rowsPerPageOptions={[8, 16, 24]}
                    disableSelectionOnClick
                    isLoading={isLoading}
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
                <DialogTitle>إضافة قاعدة جديدة</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sx={{ width: "100%" }}>
                            <TextField
                                name="term"
                                label="اسم القاعدة"
                                value={termForm.term}
                                onChange={handleInputChange}
                                fullWidth
                                error={!!formErrors.term}
                                helperText={formErrors.term}
                                sx={{ fontSize: '18px' }}
                                inputProps={{ style: { fontSize: '16px' } }}
                                InputLabelProps={{ style: { fontSize: '16px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ width: "100%" }}>
                            {/* <TextField
                                name="allowed"
                                label="وصف الميزة (اختياري)"
                                value={termForm.allowed}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                rows={3}
                                error={!!formErrors.allowed}
                                helperText={formErrors.allowed}
                                inputProps={{ style: { fontSize: '16px' } }}
                                InputLabelProps={{ style: { fontSize: '16px' } }}
                            /> */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={termForm.allowed}
                                        onChange={handleInputChange}
                                        name={`allowed`}
                                    />
                                }
                                label={termForm.allowed ? "مسموح" : "غير مسموح"}
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
                        إضافة
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

export default AdminTerms;