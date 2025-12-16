const mongoose = require("mongoose");

const moneyJarSchema = new mongoose.Schema({
  cluster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cluster",
    required: true,
  },

  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      amountBet: {
        type: Number,
        required: true,
      },
      taskCompleted: {
        type: Boolean,
        default: false,
      },
      payoutStatus: {
        type: String,
        enum: ["pending", "paid", "forfeited"],
        default: "pending",
      },
      currentBalance: {
        type: Number,
        default: 0,
      }
    }
  ],

  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },

  jarStatus: {
    type: String,
    enum: ["open", "closed", "payouts_processed"],
    default: "open",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  endDate: Date,
});

module.exports = mongoose.model("MoneyJar", moneyJarSchema);
