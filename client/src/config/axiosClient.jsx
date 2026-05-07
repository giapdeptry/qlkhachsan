import axios from 'axios';
import Cookies from 'js-cookie';
import { requestRefreshToken } from './UserRequest';

export class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL || import.meta.env.VITE_API_URL || '';
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            withCredentials: true,
        });

        this.isRefreshing = false;
        this.failedQueue = [];

        this.setupInterceptors();
    }

    setupInterceptors() {
        // Request interceptor - Add JWT token to Authorization header
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // Priority 1: Check localStorage (set during login)
                let token = localStorage.getItem('token');
                
                // Priority 2: Fallback to regular cookie (Cookies.get only reads non-httpOnly cookies)
                if (!token) {
                    token = Cookies.get('token');
                }
                
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                    console.log('[REQUEST] Token added to Authorization header');
                } else {
                    console.log('[REQUEST] No token found - request may fail with 401 if auth required');
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        // Response interceptor - Handle 401 with token refresh
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                
                if (error.response?.status === 401 && !originalRequest._retry) {
                    console.error('[AUTH] 401 Unauthorized:', error.response?.data?.message || 'No message');
                    
                    // If no token exists at all, don't try to refresh
                    const hasToken = !!(localStorage.getItem('token') || Cookies.get('token'));
                    if (!hasToken) {
                        console.log('[AUTH] No token available, cannot refresh');
                        this.handleAuthFailure();
                        return Promise.reject(error);
                    }

                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        })
                            .then(() => this.axiosInstance(originalRequest))
                            .catch((err) => Promise.reject(err));
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        console.log('[AUTH] Attempting token refresh...');
                        await this.refreshToken();
                        this.processQueue(null);
                        return this.axiosInstance(originalRequest);
                    } catch (refreshError) {
                        this.processQueue(refreshError);
                        this.handleAuthFailure();
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            },
        );
    }

    async refreshToken() {
        try {
            await requestRefreshToken();
            console.log('Token refreshed successfully');
        } catch (error) {
            console.error('Failed to refresh token:', error);
            throw error;
        }
    }

    processQueue(error) {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });

        this.failedQueue = [];
    }

    handleAuthFailure() {
        // Prevent multiple redirects
        if (typeof window !== 'undefined') {
            if (window.__AUTH_REDIRECTING__) return;
            window.__AUTH_REDIRECTING__ = true;
        }

        // Clear all auth data
        localStorage.removeItem('token');
        Cookies.remove('token');
        Cookies.remove('logged');
        Cookies.remove('refreshToken');

        // Use soft redirect to prevent component re-mount loops
        if (typeof window !== 'undefined') {
            // Small delay to ensure cleanup completes
            setTimeout(() => {
                window.__AUTH_REDIRECTING__ = false;
                window.location.href = '/login';
            }, 100);
        }
    }


    isLoggedIn() {
        // Tránh trường hợp cookie.logged lệch nhưng token vẫn còn (vẫn có thể refresh)
        const cookieLogged = Cookies.get('logged') === '1';
        const hasLocalToken = !!localStorage.getItem('token');
        return cookieLogged || hasLocalToken;
    }


    async logout() {
        try {
            await this.axiosInstance.get('/api/users/logout');
            // Clear token from localStorage on logout
            localStorage.removeItem('token');
            console.log('[LOGOUT] Token removed from localStorage');
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear token even if logout API fails
            localStorage.removeItem('token');
        }
    }

    checkAuthStatus() {
        return this.isLoggedIn();
    }

    get(url, config) {
        return this.axiosInstance.get(url, config);
    }

    post(url, data, config) {
        return this.axiosInstance.post(url, data, config);
    }

    put(url, data, config) {
        return this.axiosInstance.put(url, data, config);
    }

    delete(url, config) {
        return this.axiosInstance.delete(url, config);
    }

    patch(url, data, config) {
        return this.axiosInstance.patch(url, data, config);
    }
}

// Export instance
export const apiClient = new ApiClient();
