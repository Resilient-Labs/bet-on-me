// shawn
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

exports.updateProfilePicture = async (req, res) => {
  try {

    // get user by their id
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // If users already has a profile image stored in Cloudinary, remove the old file so we don't leave unused images behind
    if (user.image_id) {
      await cloudinary.uploader.destroy(user.image_id);
    }

    // Upload the new image that Multer stored in req.file.path.
    // This saves it to the profile_pictures folder in Cloudinary!!
    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pictures",
    });

    // Update the user's document with the new image URL and Cloudinary ID.
    // The public_id is important because we need it when deleting or replacing images.
    user.profile_image = uploaded.secure_url;
    user.image_id = uploaded.public_id;

    // Save the updated user document.
    await user.save();

    // Return the updated image info to the client.
    return res.json({
      msg: "Profile picture updated successfully",
      profile_image: user.profile_image,
    });

  } catch (err) {
    // If anything goes wrong (Cloudinary, DB, file handling, etc.),
    // log it and return a server error response.
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
