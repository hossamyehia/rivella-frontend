export default class TermsService{
    constructor(axiosInstance){
        this.axiosInstance = axiosInstance;
    }

    async getTerms() {
        try {
            const response = await this.axiosInstance.get('/term');
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data.message || 'حدث خطأ أثناء جلب القواعد',
            };
        }
    }
    async getTermById(id) {
        try {
            const response = await this.axiosInstance.get(`/term/${id}`);
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data.message || 'حدث خطأ أثناء جلب القاعدة',
            };
        }
    }
    async createTerm(termData) {
        try {
            const response = await this.axiosInstance.post('/term', termData);
            return {
                success: true,
                data: response.data,
                message: "تم إضافة القاعدة بنجاح"
            };
        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: error.response?.data?.message || 'حدث خطأ أثناء إنشاء القاعدة',
            };
        }
    }
    async updateTerm(id, termData) {
        try {
            const response = await this.axiosInstance.put(`/term/${id}`, termData);
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data.message || 'حدث خطأ أثناء تحديث القاعدة',
            };
        }
    }
    async deleteTerm(id) {
        try {
            const response = await this.axiosInstance.delete(`/term/${id}`);
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data.message || 'حدث خطأ أثناء حذف القاعدة',
            };
        }
    }
}