const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const cloudinary = require("../config/cloudinary");

//debugging bc the damn file wont fkin load
console.log("testUpload.js ROUTER LOADED!");

// accept a post over a put
router.post("/test-upload/:id", upload.single("profile_image"), async (req, res) => {
  try {

    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pictures_test",
    });

    return res.json({
      msg: "Image uploaded successfully (TEST MODE)",
      id_used: req.params.id,
      cloudinary_url: uploaded.secure_url,
      cloudinary_id: uploaded.public_id
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
