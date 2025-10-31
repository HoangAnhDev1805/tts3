const { Contact } = require('../models');
const { successResponse, errorResponse, paginationResponse } = require('../utils/response');

class ContactController {
  /**
   * Get all contacts for current user
   */
  async getAll(req, res) {
    try {
      const { page = 1, limit = 20, status, search } = req.query;

      const filter = { userId: req.user._id };
      if (status) filter.status = status;
      if (search) {
        filter.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];
      }

      const total = await Contact.countDocuments(filter);
      const contacts = await Contact.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      return paginationResponse(res, contacts, page, limit, total);
    } catch (error) {
      console.error('Get contacts error:', error);
      return errorResponse(res, 'Failed to get contacts', 500);
    }
  }

  /**
   * Get contact by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const contact = await Contact.findOne({
        _id: id,
        userId: req.user._id,
      });

      if (!contact) {
        return errorResponse(res, 'Contact not found', 404);
      }

      return successResponse(res, contact);
    } catch (error) {
      console.error('Get contact error:', error);
      return errorResponse(res, 'Failed to get contact', 500);
    }
  }

  /**
   * Create contact
   */
  async create(req, res) {
    try {
      const contactData = {
        ...req.body,
        userId: req.user._id,
      };

      const contact = await Contact.create(contactData);
      return successResponse(res, contact, 'Contact created', 201);
    } catch (error) {
      console.error('Create contact error:', error);
      return errorResponse(res, error.message, 500);
    }
  }

  /**
   * Update contact
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const contact = await Contact.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        updates,
        { new: true, runValidators: true }
      );

      if (!contact) {
        return errorResponse(res, 'Contact not found', 404);
      }

      return successResponse(res, contact, 'Contact updated');
    } catch (error) {
      console.error('Update contact error:', error);
      return errorResponse(res, 'Failed to update contact', 500);
    }
  }

  /**
   * Delete contact
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const contact = await Contact.findOneAndDelete({
        _id: id,
        userId: req.user._id,
      });

      if (!contact) {
        return errorResponse(res, 'Contact not found', 404);
      }

      return successResponse(res, null, 'Contact deleted');
    } catch (error) {
      console.error('Delete contact error:', error);
      return errorResponse(res, 'Failed to delete contact', 500);
    }
  }

  /**
   * Update pricing config for contact
   */
  async updatePricing(req, res) {
    try {
      const { id } = req.params;
      const { pricingConfig } = req.body;

      const contact = await Contact.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        { pricingConfig },
        { new: true, runValidators: true }
      );

      if (!contact) {
        return errorResponse(res, 'Contact not found', 404);
      }

      return successResponse(res, contact, 'Pricing config updated');
    } catch (error) {
      console.error('Update pricing error:', error);
      return errorResponse(res, 'Failed to update pricing', 500);
    }
  }

  /**
   * Update debt for contact
   */
  async updateDebt(req, res) {
    try {
      const { id } = req.params;
      const { debt } = req.body;

      const contact = await Contact.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        { debt },
        { new: true }
      );

      if (!contact) {
        return errorResponse(res, 'Contact not found', 404);
      }

      return successResponse(res, contact, 'Debt updated');
    } catch (error) {
      console.error('Update debt error:', error);
      return errorResponse(res, 'Failed to update debt', 500);
    }
  }
}

module.exports = new ContactController();
