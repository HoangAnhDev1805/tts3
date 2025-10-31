/**
 * Generate random string
 */
const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate trial username
 */
const generateTrialUsername = () => {
  return `trial_${Date.now()}`;
};

/**
 * Generate trial password
 */
const generateTrialPassword = () => {
  return generateRandomString(12);
};

/**
 * Format date to DD-MM-YYYY
 */
const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Parse date from DD-MM-YYYY
 */
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split('-');
  return new Date(year, month - 1, day);
};

/**
 * Calculate expiry date
 */
const calculateExpiryDate = (startDate, months) => {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + months);
  return date;
};

/**
 * Check if date is past
 */
const isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Format currency VND
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Slugify string
 */
const slugify = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

module.exports = {
  generateRandomString,
  generateTrialUsername,
  generateTrialPassword,
  formatDate,
  parseDate,
  calculateExpiryDate,
  isPastDate,
  formatCurrency,
  slugify,
};
