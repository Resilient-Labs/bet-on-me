

const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");


// using test user
router.get("/create-test", async (req, res) => {
  try {
    const testUser = await User.create({
      userName: "testuser",
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });

    res.send(`
      <h2>Test user created!</h2>
      <p>User ID: ${testUser._id}</p>
      <a href="/users/profile/${testUser._id}">➡ Go to Profile Page</a>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating test user");
  }
});

// View Profile Page with Clusters!
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();

    if (!user) return res.status(404).send("User not found");

    // Find all clusters this user is a member of!!
    const Cluster = require("../models/Cluster");
    const userClusters = await Cluster.find({
      
      cluster_members: req.params.id,
    }).lean();

    res.render("profilePage", { 
      user,
      clusters: userClusters 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading profile");
  }
});

// upload and update profile images
router.post(
  "/update-picture/:id",
  upload.single("profile_image"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) return res.status(404).json({ msg: "User not found" });
      if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

      // Delete old image if it exists
      if (user.image_id) {
        await cloudinary.uploader.destroy(user.image_id);
      }

      // Upload new image
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures",
      });

      // Save new image data
      user.profile_image = uploaded.secure_url;
      user.image_id = uploaded.public_id;

      await user.save();

      res.redirect(`/users/profile/${user._id}`); // Redirect(lol redirect) back to profile page
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
