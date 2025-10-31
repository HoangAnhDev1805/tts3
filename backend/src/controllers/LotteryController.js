const { LotteryResult } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const LotteryService = require('../services/LotteryService');
const { formatDate } = require('../utils/helpers');

class LotteryController {
  /**
   * Get lottery results by date
   */
  async getByDate(req, res) {
    try {
      const { date } = req.params;
      const result = await LotteryResult.findOne({ date });

      if (!result) {
        // Try to crawl if not found
        try {
          await LotteryService.crawlAllRegions(date);
          const newResult = await LotteryResult.findOne({ date });
          return successResponse(res, newResult || null);
        } catch (crawlError) {
          return errorResponse(res, 'Lottery result not found', 404);
        }
      }

      return successResponse(res, result);
    } catch (error) {
      console.error('Get lottery result error:', error);
      return errorResponse(res, 'Failed to get lottery result', 500);
    }
  }

  /**
   * Get latest results
   */
  async getLatest(req, res) {
    try {
      const results = await LotteryResult.find()
        .sort({ date: -1 })
        .limit(7);

      return successResponse(res, results);
    } catch (error) {
      console.error('Get latest results error:', error);
      return errorResponse(res, 'Failed to get latest results', 500);
    }
  }

  /**
   * Crawl lottery results for specific date (Admin only)
   */
  async crawl(req, res) {
    try {
      const { date } = req.body;
      const targetDate = date || formatDate(new Date());

      const results = await LotteryService.crawlAllRegions(targetDate);

      return successResponse(res, results, 'Lottery results crawled');
    } catch (error) {
      console.error('Crawl lottery error:', error);
      return errorResponse(res, 'Failed to crawl lottery results', 500);
    }
  }

  /**
   * Get results by date range
   */
  async getByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const filter = {};
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = startDate;
        if (endDate) filter.date.$lte = endDate;
      }

      const results = await LotteryResult.find(filter).sort({ date: -1 });

      return successResponse(res, results);
    } catch (error) {
      console.error('Get results by range error:', error);
      return errorResponse(res, 'Failed to get results', 500);
    }
  }

  /**
   * Get result by region and date
   */
  async getByRegionAndDate(req, res) {
    try {
      const { region, date } = req.params;

      const result = await LotteryResult.findOne({ region, date });

      if (!result) {
        return errorResponse(res, 'Result not found', 404);
      }

      return successResponse(res, result[region]);
    } catch (error) {
      console.error('Get result by region error:', error);
      return errorResponse(res, 'Failed to get result', 500);
    }
  }

  /**
   * Get today's results
   */
  async getToday(req, res) {
    try {
      const today = formatDate(new Date());
      const result = await LotteryResult.findOne({ date: today });

      if (!result) {
        // Try to crawl today's results
        try {
          await LotteryService.crawlAllRegions(today);
          const newResult = await LotteryResult.findOne({ date: today });
          return successResponse(res, newResult || { date: today, mb: null, mt: null, mn: null });
        } catch (crawlError) {
          return successResponse(res, { date: today, mb: null, mt: null, mn: null });
        }
      }

      return successResponse(res, result);
    } catch (error) {
      console.error('Get today results error:', error);
      return errorResponse(res, 'Failed to get today results', 500);
    }
  }
}

module.exports = new LotteryController();
