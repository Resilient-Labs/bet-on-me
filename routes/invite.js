/**
 * invite routes file
 * The file shows the url that trigger the invite logic
 * @author Innocent
 */
const express = require("express");
const router = express.Router();
const inviteController = require("../controllers/inviteController");

// Accepting invite
router.post("/:id/accept", inviteController.acceptInvite);

// Declining invite
router.post("/:id/decline", inviteController.declineInvite);

module.exports = router;
