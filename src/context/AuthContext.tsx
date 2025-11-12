import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { tokenManager } from '../utils/tokenManager';
import { authApi } from '../services/api/authApi';
import type { UserInfo, LoginRequest, ChangePasswordRequest } from '../services/types/api.types';

interface AuthContextType {
    user: UserInfo | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    changePassword: (data: ChangePasswordRequest) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // ==================== INITIALIZE AUTH STATE ====================
    useEffect(() => {
        const initAuth = () => {
            const savedToken = tokenManager.getToken();
            const savedUser = tokenManager.getUser();

            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(savedUser);
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    // ==================== LOGIN ====================
    const login = async (credentials: LoginRequest): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await authApi.login(credentials);

            // Save access_token and user data
            tokenManager.setToken(response.access_token);
            tokenManager.setUser(response.user);

            // Update state
            setToken(response.access_token);
            setUser(response.user);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // ==================== LOGOUT ====================
    const logout = async (): Promise<void> => {
        try {
            setIsLoading(true);
            await authApi.logout();

            // Clear token and user data
            tokenManager.clearAuth();

            // Update state
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // ==================== CHANGE PASSWORD ====================
    const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
        try {
            await authApi.changePassword(data);
        } catch (error) {
            console.error('Change password failed:', error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        changePassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};