const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const tokenManager = {
    // Save token to localStorage
    setToken: (token: string): void => {
        localStorage.setItem(TOKEN_KEY, token);
    },

    // Get token from localStorage
    getToken: (): string | null => {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Remove token from localStorage
    removeToken: (): void => {
        localStorage.removeItem(TOKEN_KEY);
    },

    // Check if token exists
    hasToken: (): boolean => {
        return !!localStorage.getItem(TOKEN_KEY);
    },

    // Save user data
    setUser: (user: any): void => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    // Get user data
    getUser: (): any | null => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    // Remove user data
    removeUser: (): void => {
        localStorage.removeItem(USER_KEY);
    },

    // Clear all auth data
    clearAuth: (): void => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
};