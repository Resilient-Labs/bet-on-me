const mongoose = require("mongoose");

const clusterSchema = new mongoose.Schema({
  cluster_name: {
    type: String,
    required: true,
  },
  creator_user_id:{
    type: String,
    required: true,
  },
  cluster_join_id:{
    type: String,
    required: true,
  },
  cluster_members: {
  type: [String],
  default: [],
  },
  member_count: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cluster", clusterSchema);
