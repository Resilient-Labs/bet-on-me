const User = require("../models/User");
const Cluster = require("../models/Cluster");
const cloudinary = require("../middleware/cloudinary");


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

// get user profile page
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).send("User not found");

    const userClusters = await Cluster.find({
      cluster_members: req.params.id,
    }).lean();

    res.render("profilePage", {
      user,
      clusters: userClusters,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading profile");
  }
};

// update profile pic
exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.redirect("/userGoal");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // delete old image
    if (user.image_id) {
      await cloudinary.uploader.destroy(user.image_id);
    }

    // upload new image
    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pictures",
    });

    user.profile_image = uploaded.secure_url;
    user.image_id = uploaded.public_id;

    await user.save();

    res.redirect("/userGoal");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating profile picture");
  }
};
