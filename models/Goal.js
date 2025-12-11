const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  timer: {
    type: String,
    required: true,
  },
  goal_participants:{
    type: String,
    required: true,
  },
  cluster_join_id:{
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Goals", goalSchema);
