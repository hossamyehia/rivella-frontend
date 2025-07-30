class AdminsService {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async getAdmins() {
    try {
      const response = await this.axiosInstance.get('/admin/admins');
      return {
        success: true,
        message: 'تم جلب بيانات المشرفين بنجاح',
        data: response.data
    }
    } catch (error) {
      return {
        success: false,
        message: error.response ? error.response.data.message : 'حدث خطأ أثناء جلب بيانات المشرفين'
      };
    }
  }

  async addAdmin(adminData) {
    try {
      const response = await this.axiosInstance.post('/admin/add', adminData);
      return {
        success: true,
        message: 'تم إضافة المشرف بنجاح',
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response ? error.response.data.message : 'حدث خطأ أثناء إضافة المشرف'
      };
    }
  }

  async deleteAdmin(adminId) {
    try {
      const response = await this.axiosInstance.delete(`/admin/admin/${adminId}`);
      return {
        success: true,
        message: 'تم حذف المشرف بنجاح',
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response ? error.response.data.message : 'حدث خطأ أثناء إضافة المشرف'
      };
    }
  }
}

export default AdminsService;