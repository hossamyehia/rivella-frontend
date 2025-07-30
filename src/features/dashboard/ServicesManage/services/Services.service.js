class ServicesService {
    constructor(axiosInstance) {
        this.axios = axiosInstance;
    }
    async getServices() {
        try {
            const response = await this.axios.get('/service');
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data.message || 'حدث خطأ أثناء جلب الميزات',
            };
        }
    }
    async getServiceById(id) {
        try {
            const response = await this.axios.get(`/service/${id}`);
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data.message || 'حدث خطأ أثناء جلب الميزة',
            };
        }
    }
    async createService(serviceData) {
        try {
            const response = await this.axios.post('/service', serviceData);
            return {
                success: true,
                data: response.data,
                message: "تم إضافة الميزة بنجاح"
            };
        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: error.response?.data?.message || 'حدث خطأ أثناء إنشاء الميزة',
            };
        }
    }
    async updateService(id, serviceData) {
        try {
            const response = await this.axios.put(`/service/${id}`, serviceData);
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data.message || 'حدث خطأ أثناء تحديث الميزة',
            };
        }
    }
    async deleteService(id) {
        try {
            const response = await this.axios.delete(`/service/${id}`);
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data.message || 'حدث خطأ أثناء حذف الميزة',
            };
        }
    }
}

export default ServicesService;