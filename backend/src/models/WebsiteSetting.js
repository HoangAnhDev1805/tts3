const mongoose = require('mongoose');

const websiteSettingSchema = new mongoose.Schema(
  {
    // SEO
    title: {
      type: String,
      default: '3DAIXS.COM - Hệ thống quản lý lô đề',
    },
    description: {
      type: String,
      default: 'Hệ thống quản lý và tính tiền lô đề chuyên nghiệp',
    },
    keywords: {
      type: [String],
      default: ['lô đề', 'xổ số', 'quản lý', 'tính tiền'],
    },
    logo: {
      type: String,
    },
    favicon: {
      type: String,
    },
    ogImage: {
      type: String,
    },
    twitterImage: {
      type: String,
    },

    // Analytics
    googleAnalyticsId: {
      type: String,
    },
    facebookPixelId: {
      type: String,
    },

    // Custom scripts
    customCSS: {
      type: String,
    },
    customJS: {
      type: String,
    },
    headerScripts: {
      type: String,
    },
    footerScripts: {
      type: String,
    },

    // SMTP
    smtp: {
      host: String,
      port: Number,
      username: String,
      password: String,
      fromEmail: String,
      fromName: String,
    },
  },
  {
    timestamps: true,
  }
);

const WebsiteSetting = mongoose.model('WebsiteSetting', websiteSettingSchema);

module.exports = WebsiteSetting;
