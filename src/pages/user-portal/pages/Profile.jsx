import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Alert, 
  CircularProgress, 
  Box
} from '@mui/material';
import { MyContext } from '../../../context/MyContext';
import { useApiContext } from '../../../context/ApiContext';

export default function ProfilePage() {
  const { axiosInstance } = useApiContext();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({ name: '', phone: '' });
  const [message, setMessage] = useState({ text: '', type: 'success' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/user/profile', {
          headers: { token: localStorage.getItem('token') }
        });
        setUserData(res.data.data);
      } catch (err) {
        setMessage({ text: 'خطأ في جلب بيانات الملف الشخصي', type: 'error' });
      }
    };
    fetchProfile();
  }, [axiosInstance]);

  const handleEdit = () => {
    setTempData({ name: userData.name, phone: userData.phone });
    setIsEditing(true);
    setMessage({ text: '', type: 'success' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage({ text: '', type: 'success' });
  };

  const handleSave = async () => {
    if (!tempData.name.trim()) {
      setMessage({ text: 'الاسم مطلوب', type: 'error' });
      return;
    }
    if (!tempData.phone.trim()) {
      setMessage({ text: 'رقم الهاتف مطلوب', type: 'error' });
      return;
    }

    try {
      const res = await axiosInstance.put(
        '/user/profile',
        { name: tempData.name, phone: tempData.phone },
        { headers: { token: localStorage.getItem('token') } }
      );
      setUserData(res.data.data);
      setIsEditing(false);
      setMessage({ text: 'تم حفظ التغييرات بنجاح', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'حدث خطأ أثناء الحفظ', type: 'error' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({ ...prev, [name]: value }));
  };

  if (!userData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" component="div" align="center" gutterBottom>
            الملف الشخصي
          </Typography>

          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          <Stack spacing={3}>
            <TextField
              label="الاسم"
              name="name"
              value={isEditing ? tempData.name : userData.name}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              fullWidth
            />

            <TextField
              label="البريد الإلكتروني"
              value={userData.email}
              InputProps={{ readOnly: true }}
              fullWidth
            />

            <TextField
              label="رقم الهاتف"
              name="phone"
              value={isEditing ? tempData.phone : userData.phone}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              fullWidth
            />

            <Stack direction="row" spacing={2} justifyContent="center">
              {isEditing ? (
                <>
                  <Button variant="contained" onClick={handleSave}>
                    حفظ
                  </Button>
                  <Button variant="outlined" onClick={handleCancel}>
                    إلغاء
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={handleEdit}>
                  تعديل المعلومات
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
