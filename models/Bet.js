const mongoose = require("mongoose");

const clusterSchema = new mongoose.Schema({
  bet_amount:{
    type: Number,
    required: true,
  },
  creator_user_id:{
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cluster", clusterSchema);
