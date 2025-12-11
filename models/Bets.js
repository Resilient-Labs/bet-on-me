/**
 * WalletService
 * Manages user balances, deposits, withdrawals, and betting validations.
 * Used by SquadService and HabitService. 
 * 
 * @author Winnie Yu
 */


const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

/**
 * Bet Schema
 */
const betSchema = new mongoose.Schema({
  //
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  //
  betAmount: { // e.g., "5"
    type: String,
    require: true,
  },
  //
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Bet", betSchema);
