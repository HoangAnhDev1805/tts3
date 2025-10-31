const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/SettingsController');
const { authenticate, isAdmin, optionalAuth } = require('../middlewares');

// Website settings
router.get('/website', optionalAuth, SettingsController.getWebsite);
router.patch('/website', authenticate, isAdmin, SettingsController.updateWebsite);

// Telegram settings
router.get('/telegram', authenticate, isAdmin, SettingsController.getTelegram);
router.patch('/telegram', authenticate, isAdmin, SettingsController.updateTelegram);

module.exports = router;
