const User = require("../models/User");
const Cluster = require("../models/Cluster");
const cloudinary = require("../middleware/cloudinary");

// Create a test user for development/testing
exports.createTestUser = async (req, res) => {
  try {
    const testUser = await User.create({
      userName: "testuser",
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });

    res.redirect(`/users/profile/${testUser._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating test user");
  }
};

// Get user profile with all clusters they've joined
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();

    if (!user) return res.status(404).send("User not found");

    // Find all clusters this user is a member of
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
};

// Update user's profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "User not found" });
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    // Delete old image if it exists
    if (user.image_id) {
      await cloudinary.uploader.destroy(user.image_id);
    }

    // Upload new image to Cloudinary
    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pictures",
    });

    // Save new image data
    user.profile_image = uploaded.secure_url;
    user.image_id = uploaded.public_id;

    await user.save();

    res.redirect(`/users/profile/${user._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


