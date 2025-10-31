const { verifyAccessToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const { User } = require('../models');

/**
 * Authenticate user middleware
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 401);
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      return errorResponse(res, 'Invalid or expired token', 401);
    }

    // Get user from database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    // Check if user is locked
    if (user.status === 'locked') {
      return errorResponse(res, 'Account is locked', 403);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return errorResponse(res, 'Authentication failed', 401);
  }
};

/**
 * Optional authenticate (không bắt buộc login)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);
      
      if (decoded) {
        const user = await User.findById(decoded.userId);
        if (user && user.status !== 'locked') {
          req.user = user;
        }
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth,
};
