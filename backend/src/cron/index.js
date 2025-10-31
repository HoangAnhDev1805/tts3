const cron = require('node-cron');
const LotteryService = require('../services/LotteryService');
const { User } = require('../models');
const { USER_STATUS } = require('../config/constants');
const { formatDate } = require('../utils/helpers');
const { broadcast } = require('../socket');

const setupCronJobs = () => {
  // Update lottery results daily at 18:00
  cron.schedule('0 18 * * *', async () => {
    console.log('⏰ Running lottery update cron job');
    try {
      const date = formatDate(new Date());
      const results = await LotteryService.crawlAllRegions(date);
      
      // Broadcast to all connected clients
      broadcast('lottery-result-updated', { date, results });
      
      console.log('✅ Lottery results updated');
    } catch (error) {
      console.error('❌ Error updating lottery results:', error);
    }
  });

  // Check expired users daily at 00:00
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running expired users check cron job');
    try {
      const result = await User.updateMany(
        { expiryDate: { $lt: new Date() }, status: { $ne: USER_STATUS.EXPIRED } },
        { $set: { status: USER_STATUS.EXPIRED } }
      );
      
      console.log(`✅ Updated ${result.modifiedCount} expired users`);
    } catch (error) {
      console.error('❌ Error checking expired users:', error);
    }
  });

  // Cleanup trial users (expired > 7 days) daily at 00:00
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running trial cleanup cron job');
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const result = await User.deleteMany({
        role: 'trial',
        expiryDate: { $lt: sevenDaysAgo },
      });
      
      console.log(`✅ Cleaned up ${result.deletedCount} trial users`);
    } catch (error) {
      console.error('❌ Error cleaning up trial users:', error);
    }
  });

  console.log('✅ Cron jobs scheduled');
};

module.exports = { setupCronJobs };
