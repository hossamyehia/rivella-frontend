import PublicVillageService from '../../../../shared/services/PublicVillage.service';
class VillageService extends PublicVillageService {
  constructor(axiosInstance) {
    super(axiosInstance);
    this.axiosInstance = axiosInstance;
  }

  async addVillage(villageData) {
    try {
      const response = await this.axiosInstance.post('/village', villageData, { headers: { "Content-Type": "multipart/form-data" }});
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'حدث خطأ أثناء إضافة القرية'
      };
    }
  }

  async updateVillage(id, villageData) {
    try {
      const response = await this.axiosInstance.put(`/village/${id}`, villageData, { headers: { "Content-Type": "multipart/form-data" }});
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'حدث خطأ أثناء تحديث القرية'
      };
    }
  }

  async deleteVillage(id) {
    try {
      const response = await this.axiosInstance.delete(`/village/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || 'حدث خطأ أثناء حذف القرية'
      };
    }
  }
}

export default VillageService;