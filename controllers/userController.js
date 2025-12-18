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
const nodemailer = require('nodemailer');
require("dotenv").config({ path: "./config/.env" });

// Goodbye email function
const sendGoodbyeEmail = async (email, userName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS
    }
  });

  const mailOptions = {
    from: 'betonmemailer@gmail.com',
    to: email,
    subject: 'Sorry to see you go!',
    html: `<p>Hi ${userName},</p>
    <p>We're sorry to see you go! Your Bet On Me account has been successfully deleted.</p>
    <p>We hope you achieved some great goals during your time with us! If you ever want to come back, we'll be here to see you strive.</p>
    <img src="cid:BOMLogo" alt="Bet On Me Logo">
    <p>Take care,<br>The Bet On Me Team</p>`,
    attachments: [
      {
        filename: "logo.png",
        path: "public/imgs/logo.png",
        cid: "BOMLogo"
      }
    ]
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('Goodbye email sent to:', email);
  } catch (error) {
    console.error('Error sending goodbye email:', error);
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user info before deleting (for email)
    const user = await User.findById(userId);
    const userEmail = user.email;
    const userName = user.userName;
    
    // Delete user
    await User.findByIdAndDelete(userId);
    
    // OPTIONAL (recommended cleanup)
    await Cluster.updateMany(
      { cluster_members: userId },
      { $pull: { cluster_members: userId }, $inc: { member_count: -1 } }
    );
    
    // Send goodbye email (don't await - let it send in background)
    sendGoodbyeEmail(userEmail, userName);
    
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




