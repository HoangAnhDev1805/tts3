const { errorResponse } = require('../utils/response');
const { ROLES } = require('../config/constants');

/**
 * Check if user account is expired
 */
const checkExpiry = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Unauthorized', 401);
  }

  // Admin không bị check expiry
  if (req.user.role === ROLES.ADMIN) {
    return next();
  }

  // Check if account is expired
  if (req.user.isExpired()) {
    return res.status(403).json({
      success: false,
      message: 'Account has expired',
      errorCode: 'ACCOUNT_EXPIRED',
      data: {
        expiryDate: req.user.expiryDate,
        contactInfo: {
          email: process.env.ADMIN_EMAIL || 'admin@3daixs.com',
          phone: process.env.ADMIN_PHONE || '0123456789',
          telegram: process.env.ADMIN_TELEGRAM || '@admin3daixs',
        },
      },
    });
  }

  next();
};

module.exports = checkExpiry;
