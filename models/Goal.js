const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
    maxlength: 150,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  // stripe payment fields
  wagerAmount: {
    type: Number,
    default: 0,
  },
  wagerPaid: {
    type: Boolean,
    default: false,
  },
  stripeSessionId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Goal", GoalSchema);