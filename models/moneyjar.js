/**
 * Money jar file
 * The file defines the schema for maoney jar. I includes the total money in the money jar, current balance of the user, payout status and more as commented below.
 * @author Innocent
 */

const mongoose = require("mongoose");

const moneyJarSchema = new mongoose.Schema({
  // The cluster this money jar belongs to
  cluster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cluster",
    required: true,
  },

  // different participants in the team with their contributions and task completion status
  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      //Adding money to money jar
      amountBet: {
        type: Number,
        required: true,
      },
      //checking if the user has completed the task or not
      taskCompleted: { 
        type: Boolean,
        default: false,
      },
      //payout upon money jar completion
      payoutStatus: {
        type: String,
        enum: ["pending", "paid", "forfeited"],
        default: "pending",
      }
    }
  ],

  // Total money currently in the jar
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },

  // Whether the challenge is finished and payouts are calculated
  jarStatus: {
    type: String,
    enum: ["open", "closed", "payouts_processed"],
    default: "open",
  },

  // Time created
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // ending the challenge
  endDate: {
    type: Date,
  },
  //keeping the balance inside participants array
  participants: [
  {
    user: ObjectId,
    amountBet: Number,
    taskCompleted: Boolean,
    payoutStatus: String,
    //user wallet after bid or user's current balance
    currentBalance: {
      type: Number,
      default: 0,
    }
  }
]

});

module.exports = mongoose.model("MoneyJar", moneyJarSchema);
