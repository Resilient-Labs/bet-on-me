const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  name: {type: String},
  profile_image: {
    type: String,
    // fallback image for users if they dont put a profile picture
    default: "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
  },
  image_id: {type: String},
  joined_clusters: {type: [String]},
  tasks_isCompleted: {type: [Boolean]},
});

// Password hash middleware - Mongoose 9 compatible
UserSchema.pre("save", async function () {
  const user = this;
  
  // If password hasn't been modified, skip hashing
  if (!user.isModified("password")) {
    return;
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  } catch (err) {
    throw err;
  }
});

// Helper method for validating user's password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);