class CityService {
    constructor(axiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async getCities() {
        try {
            const response = await this.axiosInstance.get('/city');
            return {
                success: true,
                message: 'تم جلب المدن بنجاح',
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'حدث خطأ في جلب المدن'
            };
        }
    }

    async getCityById(cityId) {
        try {
            const response = await this.axiosInstance.get(`/city/${cityId}`);
            return {
                success: true,
                message: 'City fetched successfully',
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'حدث خطأ في جلب المدينة'
            }
        }
    }

    async createCity(cityData) {
        try {
            const response = await this.axiosInstance.post('/city', cityData, { headers: { 'Content-Type': 'multipart/form-data' } });
            return {
                success: true,
                message: 'تم إضافة المدينة بنجاح',
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message ||  'حدث خطأ في إضافة المدينة'
            };
        }
    }

    async updateCity(cityId, cityData) {
        try {
            const response = await this.axiosInstance.put(`/city/${cityId}`, cityData, { headers: { "Content-Type": "multipart/form-data" }});
            return {
                success: true,
                message: 'تم تحديث المدينة بنجاح',
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'حدث خطأ في تحديث المدينة'
            };
        }
    }

    async deleteCity(cityId) {
        try {
            const response = await this.axiosInstance.delete(`/city/${cityId}`);
            return {
                success: true,
                message: 'تم حذف المدينة بنجاح',
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'حدث خطأ في حذف المدينة'
            };
        }
    }
}

export default CityService;