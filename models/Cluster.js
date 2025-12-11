const mongoose = require("mongoose");

const clusterSchema = new mongoose.Schema({
  //name of the cluster
  cluster_name: {
    type: String,
    required: true,
  },
  //users particpating in the challenge
   challenge_participants:{
    type: [String],
    require: true,
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cluster", clusterSchema);
