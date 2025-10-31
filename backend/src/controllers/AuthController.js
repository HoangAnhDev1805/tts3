const { User, Contact, Message } = require('../models');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');
const { generateTrialUsername, generateTrialPassword, calculateExpiryDate } = require('../utils/helpers');
const { ROLES, USER_STATUS, TRIAL_DURATION, DEFAULT_PRICING } = require('../config/constants');

class AuthController {
  /**
   * Login
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Find user with password field
      const user = await User.findOne({ username }).select('+password');
      if (!user) {
        return errorResponse(res, 'Invalid credentials', 401);
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return errorResponse(res, 'Invalid credentials', 401);
      }

      // Check if account is locked
      if (user.status === USER_STATUS.LOCKED) {
        return errorResponse(res, 'Account is locked', 403);
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Remove password from response
      const userObj = user.toJSON();

      return successResponse(res, {
        user: userObj,
        accessToken,
        refreshToken,
      }, 'Login successful');
    } catch (error) {
      console.error('Login error:', error);
      return errorResponse(res, 'Login failed', 500);
    }
  }

  /**
   * Create trial account
   */
  async createTrial(req, res) {
    try {
      const username = generateTrialUsername();
      const password = generateTrialPassword();
      const expiryDate = new Date(Date.now() + TRIAL_DURATION);

      // Create trial user
      const user = await User.create({
        username,
        password,
        role: ROLES.TRIAL,
        status: USER_STATUS.ACTIVE,
        expiryDate,
        fullName: 'Trial User',
      });

      // Create demo contacts (5 contacts)
      const demoContacts = [];
      for (let i = 1; i <= 5; i++) {
        const contact = await Contact.create({
          userId: user._id,
          fullName: `Demo Contact ${i}`,
          phone: `090123456${i}`,
          address: `Demo Address ${i}`,
          status: 'active',
          pricingConfig: DEFAULT_PRICING,
        });
        demoContacts.push(contact);
      }

      // Create demo messages (15 messages)
      const demoMessages = [
        'dc 12 34 56 lo10',
        'tp 78 90 b20',
        '3dai 11 22 33 dx5',
        'dc 45 67 bao15',
        'dn 89 01 lo12',
      ];

      for (let i = 0; i < 15; i++) {
        const contactIndex = i % 5;
        await Message.create({
          userId: user._id,
          contactId: demoContacts[contactIndex]._id,
          date: new Date(),
          content: demoMessages[i % demoMessages.length],
          regions: ['mb', 'mt', 'mn'],
          status: 'pending',
        });
      }

      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      return successResponse(res, {
        username,
        password,
        user: user.toJSON(),
        accessToken,
        refreshToken,
      }, 'Trial account created');
    } catch (error) {
      console.error('Create trial error:', error);
      return errorResponse(res, 'Failed to create trial account', 500);
    }
  }

  /**
   * Refresh token
   */
  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return errorResponse(res, 'Refresh token required', 400);
      }

      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        return errorResponse(res, 'Invalid refresh token', 401);
      }

      const user = await User.findById(decoded.userId);
      if (!user || user.status === USER_STATUS.LOCKED) {
        return errorResponse(res, 'User not found or locked', 401);
      }

      const accessToken = generateAccessToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id);

      return successResponse(res, {
        accessToken,
        refreshToken: newRefreshToken,
      }, 'Token refreshed');
    } catch (error) {
      console.error('Refresh token error:', error);
      return errorResponse(res, 'Token refresh failed', 500);
    }
  }

  /**
   * Get current user
   */
  async me(req, res) {
    try {
      return successResponse(res, req.user, 'User retrieved');
    } catch (error) {
      console.error('Get me error:', error);
      return errorResponse(res, 'Failed to get user', 500);
    }
  }

  /**
   * Logout
   */
  async logout(req, res) {
    try {
      // In a real application, you might want to blacklist the token
      return successResponse(res, null, 'Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      return errorResponse(res, 'Logout failed', 500);
    }
  }
}

module.exports = new AuthController();
