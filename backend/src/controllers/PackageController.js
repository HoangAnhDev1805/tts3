const { PaymentPackage } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

class PackageController {
  /**
   * Get all packages
   */
  async getAll(req, res) {
    try {
      const { isActive } = req.query;

      const filter = {};
      if (isActive !== undefined) filter.isActive = isActive === 'true';

      const packages = await PaymentPackage.find(filter).sort({ order: 1 });

      return successResponse(res, packages);
    } catch (error) {
      console.error('Get packages error:', error);
      return errorResponse(res, 'Failed to get packages', 500);
    }
  }

  /**
   * Get package by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const pkg = await PaymentPackage.findById(id);

      if (!pkg) {
        return errorResponse(res, 'Package not found', 404);
      }

      return successResponse(res, pkg);
    } catch (error) {
      console.error('Get package error:', error);
      return errorResponse(res, 'Failed to get package', 500);
    }
  }

  /**
   * Create package (Admin only)
   */
  async create(req, res) {
    try {
      const pkg = await PaymentPackage.create(req.body);
      return successResponse(res, pkg, 'Package created', 201);
    } catch (error) {
      console.error('Create package error:', error);
      return errorResponse(res, error.message, 500);
    }
  }

  /**
   * Update package (Admin only)
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const pkg = await PaymentPackage.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!pkg) {
        return errorResponse(res, 'Package not found', 404);
      }

      return successResponse(res, pkg, 'Package updated');
    } catch (error) {
      console.error('Update package error:', error);
      return errorResponse(res, 'Failed to update package', 500);
    }
  }

  /**
   * Delete package (Admin only)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      await PaymentPackage.findByIdAndDelete(id);

      return successResponse(res, null, 'Package deleted');
    } catch (error) {
      console.error('Delete package error:', error);
      return errorResponse(res, 'Failed to delete package', 500);
    }
  }
}

module.exports = new PackageController();
