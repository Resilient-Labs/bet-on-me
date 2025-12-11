const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

router.post("/createPost", upload.single("file"), postsController.createPost);

router.post("/createCluster", upload.single("file"), postsController.createCluster);

router.post("/createTask", upload.single("file"), postsController.createTask);

router.put("/likePost/:id", postsController.likePost);

router.post("/passwordReset", postsController.changePassword);

router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
