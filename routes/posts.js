const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
// router.get("/:id", ensureAuth, postsController.getPost);

router.get("/userGoal", ensureAuth, postsController.getUserGoal);

router.post("/createPost", upload.single("file"), postsController.createPost);

router.post("/createCluster", upload.single("file"), postsController.createCluster);

router.put("/likePost/:id", postsController.likePost);

router.post("/createTask", upload.single("file"), postsController.createTask);

router.delete("/deleteTask/:id", postsController.deleteTask);

module.exports = router;
