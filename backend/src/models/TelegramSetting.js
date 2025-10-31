const mongoose = require('mongoose');

const telegramSettingSchema = new mongoose.Schema(
  {
    botToken: {
      type: String,
    },
    botUsername: {
      type: String,
    },
    webhookUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    lastTestDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const TelegramSetting = mongoose.model('TelegramSetting', telegramSettingSchema);

module.exports = TelegramSetting;
