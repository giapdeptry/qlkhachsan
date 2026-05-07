const { AuthFailureError } = require('../core/error.response');
const { verifyToken } = require('../utils/jwt');
const modelUser = require('../models/users.model');

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Extract JWT token from Authorization header or cookies
 * Supports: "Authorization: Bearer <token>" (RFC 6750)
 * Fallback: cookies.token
 */
const extractToken = (req) => {
    const authHeader = req.headers.authorization;

    // Check for "Bearer <token>" format
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7); // Remove "Bearer " prefix
        if (!token) {
            throw new AuthFailureError('Token cannot be empty in Authorization header');
        }
        return token;
    }

    // Fallback to cookie
    if (req.cookies?.token) {
        return req.cookies.token;
    }

    throw new AuthFailureError('Missing authentication token. Use "Authorization: Bearer <token>" or set token in cookies');
};

const authUser = asyncHandler(async (req, res, next) => {
    try {
        console.log('[AUTH] Extracting token from request...');
        const token = extractToken(req);
        
        console.log('[AUTH] Verifying token...');
        const decoded = await verifyToken(token);
        
        console.log(`[AUTH] User authenticated: ${decoded.id}`);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('[AUTH ERROR]', error.message);
        next(error);
    }
});

const authAdmin = asyncHandler(async (req, res, next) => {
    try {
        console.log('[AUTH] Extracting token for admin check...');
        const token = extractToken(req);
        
        console.log('[AUTH] Verifying admin token...');
        const decoded = await verifyToken(token);
        const { id } = decoded;

        console.log(`[AUTH] Looking up admin user: ${id}`);
        const findUser = await modelUser.findOne({ _id: id });

        if (!findUser) {
            console.error('[AUTH ERROR] User not found:', id);
            throw new AuthFailureError('User account not found');
        }

        if (!findUser.isAdmin) {
            console.error('[AUTH ERROR] User is not admin:', id);
            throw new AuthFailureError('Access denied. Admin role required');
        }

        console.log(`[AUTH] Admin verified: ${id}`);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('[AUTH ERROR]', error.message);
        next(error);
    }
});

module.exports = {
    asyncHandler,
    authUser,
    authAdmin,
    extractToken,
};
