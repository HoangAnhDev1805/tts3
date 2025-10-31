const express = require('express');
const router = express.Router();
const LotteryController = require('../controllers/LotteryController');
const { authenticate, isAdmin, optionalAuth } = require('../middlewares');

// Public or authenticated routes
router.get('/today', optionalAuth, LotteryController.getToday);
router.get('/latest', optionalAuth, LotteryController.getLatest);
router.get('/date/:date', optionalAuth, LotteryController.getByDate);
router.get('/region/:region/date/:date', optionalAuth, LotteryController.getByRegionAndDate);
router.get('/range', optionalAuth, LotteryController.getByDateRange);

// Admin only routes
router.post('/crawl', authenticate, isAdmin, LotteryController.crawl);

module.exports = router;
