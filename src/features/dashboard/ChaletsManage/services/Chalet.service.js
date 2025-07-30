import PublicChaletService from "../../../../shared/services/PublicChalet.service";

class ChaletService extends PublicChaletService {
  constructor(axiosInstance) {
    super(axiosInstance);
    this.axiosInstance = axiosInstance;
  }

  async createChalet(chaletData) {
    try {
      const response = await this.axiosInstance.post('/chalet', chaletData, { headers : {'Content-Type': 'multipart/form-data'}});
      return {
        success: true,
        data: response.data,
        message: "تم إضافة الشالية بنجاح"
      };
    } catch (error) {
      if (error.response?.data?.message?.includes("E11000")) error['response']['data']['message'] = "هذا الكود مستخدم بالفعل";
      return {
        success: false,
        message: error.response?.data?.message || "حدث خطأ أثناء إضافة الشالية"
      };
    }
  }

  async updateChalet(id, chaletData) {
    try {
      const response = await this.axiosInstance.put(`/chalet/${id}`, chaletData, { headers : {'Content-Type': 'multipart/form-data'}});
      return {
        success: true,
        data: response.data,
        message: "تم تعديل الشالية بنجاح"
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "حدث خطأ أثناء تعديل الشالية"
      };
    }
  }

  async deleteChalet(id) {
    try {
      const response = await this.axiosInstance.delete(`/chalet/${id}`);
      return {
        success: true,
        data: response.data,
        message: "تم حذف الشالية بنجاح"
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "حدث خطأ أثناء حذف الشالية"
      };
    }
  }
}

export default ChaletService;