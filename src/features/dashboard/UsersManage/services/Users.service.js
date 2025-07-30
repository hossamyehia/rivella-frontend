class UsersService {
    constructor(axiosInstance) {
        this.axiosInstance = axiosInstance;
    }
    async getUsers() {
        try {
            const response = await this.axiosInstance.get('/admin/users');
            return {
                success: true,
                data: response.data,
                message: 'تم جلب المستخدمين بنجاح'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'حدث خطأ أثناء جلب المستخدمين'
            };
        }
    }

    async deleteUser(userId) {
        try {
            const response = await this.axiosInstance.delete(`/admin/user/${userId}`);
            return {
                success: true,
                message: 'تم حذف المستخدم بنجاح'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'حدث خطأ أثناء حذف المستخدم'
            };
        }
    }
}

export default UsersService;