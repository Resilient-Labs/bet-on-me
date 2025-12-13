const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const userController = require("../controllers/userController");

router.get("/create-test", userController.createTestUser);
router.get("/profile/:id", userController.getProfile);
router.post("/update-picture/:id", upload.single("profile_image"), userController.updateProfilePicture);

module.exports = router;