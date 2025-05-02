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
  Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { MyContext } from '../../context/MyContext';
import Loader from '../../components/Loader';
import Swal from 'sweetalert2';

const AdminUsers = () => {
  const { axiosInstance } = useContext(MyContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/admin/users',{headers:{token:localStorage.getItem("token")}});
      setUsers(response.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('فشل في جلب بيانات المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/admin/user/${selectedUserId}`,{headers:{token:localStorage.getItem("token")}});
      setUsers(users.filter(user => user._id !== selectedUserId));
      
      Swal.fire({
        title: 'تم الحذف',
        text: 'تم حذف المستخدم بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً'
      });
    } catch (err) {
      console.error('Error deleting user:', err);
      
      Swal.fire({
        title: 'خطأ',
        text: err.response?.data?.message || 'حدث خطأ أثناء حذف المستخدم',
        icon: 'error',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedUserId(null);
      setLoading(false);
    }
  };

  const columns = [
    { field: 'name', headerName: 'الاسم الكامل', width: 200, flex: 1 },
    { field: 'email', headerName: 'البريد الإلكتروني', width: 250, flex: 1 },
    { field: 'phone', headerName: 'رقم الهاتف', width: 150 },
    { 
      field: 'createdAt', 
      headerName: 'تاريخ التسجيل', 
      width: 150,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString('ar-SA');
      }
    },
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

  if (loading && users.length === 0) {
    return <Loader />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        إدارة المستخدمين
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          
          pageSize={8}
          rowsPerPageOptions={[8, 16, 24]}
          disableSelectionOnClick
          loading={loading}
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
            هل أنت متأكد من رغبتك في حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.
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

export default AdminUsers;