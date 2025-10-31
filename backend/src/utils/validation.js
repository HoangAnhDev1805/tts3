const Joi = require('joi');

/**
 * Validate request with Joi schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    req.body = value;
    next();
  };
};

/**
 * Common validation schemas
 */
const schemas = {
  // Login
  login: Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).required(),
  }),

  // Register user (admin only)
  createUser: Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    fullName: Joi.string().optional(),
    role: Joi.string().valid('user', 'admin').default('user'),
    startDate: Joi.date().default(Date.now),
    expiryDate: Joi.date().required(),
    status: Joi.string().valid('active', 'locked').default('active'),
    notes: Joi.string().optional(),
  }),

  // Update user
  updateUser: Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    fullName: Joi.string().optional(),
    expiryDate: Joi.date().optional(),
    status: Joi.string().valid('active', 'locked').optional(),
    notes: Joi.string().optional(),
  }),

  // Change password
  changePassword: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),

  // Create contact
  createContact: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().optional(),
    notes: Joi.string().optional(),
    status: Joi.string().valid('active', 'locked').default('active'),
    pricingConfig: Joi.object().optional(),
  }),

  // Update contact
  updateContact: Joi.object({
    fullName: Joi.string().optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
    notes: Joi.string().optional(),
    status: Joi.string().valid('active', 'locked').optional(),
    pricingConfig: Joi.object().optional(),
  }),

  // Parse message
  parseMessage: Joi.object({
    contactId: Joi.string().required(),
    content: Joi.string().required(),
    date: Joi.date().required(),
    regions: Joi.array().items(Joi.string().valid('mb', 'mt', 'mn')).required(),
  }),

  // Create message
  createMessage: Joi.object({
    contactId: Joi.string().required(),
    date: Joi.date().required(),
    content: Joi.string().required(),
    regions: Joi.array().items(Joi.string().valid('mb', 'mt', 'mn')).required(),
    parsed: Joi.object().required(),
  }),

  // Create transaction
  createTransaction: Joi.object({
    type: Joi.string().valid('purchase', 'renewal').required(),
    packageId: Joi.string().required(),
    paymentMethodId: Joi.string().required(),
    phone: Joi.string().required(),
    username: Joi.string().optional(), // For renewal
  }),

  // Create payment package
  createPackage: Joi.object({
    name: Joi.string().required(),
    months: Joi.number().min(1).required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().optional(),
    isActive: Joi.boolean().default(true),
    order: Joi.number().default(0),
  }),

  // Create payment method
  createPaymentMethod: Joi.object({
    type: Joi.string().valid('bank', 'momo', 'zalopay').required(),
    bankName: Joi.string().optional(),
    bankCode: Joi.string().optional(),
    accountNumber: Joi.string().required(),
    accountName: Joi.string().required(),
    transferContent: Joi.string().default('MUA_[PHONE]'),
    qrCode: Joi.string().optional(),
    isActive: Joi.boolean().default(true),
    order: Joi.number().default(0),
  }),
};

module.exports = {
  validate,
  schemas,
};
