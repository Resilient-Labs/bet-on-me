const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const userController = require("../controllers/userController");
const { ensureAuth } = require("../middleware/auth");


// keep test route if you still want it
router.get("/create-test", userController.createTestUser);

// existing profile page (unchanged)
router.get("/profile/:id", userController.getProfile);

// ✅ NEW: update profile picture for logged-in user
router.post(
  "/update-picture",
  ensureAuth,
  upload.single("profile_image"),
  userController.updateProfilePicture
);

module.exports = router;
