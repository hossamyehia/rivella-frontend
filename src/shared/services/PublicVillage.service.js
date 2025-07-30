class PublicVillageService {
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

  async getVillageById(id){
    try {
      const response = await this.axiosInstance.get(`/village/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'حدث خطأ أثناء جلب القرية'
      };
    }
  }

}

export default PublicVillageService;