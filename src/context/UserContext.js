import { createContext, useContext, useState, useEffect } from 'react';
import { useApiContext } from './ApiContext';
import AuthService from '../services/Auth.service';
import WishListService from '../services/wishlist.service';

export const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {
    const { axiosInstance, isLoading, setIsLoading } = useApiContext();
    const _AuthService = new AuthService(axiosInstance);
    const _WishlistService = new WishListService(axiosInstance);

    const [isLogin, setIsLogin] = useState(()=>{
        return localStorage.getItem('token') ? true: false;
    });
    const [isAdmin, setIsAdmin] = useState(null);
    const [userData, setUserData] = useState(null);
    const [wishlist, setWishlist] = useState(() => {
        const stored = localStorage.getItem("wishlist");
        return stored ? JSON.parse(stored) : null;
    });

    // Check if user is logged in on component mount
    useEffect(() => {
        (async () => {
            if (isLogin) {
                const token = localStorage.getItem('token');
                axiosInstance.defaults.headers.common['token'] = token;
                isAdminCheck().then(isAdmin => {
                    if (!isAdmin) {
                        fetchUserProfile(token);
                        fetchWishlist(token);
                    }
                });
            } else {
                delete axiosInstance.defaults.headers.common['token'];
            }
        })()
    }, []);

    // Update axios headers when token changes
    useEffect(() => {
        (async () => {
            if (isLogin) {
                const token = localStorage.getItem('token');
                axiosInstance.defaults.headers.common['token'] = token;
                isAdminCheck().then(isAdmin => {
                    if (!isAdmin) {
                        fetchUserProfile(token);
                        fetchWishlist(token);
                    }
                });
            } else {
                delete axiosInstance.defaults.headers.common['token'];
            }
        })()
    }, [isLogin]);

    useEffect(() => {
        if (isLogin) {
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
        } else {
            localStorage.removeItem("wishlist");
            setWishlist(null);
        }
    }, [isLogin, wishlist])

    const fetchUserProfile = async (token) => {
        try {
            setIsLoading(true);
            const res = await _AuthService.getUserProfile(token);
            if (res.success) {
                setUserData(res.data);
                setIsLogin(true);
            }
            return res;
        }
        finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const res = await _AuthService.login(email, password);
            if (res.success) {
                setIsLogin(true);
                setIsAdmin(false);
                // localStorage.setItem('token', res.data.token);
            }
            return res;
        } finally {
            setIsLoading(false);
        }
    };

    const loginAsAdmin = async (email, password) => {
        setIsLoading(true);
        try {
            const res = await _AuthService.loginAsAdmin(email, password);
            if (res.success) {
                setIsLogin(true);
                setIsAdmin(true);
            }
            return res;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setIsLoading(true);
            const res = await _AuthService.register(userData);
            return res;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        try {
            setIsLoading(true);
            const res = _AuthService.logout();
            setIsLogin(false);
            setUserData(null);
            setWishlist(null);
            return res;
        } finally {
            setIsLoading(false);
        }
    };

    const isAdminCheck = async () => {
        if (isAdmin !== null) return isAdmin;
        if (!isLogin) return false;
        const { success: APISuccess, data: { success: isAdminR } } = await _AuthService.isAdmin(localStorage.getItem('token'));
        if (APISuccess) {
            setIsAdmin(isAdminR);
        }
        return isAdminR ?? false;
    };


    const addToWishlist = async (chalet) => {
        try {
            setIsLoading(true);
            const res = await _WishlistService.addToWishlist(chalet._id);
            if (res.success) setWishlist(prev => [...prev, chalet]);
            return res;
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch wishlist from API
    const fetchWishlist = async (token) => {
        if (wishlist !== null) return wishlist;
        try {
            setIsLoading(true);
            const response = await _WishlistService.getWishlist(token);
            if (response.success) setWishlist(response.data.data || []);
            return response;
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromWishlist = async (chalet_id) => {
        try {
            setIsLoading(true);
            const res = await _WishlistService.removeFromWishlist(chalet_id);
            if (res.success) setWishlist(prev => prev.filter(item => item._id !== chalet_id));
            return res;
        } finally {
            setIsLoading(false);
        }
    };

    // New function to clear all wishlist items
    const clearWishlist = async () => {
        try {
            setIsLoading(true);
            const res = await _WishlistService.clearWishlist();
            if (res.success) {
                setWishlist([]);
            }
            return res;
        } finally {
            setIsLoading(false);
        }
    };

    const contextValues = {
        isLogin,
        userData,
        login,
        loginAsAdmin,
        register,
        fetchUserProfile,
        logout,
        wishlist,
        setWishlist,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isAdmin,
        isAdminCheck,
        isLoading
    };

    return (
        <UserContext.Provider value={contextValues}>
            {children}
        </UserContext.Provider>
    );
}