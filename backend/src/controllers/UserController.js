const { User } = require('../models');
const { successResponse, errorResponse, paginationResponse } = require('../utils/response');
const { calculateExpiryDate } = require('../utils/helpers');

class UserController {
  /**
   * Get all users (Admin only)
   */
  async getAll(req, res) {
    try {
      const { page = 1, limit = 20, role, status, search } = req.query;

      const filter = {};
      if (role) filter.role = role;
      if (status) filter.status = status;
      if (search) {
        filter.$or = [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } },
        ];
      }

      const total = await User.countDocuments(filter);
      const users = await User.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      return paginationResponse(res, users, page, limit, total);
    } catch (error) {
      console.error('Get users error:', error);
      return errorResponse(res, 'Failed to get users', 500);
    }
  }

  /**
   * Get user by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }

      return successResponse(res, user);
    } catch (error) {
      console.error('Get user error:', error);
      return errorResponse(res, 'Failed to get user', 500);
    }
  }

  /**
   * Create user (Admin only)
   */
  async create(req, res) {
    try {
      const userData = req.body;
      const user = await User.create(userData);

      return successResponse(res, user, 'User created', 201);
    } catch (error) {
      console.error('Create user error:', error);
      return errorResponse(res, error.message, 500);
    }
  }

  /**
   * Update user
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const user = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }

      return successResponse(res, user, 'User updated');
    } catch (error) {
      console.error('Update user error:', error);
      return errorResponse(res, 'Failed to update user', 500);
    }
  }

  /**
   * Delete user (Admin only)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Don't allow deleting admin
      const user = await User.findById(id);
      if (user && user.role === 'admin') {
        return errorResponse(res, 'Cannot delete admin user', 403);
      }

      await User.findByIdAndDelete(id);
      return successResponse(res, null, 'User deleted');
    } catch (error) {
      console.error('Delete user error:', error);
      return errorResponse(res, 'Failed to delete user', 500);
    }
  }

  /**
   * Extend user expiry (Admin only)
   */
  async extend(req, res) {
    try {
      const { id } = req.params;
      const { months } = req.body;

      const user = await User.findById(id);
      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }

      const currentExpiry = user.expiryDate > new Date() ? user.expiryDate : new Date();
      user.expiryDate = calculateExpiryDate(currentExpiry, months);
      user.status = 'active';
      await user.save();

      return successResponse(res, user, 'User expiry extended');
    } catch (error) {
      console.error('Extend user error:', error);
      return errorResponse(res, 'Failed to extend user', 500);
    }
  }

  /**
   * Change password (Current user or Admin)
   */
  async changePassword(req, res) {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;

      // Check if user is changing their own password or is admin
      if (req.user._id.toString() !== id && req.user.role !== 'admin') {
        return errorResponse(res, 'Unauthorized', 403);
      }

      const user = await User.findById(id).select('+password');
      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }

      // If not admin, verify old password
      if (req.user.role !== 'admin') {
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
          return errorResponse(res, 'Current password is incorrect', 400);
        }
      }

      user.password = newPassword;
      await user.save();

      return successResponse(res, null, 'Password changed successfully');
    } catch (error) {
      console.error('Change password error:', error);
      return errorResponse(res, 'Failed to change password', 500);
    }
  }

  /**
   * Get user stats (Admin only)
   */
  async getStats(req, res) {
    try {
      const total = await User.countDocuments();
      const active = await User.countDocuments({ status: 'active' });
      const expired = await User.countDocuments({ status: 'expired' });
      const locked = await User.countDocuments({ status: 'locked' });
      const trial = await User.countDocuments({ role: 'trial' });

      return successResponse(res, {
        total,
        active,
        expired,
        locked,
        trial,
      });
    } catch (error) {
      console.error('Get stats error:', error);
      return errorResponse(res, 'Failed to get stats', 500);
    }
  }
}

module.exports = new UserController();
