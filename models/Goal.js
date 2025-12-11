const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  //users who are participating in the goal
  goal_participants: {
    type: [String],
    require: true,
  },
  //time goal was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Goal", goalSchema);
