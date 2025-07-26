class VillageService {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async getVillages() {
    try {
      const response = await this.axiosInstance.get('/village');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'حدث خطأ أثناء جلب القرى'
      };
    }
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