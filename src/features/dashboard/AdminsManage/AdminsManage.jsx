import React, { useState, useEffect } from 'react';
import {
  TextField,
  Grid,
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
  Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from '../../../shared/components/Loader';
import Swal from 'sweetalert2';
import { useApiContext } from '../../../shared/context/api.context';
import AdminsService from './services/Admin.service';

const AdminsManage = () => {
  const { axiosInstance, isLoading, setIsLoading } = useApiContext();
  const _AdminsService = new AdminsService(axiosInstance);
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await _AdminsService.getAdmins();
        if (!response.success) {
          setError(response.message);
          return;
        }
        setAdmins(response.data.data);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleDeleteClick = (adminId) => {
    setSelectedAdminId(adminId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await _AdminsService.deleteAdmin(selectedAdminId);
      if (!response.success) {
        Swal.fire({
          title: 'خطأ',
          text: response.message || 'حدث خطأ أثناء حذف المشرف',
          icon: 'error',
          confirmButtonText: 'حسناً'
        });
        return;
      }

      setAdmins(admins.filter(admin => admin._id !== selectedAdminId));
      Swal.fire({
        title: 'تم الحذف',
        text: 'تم حذف المشرف بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedAdminId(null);
      setIsLoading(false);
    }
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({
      ...newAdmin,
      [name]: value
    });

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!newAdmin.fullName.trim()) {
      errors.fullName = 'الاسم الكامل مطلوب';
    }

    if (!newAdmin.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(newAdmin.email)) {
      errors.email = 'البريد الإلكتروني غير صالح';
    }

    if (!newAdmin.password) {
      errors.password = 'كلمة المرور مطلوبة';
    } else if (newAdmin.password.length < 6) {
      errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    if (newAdmin.password !== newAdmin.confirmPassword) {
      errors.confirmPassword = 'كلمات المرور غير متطابقة';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAdmin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await _AdminsService.addAdmin({
        name: newAdmin.fullName,
        email: newAdmin.email,
        password: newAdmin.password
      });

      if (!response.success) {
        Swal.fire({
          title: 'خطأ',
          text: response.message || 'حدث خطأ أثناء إضافة المشرف',
          icon: 'error',
          confirmButtonText: 'حسناً'
        });
        return;
      }
      setAdmins([...admins, response.data.data]);
      setAddDialogOpen(false);
      setNewAdmin({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      Swal.fire({
        title: 'تمت الإضافة',
        text: 'تم إضافة المشرف بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'الرقم', width: 70 },
    { field: 'name', headerName: 'الاسم الكامل', width: 200, flex: 1 },
    { field: 'email', headerName: 'البريد الإلكتروني', width: 250, flex: 1 },
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

  if (isLoading && admins.length === 0) {
    return <Loader />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          إدارة المشرفين
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddDialogOpen}
        >
          إضافة مشرف
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={admins}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد من رغبتك في حذف هذا المشرف؟ لا يمكن التراجع عن هذا الإجراء.
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

      {/* Add Admin Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>إضافة مشرف جديد</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="fullName"
                label="الاسم الكامل"
                value={newAdmin.fullName}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.fullName}
                helperText={formErrors.fullName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="البريد الإلكتروني"
                type="email"
                value={newAdmin.email}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="كلمة المرور"
                type="password"
                value={newAdmin.password}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                label="تأكيد كلمة المرور"
                type="password"
                value={newAdmin.confirmPassword}
                onChange={handleInputChange}
                fullWidth
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} color="inherit">
            إلغاء
          </Button>
          <Button onClick={handleAddAdmin} color="primary" variant="contained">
            إضافة
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminsManage;