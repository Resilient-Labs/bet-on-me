const mongoose = require("mongoose");

const clusterSchema = new mongoose.Schema({
  cluster_name: {
    type: String,
    required: true,
  },
   challenge_participants:{
    type: [String],
    require: true,
  },
  creator_user_id:{
    type: String,
    required: true,
  },
  cluster_join_id:{
    type: String,
    required: true,
  },
  cluster_members:{
    type: [String],
    required: true,
  },
  member_count:{
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cluster", clusterSchema);
