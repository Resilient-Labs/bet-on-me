/**
 * inviteController.js file
 * This file defines what happens when a user does something to an invitation. He may accept or decline the invite
 * @author Innocent
 */

const Invitation = require("../models/invitation");
const Cluster = require("../models/Cluster");
const User = require("../models/User");


//  Accepting an invite to join a cluster
 
exports.acceptInvite = async (req, res) => {
  try {
    // Getting the invite ID from the URL param
    const inviteId = req.params.id;

    // Finding the invitation document in the database
    const invitation = await Invitation.findById(inviteId);

    // returning 404 if the invitation does not exist
    if (!invitation)
      return res.status(404).json({ message: "Invite not found" });

    // Checking if invite is still pending. don't allow re-precessing if alread accepted or declined
    if (invitation.status !== "pending")
      return res.status(400).json({ message: "Invite already handled" });

    //Updating invite status to "accepted"
    invitation.status = "accepted";
    await invitation.save();

    
    //Adding user to the cluster they were invited to
     
    //  $addToSet ensures the user is not added twice.
     
    await Cluster.findByIdAndUpdate(invitation.cluster, {
      $addToSet: { cluster_members: invitation.invitedUser },
    });

    // Successfully accepted response
    return res.json({ message: "Invite accepted", invitation });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Declining an invite to join a cluster
 
exports.declineInvite = async (req, res) => {
  try {
    // Extracting invite id from route params
    const inviteId = req.params.id;

    // Looking up the invite in the database
    const invitation = await Invitation.findById(inviteId);

    // returning 404, if no invite found
    if (!invitation)
      return res.status(404).json({ message: "Invite not found" });

    // Changing status to declined
    invitation.status = "declined";
    await invitation.save();

    // Responding to the user
    return res.json({ message: "Invite declined" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
