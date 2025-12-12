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

//RESOLVE - moved createTask to controllers/tasks.js @author Winnie


router.put("/likePost/:id", postsController.likePost);

router.delete("/deletePost/:id", postsController.deletePost);

router.post("/joinCluster", ensureAuth, postsController.joinCluster);
router.post("/leaveCluster/:id", ensureAuth, postsController.leaveCluster);


module.exports = router;
