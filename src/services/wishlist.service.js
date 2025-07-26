class WishListService {
    constructor(axiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async addToWishlist(chaletId) {
        try {
            // Assuming the token is stored in localStorage, { headers: { token: localStorage.getItem('token') } }
            const response = await this.axiosInstance.post(`/wishlist/${chaletId}`, {});
            return {
                success: true,
                message: 'تم إضافة الشالية إلى المفضلة بنجاح',
                data: response.data
            };
        } catch (error) {
            let message = 'حدث خطأ أثناء إضافة الشالية إلى المفضلة، يرجى المحاولة مرة أخرى';

            if (error.response && error.response.status === 409) {
                message = 'الشالية موجود بالفعل في المفضلة';
            } else if (error.response && error.response.data.message === "invaild token") {
                message = 'يجب عليك تسجيل الدخول اولا';
            }

            return {
                success: false,
                message: error.response?.data?.message || message,
                isWarning: error.response?.status === 409
            };
        }
    }

    async getWishlist() {
        try {
            // Assuming the token is stored in localStorage, { headers: { token: localStorage.getItem('token') } }
            const response = await this.axiosInstance.get('/wishlist');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'حدث خطأ أثناء جلب المفضلة، يرجى المحاولة مرة أخرى'
            };
        }
    }

    async removeFromWishlist(chaletId) {
        try {
            const response = await this.axiosInstance.delete(`/wishlist/${chaletId}`);
            return {
                success: true,
                message: 'تم إزالة الشالية من المفضلة بنجاح',
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'حدث خطأ أثناء إزالة الشالية من المفضلة، يرجى المحاولة مرة أخرى'
            };
        }
    }

    async clearWishlist() {
        try {
            const response = await this.axiosInstance.delete('/wishlist');
            return {
                success: true,
                message: 'تم مسح جميع العناصر من المفضلة بنجاح',
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'حدث خطأ أثناء مسح المفضلة، يرجى المحاولة مرة أخرى'
            };
        }
    }
}

export default WishListService;