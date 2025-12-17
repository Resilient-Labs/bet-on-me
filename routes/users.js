const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const userController = require("../controllers/userController");
const { ensureAuth } = require("../middleware/auth");

// Profile page
router.get("/profile/:id", ensureAuth, userController.getProfile);

// Update profile picture
router.post(
  "/update-picture",
  ensureAuth,
  upload.single("profile_image"),
  userController.updateProfilePicture
);

//delete account route ---Innocent


router.post("/delete-account", ensureAuth, userController.deleteAccount);

module.exports = router;
