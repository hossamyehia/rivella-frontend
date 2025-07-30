class PublicChaletService {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async getChaletById(id) {
    try {
      const response = await this.axiosInstance.get(`/chalet/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "حدث خطأ أثناء جلب الشالية"
      };
    }
  }

  async getAllChalets(filterQuery) {
    try {
      const response = await this.axiosInstance.get('/chalet', { params: filterQuery });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "حدث خطأ أثناء جلب الشاليهات"
      };
    }
  }

}

export default PublicChaletService;