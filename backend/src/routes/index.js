const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const contactRoutes = require('./contacts');
const messageRoutes = require('./messages');
const lotteryRoutes = require('./lottery');
const transactionRoutes = require('./transactions');
const packageRoutes = require('./packages');
const paymentMethodRoutes = require('./paymentMethods');
const settingsRoutes = require('./settings');

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/users', userRoutes);
router.use('/contacts', contactRoutes);
router.use('/messages', messageRoutes);
router.use('/lottery', lotteryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/packages', packageRoutes);
router.use('/payment-methods', paymentMethodRoutes);
router.use('/settings', settingsRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

module.exports = router;
