const mongoose = require('mongoose');
const { DEFAULT_PRICING } = require('../config/constants');

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      index: true,
    },
    address: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'locked'],
      default: 'active',
      index: true,
    },
    debt: {
      type: Number,
      default: 0,
    },
    pricingConfig: {
      mb: {
        type: mongoose.Schema.Types.Mixed,
        default: () => JSON.parse(JSON.stringify(DEFAULT_PRICING.mb)),
      },
      mt: {
        type: mongoose.Schema.Types.Mixed,
        default: () => JSON.parse(JSON.stringify(DEFAULT_PRICING.mt)),
      },
      mn: {
        type: mongoose.Schema.Types.Mixed,
        default: () => JSON.parse(JSON.stringify(DEFAULT_PRICING.mn)),
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index
contactSchema.index({ userId: 1, phone: 1 });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
