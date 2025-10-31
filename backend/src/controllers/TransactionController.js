const { Transaction, PaymentPackage, PaymentMethod, User } = require('../models');
const { successResponse, errorResponse, paginationResponse } = require('../utils/response');
const { TRANSACTION_STATUS, TRANSACTION_TYPES, PAYMENT_TIMEOUT } = require('../config/constants');
const { calculateExpiryDate, generateRandomString } = require('../utils/helpers');

class TransactionController {
  /**
   * Create transaction (purchase or renewal)
   */
  async create(req, res) {
    try {
      const { type, packageId, paymentMethodId, phone, username } = req.body;

      // Get package and payment method
      const pkg = await PaymentPackage.findById(packageId);
      const method = await PaymentMethod.findById(paymentMethodId);

      if (!pkg || !method) {
        return errorResponse(res, 'Package or payment method not found', 404);
      }

      if (!pkg.isActive || !method.isActive) {
        return errorResponse(res, 'Package or payment method is not active', 400);
      }

      // Generate transfer content
      const transferContent = method.transferContent.replace('[PHONE]', phone);

      // Create transaction
      const transaction = await Transaction.create({
        userId: req.user ? req.user._id : null,
        username,
        type,
        packageId,
        paymentMethodId,
        amount: pkg.price,
        phone,
        transferContent,
        status: TRANSACTION_STATUS.PENDING,
        expiresAt: new Date(Date.now() + PAYMENT_TIMEOUT),
      });

      // Populate references
      await transaction.populate(['packageId', 'paymentMethodId']);

      return successResponse(res, transaction, 'Transaction created', 201);
    } catch (error) {
      console.error('Create transaction error:', error);
      return errorResponse(res, 'Failed to create transaction', 500);
    }
  }

  /**
   * Get all transactions (Admin only)
   */
  async getAll(req, res) {
    try {
      const { page = 1, limit = 20, status, type, paymentMethodId } = req.query;

      const filter = {};
      if (status) filter.status = status;
      if (type) filter.type = type;
      if (paymentMethodId) filter.paymentMethodId = paymentMethodId;

      const total = await Transaction.countDocuments(filter);
      const transactions = await Transaction.find(filter)
        .populate(['packageId', 'paymentMethodId', 'userId', 'confirmedBy'])
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      return paginationResponse(res, transactions, page, limit, total);
    } catch (error) {
      console.error('Get transactions error:', error);
      return errorResponse(res, 'Failed to get transactions', 500);
    }
  }

  /**
   * Get transaction by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const transaction = await Transaction.findById(id)
        .populate(['packageId', 'paymentMethodId', 'userId', 'confirmedBy']);

      if (!transaction) {
        return errorResponse(res, 'Transaction not found', 404);
      }

      return successResponse(res, transaction);
    } catch (error) {
      console.error('Get transaction error:', error);
      return errorResponse(res, 'Failed to get transaction', 500);
    }
  }

  /**
   * Confirm transaction (Admin only)
   */
  async confirm(req, res) {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      const transaction = await Transaction.findById(id).populate('packageId');

      if (!transaction) {
        return errorResponse(res, 'Transaction not found', 404);
      }

      if (transaction.status !== TRANSACTION_STATUS.PENDING) {
        return errorResponse(res, 'Transaction already processed', 400);
      }

      // Process based on type
      if (transaction.type === TRANSACTION_TYPES.PURCHASE) {
        // Create new user
        const password = generateRandomString(8);
        const startDate = new Date();
        const expiryDate = calculateExpiryDate(startDate, transaction.packageId.months);

        const user = await User.create({
          username: `user_${Date.now()}`,
          password,
          phone: transaction.phone,
          fullName: transaction.phone,
          role: 'user',
          status: 'active',
          startDate,
          expiryDate,
        });

        transaction.userId = user._id;

        // TODO: Send email/SMS with credentials
        console.log('New user created:', {
          username: user.username,
          password,
          phone: transaction.phone,
        });
      } else if (transaction.type === TRANSACTION_TYPES.RENEWAL) {
        // Find user by username
        const user = await User.findOne({ username: transaction.username });

        if (!user) {
          return errorResponse(res, 'User not found for renewal', 404);
        }

        // Extend expiry date
        const currentExpiry = user.expiryDate > new Date() ? user.expiryDate : new Date();
        user.expiryDate = calculateExpiryDate(currentExpiry, transaction.packageId.months);
        user.status = 'active';
        await user.save();

        transaction.userId = user._id;

        // TODO: Send notification
        console.log('User renewed:', {
          username: user.username,
          newExpiryDate: user.expiryDate,
        });
      }

      // Update transaction
      transaction.status = TRANSACTION_STATUS.CONFIRMED;
      transaction.confirmDate = new Date();
      transaction.confirmedBy = req.user._id;
      transaction.notes = notes;
      await transaction.save();

      await transaction.populate(['packageId', 'paymentMethodId', 'userId', 'confirmedBy']);

      return successResponse(res, transaction, 'Transaction confirmed');
    } catch (error) {
      console.error('Confirm transaction error:', error);
      return errorResponse(res, 'Failed to confirm transaction', 500);
    }
  }

  /**
   * Reject transaction (Admin only)
   */
  async reject(req, res) {
    try {
      const { id } = req.params;
      const { rejectionReason } = req.body;

      const transaction = await Transaction.findById(id);

      if (!transaction) {
        return errorResponse(res, 'Transaction not found', 404);
      }

      if (transaction.status !== TRANSACTION_STATUS.PENDING) {
        return errorResponse(res, 'Transaction already processed', 400);
      }

      transaction.status = TRANSACTION_STATUS.REJECTED;
      transaction.confirmDate = new Date();
      transaction.confirmedBy = req.user._id;
      transaction.rejectionReason = rejectionReason;
      await transaction.save();

      await transaction.populate(['packageId', 'paymentMethodId', 'userId', 'confirmedBy']);

      return successResponse(res, transaction, 'Transaction rejected');
    } catch (error) {
      console.error('Reject transaction error:', error);
      return errorResponse(res, 'Failed to reject transaction', 500);
    }
  }

  /**
   * Get stats
   */
  async getStats(req, res) {
    try {
      const total = await Transaction.countDocuments();
      const pending = await Transaction.countDocuments({ status: TRANSACTION_STATUS.PENDING });
      const confirmed = await Transaction.countDocuments({ status: TRANSACTION_STATUS.CONFIRMED });
      const rejected = await Transaction.countDocuments({ status: TRANSACTION_STATUS.REJECTED });

      const totalAmount = await Transaction.aggregate([
        { $match: { status: TRANSACTION_STATUS.CONFIRMED } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      return successResponse(res, {
        total,
        pending,
        confirmed,
        rejected,
        totalAmount: totalAmount[0]?.total || 0,
      });
    } catch (error) {
      console.error('Get stats error:', error);
      return errorResponse(res, 'Failed to get stats', 500);
    }
  }
}

module.exports = new TransactionController();
