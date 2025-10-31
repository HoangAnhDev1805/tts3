const { PaymentMethod } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const upload = require('../middlewares/upload');
const sharp = require('sharp');
const path = require('path');

class PaymentMethodController {
  async getAll(req, res) {
    try {
      const { isActive } = req.query;
      const filter = {};
      if (isActive !== undefined) filter.isActive = isActive === 'true';
      const methods = await PaymentMethod.find(filter).sort({ order: 1 });
      return successResponse(res, methods);
    } catch (error) {
      return errorResponse(res, 'Failed to get payment methods', 500);
    }
  }

  async getById(req, res) {
    try {
      const method = await PaymentMethod.findById(req.params.id);
      if (!method) return errorResponse(res, 'Payment method not found', 404);
      return successResponse(res, method);
    } catch (error) {
      return errorResponse(res, 'Failed to get payment method', 500);
    }
  }

  async create(req, res) {
    try {
      const method = await PaymentMethod.create(req.body);
      return successResponse(res, method, 'Payment method created', 201);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async update(req, res) {
    try {
      const method = await PaymentMethod.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!method) return errorResponse(res, 'Payment method not found', 404);
      return successResponse(res, method, 'Payment method updated');
    } catch (error) {
      return errorResponse(res, 'Failed to update payment method', 500);
    }
  }

  async delete(req, res) {
    try {
      await PaymentMethod.findByIdAndDelete(req.params.id);
      return successResponse(res, null, 'Payment method deleted');
    } catch (error) {
      return errorResponse(res, 'Failed to delete payment method', 500);
    }
  }
}

module.exports = new PaymentMethodController();
