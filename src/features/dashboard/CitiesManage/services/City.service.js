import PublicCityService from "../../../../shared/services/PublicCity.service";

class CityService extends PublicCityService {
    constructor(axiosInstance) {
        super(axiosInstance);
        this.axiosInstance = axiosInstance;
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