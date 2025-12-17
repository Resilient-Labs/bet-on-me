const User = require("../models/User");
const Cluster = require("../models/Cluster");
const cloudinary = require("../middleware/cloudinary");
const Goal = require("../models/Goal");
const Task = require("../models/Task"); // ← ADD THIS


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      req.flash("error_msg", "User not found");
      return res.redirect("/");
    }
    const clusters = await Cluster.find({
      cluster_members: req.params.id,
    })
      .populate("cluster_members")
      .lean();
    const goals = (await Goal.find({ user: req.params.id }).lean()) || [];
    const tasks = (await Task.find({ user: req.params.id }).lean()) || []; // ← ADD THIS
    res.render("userGoal", {
      user,
      clusters,
      goals,
      tasks, // ← ADD THIS
    });
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Could not load profile");
    res.redirect("/");
  }
};
exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.redirect("/profile");
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    // delete old image if it exists
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
    res.redirect("/profile");
  } catch (err) {
    console.error("Error updating profile picture:", err);
    res.status(500).send("Error updating profile picture");
  }
};
//delete user account logic --Innocent
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    // Delete user
    await User.findByIdAndDelete(userId);
    // OPTIONAL (recommended cleanup)
    await Cluster.updateMany(
      { cluster_members: userId },
      { $pull: { cluster_members: userId }, $inc: { member_count: -1 } }
    );
    // Destroy session
    req.logout(() => {
      req.session.destroy(() => {
        res.redirect("/");
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting account");
  }
};




