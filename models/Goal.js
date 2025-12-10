const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  timer: {

  },
  goal_participants: {
    type: [String],
    require: true,
  },
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
