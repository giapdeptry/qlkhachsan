/**
 * CODE EXAMPLES - JWT Authentication Fix
 * Real-world usage scenarios
 */

// ============================================
// 1️⃣ BACKEND - PROTECTED ROUTE EXAMPLE
// ============================================

// File: server/src/routes/user.routes.js
const express = require('express');
const { authUser, authAdmin } = require('../auth/checkAuth');
const userController = require('../controllers/users.controller');

const router = express.Router();

// ✅ CORRECT - Middleware will extract token from:
//    1. Authorization: Bearer <token> header (preferred)
//    2. Fallback to cookies.token
router.get('/profile', authUser, async (req, res, next) => {
    try {
        // req.user is populated by authUser middleware
        const user = await userController.getProfile(req.user.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error); // Error handler returns proper 401
    }
});

// ✅ ADMIN ONLY - Checks isAdmin flag
router.get('/admin/users', authAdmin, async (req, res, next) => {
    try {
        const users = await userController.getAllUsers();
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;


// ============================================
// 2️⃣ FRONTEND - CORRECT REQUEST USAGE
// ============================================

// File: client/src/config/UserRequest.jsx
import { apiClient } from './axiosClient';

// ✅ CORRECT - Token is automatically added via interceptor
export const getProfile = async () => {
    try {
        const response = await apiClient.get('/api/users/profile');
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.error('Session expired - redirecting to login');
        }
        throw error;
    }
};

// ✅ POST with auth token (automatic)
export const updateProfile = async (userData) => {
    const response = await apiClient.put('/api/users/profile', userData);
    return response.data;
};

// ✅ DELETE with auth token (automatic)
export const deleteAccount = async () => {
    const response = await apiClient.delete('/api/users/account');
    return response.data;
};


// ============================================
// 3️⃣ FRONTEND - REACT COMPONENT USAGE
// ============================================

import { useEffect, useState } from 'react';
import { getProfile } from '../config/UserRequest';

export function ProfilePage() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Automatically includes: Authorization: Bearer <token>
                const data = await getProfile();
                setUser(data);
            } catch (err) {
                if (err.response?.status === 401) {
                    // Auto-redirect handled by apiClient interceptor
                    setError('Session expired. Please login again.');
                } else {
                    setError('Failed to load profile');
                }
            }
        };

        fetchProfile();
    }, []);

    if (error) return <div>{error}</div>;
    if (!user) return <div>Loading...</div>;
    
    return <div>Welcome, {user.name}</div>;
}


// ============================================
// 4️⃣ DEBUGGING - WHAT'S HAPPENING
// ============================================

// ✅ BACKEND LOGS (server console)
// When valid request comes in:
// [AUTH] Extracting token from request...
// [AUTH] Verifying token...
// [AUTH] User authenticated: 507f1f77bcf86cd799439011
// (request proceeds, returns 200)

// When 401 occurs:
// [AUTH ERROR] Missing authentication token...
// (request fails, returns 401 with error message)

// ✅ FRONTEND LOGS (browser console)
// [REQUEST] Token added to Authorization header
// (successful request)

// [AUTH] 401 Unauthorized: Vui lòng đăng nhập lại
// [AUTH] Attempting token refresh...
// [AUTH] User not logged in, redirecting to login
// (redirect to /login)


// ============================================
// 5️⃣ CURL EXAMPLES - TESTING
// ============================================

// ✅ WITH VALID TOKEN (works)
// curl -X GET http://localhost:3002/api/users/profile \
//   -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \
//   -H "Content-Type: application/json"

// Response: 200 OK
// { "success": true, "data": { "id": "...", "name": "..." } }


// ❌ MISSING TOKEN (fails)
// curl -X GET http://localhost:3002/api/users/profile

// Response: 401 Unauthorized
// { "success": false, "message": "Missing authentication token..." }


// ❌ WRONG FORMAT (fails)
// curl -X GET http://localhost:3002/api/users/profile \
//   -H "Authorization: InvalidFormat xyz"

// Response: 401 Unauthorized
// { "success": false, "message": "Missing authentication token..." }


// ❌ EXPIRED TOKEN (fails)
// curl -X GET http://localhost:3002/api/users/profile \
//   -H "Authorization: Bearer eyJhbGc..." 

// Response: 401 Unauthorized
// { "success": false, "message": "Vui lòng đăng nhập lại" }


// ============================================
// 6️⃣ ERROR HANDLING - MIDDLEWARE CHAIN
// ============================================

// server/src/server.js
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes protected by authUser middleware
app.use('/api/users', require('./routes/user.routes'));

// ✅ GLOBAL ERROR HANDLER - Returns proper JSON responses
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Lỗi server';
    
    console.error(`[ERROR] ${statusCode}: ${message}`);
    
    res.status(statusCode).json({
        success: false,
        message: message,
        // Only include stack trace in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});


// ============================================
// 7️⃣ MANUAL TOKEN MANAGEMENT (if needed)
// ============================================

import Cookies from 'js-cookie';

// Get current token
function getStoredToken() {
    return Cookies.get('token');
}

// Check if user is logged in
function isUserLoggedIn() {
    return Boolean(Cookies.get('token'));
}

// Clear auth (logout)
function clearAuth() {
    Cookies.remove('token');
    Cookies.remove('logged');
    Cookies.remove('refreshToken');
}

// Store token (called after login)
function storeToken(token) {
    Cookies.set('token', token, {
        expires: 1/24, // 1 hour for access token
        secure: true,  // HTTPS only
        sameSite: 'strict'
    });
}


// ============================================
// 8️⃣ TESTING - UNIT TEST EXAMPLE
// ============================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authUser, extractToken } from '../auth/checkAuth';

describe('Auth Middleware', () => {
    it('should extract token from Authorization header', () => {
        const req = {
            headers: {
                authorization: 'Bearer valid_token_here'
            },
            cookies: {}
        };
        
        const token = extractToken(req);
        expect(token).toBe('valid_token_here');
    });

    it('should throw error if Bearer token is empty', () => {
        const req = {
            headers: {
                authorization: 'Bearer '
            },
            cookies: {}
        };
        
        expect(() => extractToken(req)).toThrow('Token cannot be empty');
    });

    it('should fallback to cookies if no Authorization header', () => {
        const req = {
            headers: {},
            cookies: { token: 'cookie_token' }
        };
        
        const token = extractToken(req);
        expect(token).toBe('cookie_token');
    });

    it('should throw error if no token found anywhere', () => {
        const req = {
            headers: {},
            cookies: {}
        };
        
        expect(() => extractToken(req)).toThrow('Missing authentication token');
    });
});


// ============================================
// 9️⃣ TYPESCRIPT VERSION
// ============================================

// If you're using TypeScript:

interface AuthRequest extends Request {
    user?: {
        id: string;
        [key: string]: any;
    };
}

// Type-safe auth middleware
export const authUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const token = extractToken(req);
        const decoded = await verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};
