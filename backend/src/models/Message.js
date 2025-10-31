const mongoose = require('mongoose');
const { MESSAGE_STATUS } = require('../config/constants');

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    regions: [{
      type: String,
      enum: ['mb', 'mt', 'mn'],
    }],
    parsed: {
      success: Boolean,
      lines: [{
        stt: Number,
        region: String,
        province: String,
        betType: String,
        number: String,
        points: Number,
        pricePerPoint: Number,
        totalBet: Number,
        payoutMB: Number,
        payoutMT: Number,
        payoutMN: Number,
      }],
      stats: {
        totalLines: Number,
        totalBet: Number,
        totalPayoutMB: Number,
        totalPayoutMT: Number,
        totalPayoutMN: Number,
        maxPayout: Number,
      },
    },
    result: {
      processed: {
        type: Boolean,
        default: false,
      },
      totalWin: {
        type: Number,
        default: 0,
      },
      totalLose: {
        type: Number,
        default: 0,
      },
      profit: {
        type: Number,
        default: 0,
      },
      details: [{
        lineIndex: Number,
        won: Boolean,
        winAmount: Number,
      }],
    },
    status: {
      type: String,
      enum: Object.values(MESSAGE_STATUS),
      default: MESSAGE_STATUS.PENDING,
      index: true,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
messageSchema.index({ userId: 1, date: -1 });
messageSchema.index({ contactId: 1, date: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
