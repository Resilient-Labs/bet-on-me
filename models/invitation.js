/**
 * Invitation js file
 * This invitation schema represents an invitation sent to a user to join
 * @author Innocent
 */
const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema({
//    The user who RECEIVES the invitation.
  invitedUser: {
    type: mongoose.Schema.Types.ObjectId,
    // telling the Mongoose to populate this with User data
    ref: "User", 
    required: true,
  },
//    The cluster (or squad) the user is being invited to join.
  cluster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cluster", // Connects invite to the correct squad
    required: true,
  },

//    The user who SENT the invitation which helps tract invitation history and permissions.
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // knowing who initiated the invite
    required: true,
  },

//   Tracking the current status of the invitation so the app knows who accepted, declined or haven't responded yet
//   The enum ensures only valid statuses can be saved.
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending", 
  },

//    Time the invitation was created.
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Invitation", invitationSchema);
