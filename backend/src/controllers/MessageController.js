const { Message, Contact } = require('../models');
const { successResponse, errorResponse, paginationResponse } = require('../utils/response');
const MessageParserService = require('../services/MessageParserService');
const CalculationService = require('../services/CalculationService');
const { MESSAGE_STATUS } = require('../config/constants');

class MessageController {
  /**
   * Get all messages for current user
   */
  async getAll(req, res) {
    try {
      const { page = 1, limit = 20, status, contactId, startDate, endDate } = req.query;

      const filter = { userId: req.user._id };
      if (status) filter.status = status;
      if (contactId) filter.contactId = contactId;
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      const total = await Message.countDocuments(filter);
      const messages = await Message.find(filter)
        .populate('contactId')
        .sort({ date: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      return paginationResponse(res, messages, page, limit, total);
    } catch (error) {
      console.error('Get messages error:', error);
      return errorResponse(res, 'Failed to get messages', 500);
    }
  }

  /**
   * Get message by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const message = await Message.findOne({
        _id: id,
        userId: req.user._id,
      }).populate('contactId');

      if (!message) {
        return errorResponse(res, 'Message not found', 404);
      }

      return successResponse(res, message);
    } catch (error) {
      console.error('Get message error:', error);
      return errorResponse(res, 'Failed to get message', 500);
    }
  }

  /**
   * Parse message (Preview before saving)
   */
  async parse(req, res) {
    try {
      const { contactId, content, date, regions } = req.body;

      // Get contact for pricing config
      const contact = await Contact.findOne({
        _id: contactId,
        userId: req.user._id,
      });

      if (!contact) {
        return errorResponse(res, 'Contact not found', 404);
      }

      // Parse message
      const parsed = await MessageParserService.parseMessage(
        content,
        contactId,
        date,
        regions,
        contact.pricingConfig
      );

      return successResponse(res, parsed, 'Message parsed');
    } catch (error) {
      console.error('Parse message error:', error);
      return errorResponse(res, 'Failed to parse message', 500);
    }
  }

  /**
   * Create message (Save after parsing)
   */
  async create(req, res) {
    try {
      const messageData = {
        ...req.body,
        userId: req.user._id,
        status: MESSAGE_STATUS.PENDING,
      };

      const message = await Message.create(messageData);
      await message.populate('contactId');

      return successResponse(res, message, 'Message created', 201);
    } catch (error) {
      console.error('Create message error:', error);
      return errorResponse(res, error.message, 500);
    }
  }

  /**
   * Update message
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const message = await Message.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        updates,
        { new: true, runValidators: true }
      ).populate('contactId');

      if (!message) {
        return errorResponse(res, 'Message not found', 404);
      }

      return successResponse(res, message, 'Message updated');
    } catch (error) {
      console.error('Update message error:', error);
      return errorResponse(res, 'Failed to update message', 500);
    }
  }

  /**
   * Delete message
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const message = await Message.findOneAndDelete({
        _id: id,
        userId: req.user._id,
      });

      if (!message) {
        return errorResponse(res, 'Message not found', 404);
      }

      return successResponse(res, null, 'Message deleted');
    } catch (error) {
      console.error('Delete message error:', error);
      return errorResponse(res, 'Failed to delete message', 500);
    }
  }

  /**
   * Process message result (Check win/lose)
   */
  async processResult(req, res) {
    try {
      const { id } = req.params;
      const { lotteryResult } = req.body;

      const message = await Message.findOne({
        _id: id,
        userId: req.user._id,
      });

      if (!message) {
        return errorResponse(res, 'Message not found', 404);
      }

      // Calculate result
      const result = await CalculationService.processMessageResult(message, lotteryResult);

      message.result = result;
      message.status = result.profit > 0 ? MESSAGE_STATUS.WON : MESSAGE_STATUS.LOST;
      await message.save();

      return successResponse(res, message, 'Result processed');
    } catch (error) {
      console.error('Process result error:', error);
      return errorResponse(res, 'Failed to process result', 500);
    }
  }

  /**
   * Get statistics
   */
  async getStats(req, res) {
    try {
      const { startDate, endDate, contactId } = req.query;

      const filter = { userId: req.user._id, 'result.processed': true };
      if (contactId) filter.contactId = contactId;
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      const messages = await Message.find(filter);

      let totalBet = 0;
      let totalWin = 0;
      let totalProfit = 0;

      messages.forEach(msg => {
        totalBet += msg.result.totalLose || 0;
        totalWin += msg.result.totalWin || 0;
        totalProfit += msg.result.profit || 0;
      });

      return successResponse(res, {
        totalBet,
        totalWin,
        totalProfit,
        messageCount: messages.length,
      });
    } catch (error) {
      console.error('Get stats error:', error);
      return errorResponse(res, 'Failed to get stats', 500);
    }
  }
}

module.exports = new MessageController();
