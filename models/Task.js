const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const taskSchema = new mongoose.Schema({
  task_name: {
    type: String,
    required: true,
  },
  task_is_completed: {
    type: Boolean,
    required: true,
  },
  creator_user_id: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  goal_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Goal",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);
