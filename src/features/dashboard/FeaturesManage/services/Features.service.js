class FeaturesService {
    constructor(axiosInstance) {
        this.axios = axiosInstance;
    }
    async getFeatures() {
        try {
            const response = await this.axios.get('/feature');
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
    async getFeatureById(id) {
        try {
            const response = await this.axios.get(`/feature/${id}`);
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
    async createFeature(featureData) {
        try {
            const response = await this.axios.post('/feature', featureData);
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
    async updateFeature(id, featureData) {
        try {
            const response = await this.axios.put(`/feature/${id}`, featureData);
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
    async deleteFeature(id) {
        try {
            const response = await this.axios.delete(`/feature/${id}`);
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

export default FeaturesService;