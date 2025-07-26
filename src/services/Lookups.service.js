class LookupsService {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async getHomeChalets(){
    try {
      const response = await this.axiosInstance.get('/chalet/home');
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'خطأ في جلب الشاليهات'
      }
    }
  }

  async getCities() {
    try {
      const response = await this.axiosInstance.get('/city');
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'خطأ في جلب المدن'
      }
    }
  }

  async getVillages() {
    try {
      const response = await this.axiosInstance.get(`/village`);
        return {
            success: true,
            data: response.data
        }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'خطأ في جلب القرى'
      }
    }
  }

  async getBedTypes() {
    try {
      const response = await this.axiosInstance.get('/lookups/bedtypes');
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'خطأ في جلب انواع السراير'
      }
    }
  }

  async getStats(){
    try {
      const response = await this.axiosInstance.get('/lookups/stats');
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'خطأ في جلب انواع السراير'
      }
    }
  }

  async getFeatures() {
    try {
      const response = await this.axiosInstance.get('/feature');
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'خطأ في جلب المميزات'
      }
    }
  }

  async getTerms() {
    try {
      const response = await this.axiosInstance.get('/term');
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'خطأ في جلب الشروط والأحكام'
      }
    }
  }
}

export default LookupsService;