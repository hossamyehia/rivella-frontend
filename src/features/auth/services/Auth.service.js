class AuthService {
    constructor(axiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async login(email, password) {
        try {
            const response = await this.axiosInstance.post('/user/login', { email, password });
            const { token } = response.data;

            localStorage.setItem('token', token);

            return {
                success: true,
                message: 'تم تسجيل الدخول بنجاح',
                data: response.data
            }
        } catch (error) {
            let message = 'خطأ في تسجيل الدخول، يرجى المحاولة مرة أخرى';
            if (error.response.data.message == "Invalid email or password") message = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
            else if (error.response.data.message == "Please verify your email first") message = 'يجب عليك تفعيل حسابك الالكتروني الاول';

            return {
                success: false,
                message: error.response?.data?.message || 'خطأ في تسجيل الدخول، يرجى المحاولة مرة أخرى',
                data: null
            };
        }
    }

    async loginAsAdmin(email, password) {
        try {
            const response = await this.axiosInstance.post('/admin/login-admin', { email, password });
            const { token } = response.data;

            localStorage.setItem('token', token);

            return {
                success: true,
                message: 'تم تسجيل الدخول كمدير بنجاح',
                data: response.data
            };
        } catch (error) {
            let message = 'خطأ في تسجيل الدخول، يرجى المحاولة مرة أخرى';
            if (error.response.data.message == "Invalid email or password") message = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
            else if (error.response.data.message == "Please verify your email first") message = 'يجب عليك تفعيل حسابك الالكتروني الاول';

            return {
                success: false,
                message: error.response?.data?.message || 'خطأ في تسجيل الدخول، يرجى المحاولة مرة أخرى',
                data: null
            };
        }
    }

    async register(userData) {
        try {
            const response = await this.axiosInstance.post('/user/register', userData);
            const { token } = response.data;

            localStorage.setItem('token', token);

            return {
                success: true,
                message: 'تم التسجيل بنجاح',
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'خطأ في التسجيل، يرجى المحاولة مرة أخرى',
                data: null
            };
        }
    }

    async logout() {
        localStorage.removeItem('token');

        return {
            success: true,
            message: 'تم تسجيل الخروج بنجاح'
        };
    }
    async resetPassword(email) {
        // Logic for resetting password
    }
    async updateProfile(userData) {
        // Logic for updating user profile
    }
    async getUserProfile(token) {
        try {
            const response = await this.axiosInstance.get('/user/profile', { headers: { token } });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'خطأ في جلب بيانات المستخدم، يرجى المحاولة مرة أخرى',
                data: null
            };
        }
    }
    async isAdmin(token) {
        try {
            const response = await this.axiosInstance.get('/admin/is-admin', { headers: { token } });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'خطأ في التحقق من صلاحيات المدير، يرجى المحاولة مرة أخرى',
                data: null
            };
        }
    }
};
export default AuthService;