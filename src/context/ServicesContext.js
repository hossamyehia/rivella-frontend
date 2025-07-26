import { createContext, useContext, useState } from 'react';
import { ApiContext } from './ApiContext';
import LookupsService from '../services/Lookups.service';
import ChaletService from '../services/Chalet.service';

export const ServicesContext = createContext();

export const useServicesContext = () => useContext(ServicesContext);

export const ServicesContextProvider = ({ children }) => {
    const { axiosInstance, isLoading, setIsLoading } = useContext(ApiContext);

    // const waitingCall = async (service, method, ...args) => {
    //     setIsLoading(true);
    //     try {
    //         const response = await service[method](...args);
    //         return response;
    //     } catch (error) {
    //         console.error(`Error in ${method} of ${service.constructor.name}:`, error);
    //         return { success: false, message: error.message || 'An error occurred' };
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }
    const services = {
        LookupsService: new (LookupsService)(axiosInstance),
        ChaletService: new (ChaletService)(axiosInstance),
    };

    const waitingCall = async (service, method, ...args) => {
        setIsLoading(true);
        try {
            const response = await services[service][method](...args);
            return response;
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <ServicesContext.Provider value={{ services, waitingCall, isLoading, setIsLoading }}>
            {children}
        </ServicesContext.Provider>
    );
}