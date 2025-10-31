const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');
const { authenticate, optionalAuth, isAdmin } = require('../middlewares');
const { validate, schemas } = require('../utils/validation');

// Create transaction (public or authenticated)
router.post('/', optionalAuth, validate(schemas.createTransaction), TransactionController.create);

// Admin only routes
router.get('/', authenticate, isAdmin, TransactionController.getAll);
router.get('/stats', authenticate, isAdmin, TransactionController.getStats);
router.get('/:id', authenticate, isAdmin, TransactionController.getById);
router.patch('/:id/confirm', authenticate, isAdmin, TransactionController.confirm);
router.patch('/:id/reject', authenticate, isAdmin, TransactionController.reject);

module.exports = router;
