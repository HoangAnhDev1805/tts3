module.exports = {
  ...require('./auth'),
  ...require('./checkRole'),
  checkExpiry: require('./checkExpiry'),
  ...require('./errorHandler'),
  upload: require('./upload'),
};
