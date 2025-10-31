const express = require('express');
const router = express.Router();
const PaymentMethodController = require('../controllers/PaymentMethodController');
const { authenticate, isAdmin, optionalAuth } = require('../middlewares');
const { validate, schemas } = require('../utils/validation');

// Public routes
router.get('/', optionalAuth, PaymentMethodController.getAll);
router.get('/:id', optionalAuth, PaymentMethodController.getById);

// Admin only routes
router.post('/', authenticate, isAdmin, validate(schemas.createPaymentMethod), PaymentMethodController.create);
router.patch('/:id', authenticate, isAdmin, PaymentMethodController.update);
router.delete('/:id', authenticate, isAdmin, PaymentMethodController.delete);

module.exports = router;
