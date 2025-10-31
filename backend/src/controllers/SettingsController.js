const { WebsiteSetting, TelegramSetting } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

class SettingsController {
  async getWebsite(req, res) {
    try {
      let settings = await WebsiteSetting.findOne();
      if (!settings) settings = await WebsiteSetting.create({});
      return successResponse(res, settings);
    } catch (error) {
      return errorResponse(res, 'Failed to get website settings', 500);
    }
  }

  async updateWebsite(req, res) {
    try {
      let settings = await WebsiteSetting.findOne();
      if (!settings) settings = await WebsiteSetting.create(req.body);
      else Object.assign(settings, req.body);
      await settings.save();
      return successResponse(res, settings, 'Settings updated');
    } catch (error) {
      return errorResponse(res, 'Failed to update settings', 500);
    }
  }

  async getTelegram(req, res) {
    try {
      let settings = await TelegramSetting.findOne();
      if (!settings) settings = await TelegramSetting.create({});
      return successResponse(res, settings);
    } catch (error) {
      return errorResponse(res, 'Failed to get telegram settings', 500);
    }
  }

  async updateTelegram(req, res) {
    try {
      let settings = await TelegramSetting.findOne();
      if (!settings) settings = await TelegramSetting.create(req.body);
      else Object.assign(settings, req.body);
      await settings.save();
      return successResponse(res, settings, 'Settings updated');
    } catch (error) {
      return errorResponse(res, 'Failed to update settings', 500);
    }
  }
}

module.exports = new SettingsController();
