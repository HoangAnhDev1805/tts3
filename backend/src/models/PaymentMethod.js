const mongoose = require('mongoose');
const { PAYMENT_TYPES } = require('../config/constants');

const paymentMethodSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(PAYMENT_TYPES),
      required: true,
    },
    bankName: {
      type: String,
      trim: true,
    },
    bankCode: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    accountName: {
      type: String,
      required: true,
      trim: true,
    },
    transferContent: {
      type: String,
      default: 'MUA_[PHONE]',
    },
    qrCode: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

module.exports = PaymentMethod;
