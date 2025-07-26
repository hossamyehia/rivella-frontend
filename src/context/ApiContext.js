import { createContext, useContext, useState } from 'react';
import axios from 'axios';

export const ApiContext = createContext();

export const useApiContext = () => useContext(ApiContext);

export const ApiContextProvider = ({ children }) => {

    // const host = 'https://rivellaexplore.com/api/v1/rivella';
    const host = "http://localhost:3001/api/v1/rivella"
    // Create axios instance with baseURL
    const axiosInstance = axios.create({
        baseURL: host,
    });

    // Set default headers if needed
    axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
    axiosInstance.defaults.headers.common['Accept'] = 'application/json';
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                // config.headers.Authorization = `Bearer ${token}`;
                config.headers['token'] = token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const [isLoading, setIsLoading] = useState(false);

    return (
        <ApiContext.Provider value={{ axiosInstance, isLoading, setIsLoading }}>
            {children}
        </ApiContext.Provider>
    );
}