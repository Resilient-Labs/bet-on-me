/**
 * Bets Model
 * This file defines the schema for the Bet model in the application.
 * @author Winnie Yu
 */

const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

/**
 * Bet Schema
 */
const betSchema = new mongoose.Schema({
  // Reference to the User who placed the bet
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // Description of the bet
  betAmount: { // e.g., "5"
    type: String,
    require: true,
  },
  // Date when the bet was created
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Bet", betSchema);
