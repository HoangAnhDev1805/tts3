const { errorResponse } = require('../utils/response');
const { ROLES } = require('../config/constants');

/**
 * Check if user has required role
 */
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Access denied. Insufficient permissions', 403);
    }

    next();
  };
};

/**
 * Check if user is admin
 */
const isAdmin = checkRole(ROLES.ADMIN);

/**
 * Check if user is not trial
 */
const notTrial = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Unauthorized', 401);
  }

  if (req.user.role === ROLES.TRIAL) {
    return errorResponse(res, 'Trial users cannot perform this action', 403);
  }

  next();
};

module.exports = {
  checkRole,
  isAdmin,
  notTrial,
};
