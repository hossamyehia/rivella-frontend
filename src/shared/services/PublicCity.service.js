class PublicCityService {
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
}

export default PublicCityService;