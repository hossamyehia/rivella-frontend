import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import Loader from '../../../components/Loader';
import Swal from 'sweetalert2';
// Material‑UI components
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DialogContentText from '@mui/material/DialogContentText';
import { AddEditChalet } from '../../../components/features/AddEditChalet/AddEditChalet';

// Material‑UI icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useApiContext } from '../../../context/ApiContext';
import { useServicesContext } from '../../../context/ServicesContext';
import ChaletService from '../../../services/Chalet.service';


const AdminChalets = () => {
  const { axiosInstance, isLoading, setIsLoading } = useApiContext();
  const { services } = useServicesContext();
  const _ChaletService = new ChaletService(axiosInstance);
  const [chalets, setChalets] = useState([]);
  const [error, setError] = useState('');
  // const [villages, setFilteredVillages] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    code: '',
    city: '',
    village: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedChalet, setSelectedChalet] = useState(null);
  const [selectedChaletId, setSelectedChaletId] = useState(null);

  const [cities, setCities] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    (async () => {
      const [citiesResponse, villagesResponse] = await Promise.all([
        services["LookupsService"]["getCities"](),
        services["LookupsService"]["getVillages"]()
      ])
      // console.log(villagesResponse.data.data)
      setCities(citiesResponse.data.data);
      setVillages(villagesResponse.data.data);
    })();
  }, []);

  // Form state
  useEffect(() => {
    // Fetch Chalets
    fetchChalets();
  }, [page, limit]);

  const fetchChalets = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit
      });
      queryParams.append('admin', 'true')

      // Add filters to query if they exist
      if (filters.code) queryParams.append('code', filters.code);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.village) queryParams.append('village', filters.village);

      const response = await _ChaletService.getAllChalets(queryParams);

      if (!response.success) {
        setError(response.message);
        return;
      }
      
      const transformed = response.data.data.map(chalet => ({
        ...chalet,
        cityName: chalet.city?.name || '—',
        villageName: chalet.village?.name || '—',
      }));
      

      setChalets(transformed);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
      setError('');
    } finally {
      setIsLoading(false);
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset village if city changes
    if (name === 'city') {
      setFilters(prev => ({
        ...prev,
        village: ''
      }));
    }
  };

  const applyFilters = () => {
    setPage(1); // Reset to first page when filtering
    fetchChalets();
  };

  const resetFilters = () => {
    setFilters({
      code: '',
      city: '',
      village: '',
    });
    setPage(1);
    fetchChalets();
  };

  const handleViewClick = (chalet) => {
    setSelectedChalet(chalet);
    setViewDialogOpen(true);
  };

  const handleEditClick = (chalet) => {
    setSelectedChalet(chalet);
    setSelectedChaletId(chalet._id);

    // setCurrentTab(0);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (chaletId) => {
    setSelectedChaletId(chaletId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/chalet/${selectedChaletId}`, {
        headers: { token: localStorage.getItem("token") }
      });

      setChalets(chalets.filter(chalet => chalet._id !== selectedChaletId));

      Swal.fire({
        title: 'تم الحذف',
        text: 'تم حذف الشاليه بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً'
      });
    } catch (err) {
      console.error('Error deleting chalet:', err);

      Swal.fire({
        title: 'خطأ',
        text: err.response?.data?.message || 'حدث خطأ أثناء حذف الشاليه',
        icon: 'error',
        confirmButtonText: 'حسناً'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedChaletId(null);
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedChalet(null);
    setSelectedChaletId(null);
    // setCurrentTab(0);
    setAddDialogOpen(true);
    // fetchAllVillages();
  };



  const columns = [
    { field: 'code', headerName: 'كود الشاليه', width: 80 },
    { field: 'name', headerName: 'اسم الشاليه', width: 200 },
    { field: 'cityName', headerName: 'المدينة', width: 150 },
    { field: 'villageName', headerName: 'القرية', width: 150 },
    { field: 'type', headerName: 'النوع', width: 100 },
    { field: 'price', headerName: 'السعر (لليلة)', width: 120 },
    { field: 'bedrooms', headerName: 'الغرف', width: 80 },
    { field: 'guests', headerName: 'الضيوف', width: 80 },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 160,
      renderCell: params => (
        <Box>
          <IconButton
            size="small"
            color="info"
            onClick={() => handleViewClick(params.row)}
            aria-label="عرض"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEditClick(params.row)}
            aria-label="تعديل"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteClick(params.row._id)}
            aria-label="حذف"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (isLoading && chalets.length === 0) {
    return <Loader />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          إدارة الشاليهات
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          إضافة شاليه جديد
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* Filters */}
      <Box mb={3}>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          sx={{ mb: 2 }}
        >
          {showFilters ? 'إخفاء الفلاتر' : 'عرض الفلاتر'}
        </Button>

        {showFilters && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="الكود"
                  name="code"
                  sx={{mb:0}}
                  value={filters.code}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="city-filter-label">المدينة</InputLabel>
                  <Select
                    labelId="city-filter-label"
                    id="city-filter"
                    name="city"
                    value={filters.city}
                    label="المدينة"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">الكل</MenuItem>
                    {cities.map(city => (
                      <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="village-filter-label">القرية</InputLabel>
                  <Select
                    labelId="village-filter-label"
                    id="village-filter"
                    name="village"
                    value={filters.village}
                    label="القرية"
                    onChange={handleFilterChange}
                    disabled={!filters.city}
                  >
                    <MenuItem value="">الكل</MenuItem>
                    {villages.map(village => (
                      <MenuItem key={village._id} value={village._id}>{village.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} container justifyContent="flex-end" spacing={1}>
                <Grid item>
                  <Button variant="outlined" onClick={resetFilters}>إعادة ضبط</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={applyFilters}>تطبيق الفلاتر</Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={chalets}
          columns={columns}
          getRowId={row => row._id}
          pageSize={limit}
          rowCount={total}
          paginationMode="server"
          onPageChange={(newPage) => setPage(newPage + 1)}
          page={page - 1}
          rowsPerPageOptions={[15, 25, 50]}
          onPageSizeChange={(newPageSize) => setLimit(newPageSize)}
          disableSelectionOnClick
          disableVirtualization
          loading={isLoading}
          sx={{
            '& .MuiDataGrid-columnHeaders': { backgroundColor: 'primary.main', color: 'black' },
            '& .MuiDataGrid-cell': { color: 'black' },
            '& .MuiDataGrid-footerContainer': { color: 'black' },
          }}
        />
      </Paper>


      {/* View Chalet Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">تفاصيل الشاليه</Typography>
        </DialogTitle>
        <DialogContent>
          {selectedChalet && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>{selectedChalet.name}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {selectedChalet.type} | كود: {selectedChalet.code}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">المدينة</Typography>
                  <Typography variant="body1" gutterBottom>
                    {cities.find(c => c._id === selectedChalet.city)?.name || 'غير محدد'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">القرية</Typography>
                  <Typography variant="body1" gutterBottom>
                    {villages.find(v => v._id === selectedChalet.village)?.name || 'غير محدد'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">الموقع</Typography>
                  <Typography variant="body1" gutterBottom>{selectedChalet.location}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">السعر لليلة</Typography>
                  <Typography variant="body1" gutterBottom>{selectedChalet.price} جنيه</Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">عدد الغرف</Typography>
                  <Typography variant="body1" gutterBottom>{selectedChalet.bedrooms}</Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">عدد الحمامات</Typography>
                  <Typography variant="body1" gutterBottom>{selectedChalet.bathrooms}</Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">عدد الضيوف</Typography>
                  <Typography variant="body1" gutterBottom>{selectedChalet.guests}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>وصف الشاليه</Typography>
                  <Typography variant="body1" paragraph>{selectedChalet.description}</Typography>
                </Grid>

                {selectedChalet.mainImg && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>الصورة الرئيسية</Typography>
                    <img
                      src={selectedChalet.mainImg}
                      alt={selectedChalet.name}
                      style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                    />
                  </Grid>
                )}

                {selectedChalet.imgs && selectedChalet.imgs.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>الصور الإضافية</Typography>
                    <Grid container spacing={1}>
                      {selectedChalet.imgs.map((img, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <img
                            src={img}
                            alt={`صورة ${index + 1}`}
                            style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}

                {selectedChalet.video && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>الفيديو</Typography>
                    <video
                      controls
                      width="100%"
                      style={{ maxHeight: '400px' }}
                    >
                      <source src={selectedChalet.video} type="video/mp4" />
                      متصفحك لا يدعم تشغيل الفيديو.
                    </video>
                  </Grid>
                )}

                {selectedChalet.badroomsDetails && selectedChalet.badroomsDetails.length > 0 && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>تفاصيل الغرف</Typography>
                    <Grid container spacing={2}>
                      {selectedChalet.badroomsDetails.map((room, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="subtitle1">{room.title}</Typography>
                            <Typography variant="body2">{room.text}</Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}

                {selectedChalet.features && selectedChalet.features.length > 0 && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>المميزات</Typography>
                    <Grid container spacing={2}>
                      {selectedChalet.features.map((feature, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Paper elevation={1} sx={{ p: 2 }}>
                            <Typography variant="subtitle1">{feature.name}</Typography>
                            <Typography variant="body2">{feature.description}</Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}

                {selectedChalet.terms && selectedChalet.terms.length > 0 && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>الشروط</Typography>
                    <List>
                      {selectedChalet.terms.map((term, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            {term.allowed ?
                              <CheckCircleIcon color="success" /> :
                              <CancelIcon color="error" />
                            }
                          </ListItemIcon>
                          <ListItemText primary={term.term} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>إغلاق</Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setViewDialogOpen(false);
              handleEditClick(selectedChalet);
            }}
          >
            تعديل الشاليه
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          تأكيد الحذف
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد من رغبتك في حذف "{selectedChalet?.name}"؟ لا يمكن التراجع عن هذا الإجراء.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'جاري الحذف...' : 'حذف'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {/* <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          تأكيد الحذف
        </DialogTitle>
        <DialogContent>
          <Typography>
            هل أنت متأكد من رغبتك في حذف هذا الشاليه؟ هذا الإجراء لا يمكن التراجع عنه.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'جاري الحذف...' : 'تأكيد الحذف'}
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Edit Chalet Dialog */}
      <AddEditChalet
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        title="تعديل الشاليه"
        cities={cities}
        villages={villages}
        setChalets={setChalets}
        _ChaletService={_ChaletService}
        _LookUpsService={services["LookupsService"]}
        selectedChalet={selectedChalet}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isEditMode={true}
      />

      {/* Add Chalet Dialog */}
      <AddEditChalet
        isOpen={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        title="إضافة شاليه جديد"
        cities={cities}
        villages={villages}
        setChalets={setChalets}
        _ChaletService={_ChaletService}
        _LookUpsService={services["LookupsService"]}
        // selectedChalet={selectedChalet}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        // isEditMode={false}
      />

    </Box>
  );
};

export default AdminChalets;
