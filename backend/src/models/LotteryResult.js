const mongoose = require('mongoose');

const lotteryResultSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      index: true,
    },
    region: {
      type: String,
      enum: ['mb', 'mt', 'mn'],
      required: true,
      index: true,
    },
    mb: {
      meta: {
        region: {
          code: String,
          name: String,
        },
        date: {
          original: String,
          formatted: String,
          display: String,
          dayOfWeek: String,
        },
      },
      prizes: {
        special_codes: [String],
        db: String,
        g1: String,
        g2: [String],
        g3: [String],
        g4: [String],
        g5: [String],
        g6: [String],
        g7: [String],
      },
    },
    mt: {
      meta: mongoose.Schema.Types.Mixed,
      prizes: mongoose.Schema.Types.Mixed,
    },
    mn: {
      meta: mongoose.Schema.Types.Mixed,
      prizes: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index
lotteryResultSchema.index({ date: 1, region: 1 }, { unique: true });
lotteryResultSchema.index({ date: -1 });

const LotteryResult = mongoose.model('LotteryResult', lotteryResultSchema);

module.exports = LotteryResult;
