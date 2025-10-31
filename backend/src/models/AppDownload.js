const mongoose = require('mongoose');

const appDownloadSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ['ios', 'android'],
      required: true,
      index: true,
    },
    version: {
      type: String,
      required: true,
    },
    downloadUrl: {
      type: String,
      required: true,
    },
    qrCode: {
      type: String,
    },
    releaseNotes: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const AppDownload = mongoose.model('AppDownload', appDownloadSchema);

module.exports = AppDownload;
