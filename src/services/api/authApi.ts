import axiosInstance from './axiosInstance';
import {
    type LoginRequest,
    type LoginResponse,
    type ChangePasswordRequest
} from '../types/api.types';
import { type AxiosResponse } from 'axios';

export const authApi = {
    // ==================== LOGIN ====================
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            const response: AxiosResponse<LoginResponse> = await axiosInstance.post(
                '/auth/login',
                credentials
            );
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // ==================== CHANGE PASSWORD ====================
    changePassword: async (data: ChangePasswordRequest): Promise<void> => {
        try {
            await axiosInstance.post('/auth/change-password', data);
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    },

    // ==================== LOGOUT ====================
    logout: async (): Promise<void> => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
};