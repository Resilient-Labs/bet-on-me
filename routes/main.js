const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const tasksController = require("../controllers/tasks");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
//this route will lead to the page where user can create a cluster!
router.get("/createCluster", ensureAuth, postsController.getClusterCreationPage);
//this route will lead to the user profile!
router.get("/userProfile", ensureAuth, postsController.getUserProfile);
router.get("/feed", ensureAuth, postsController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/task/:id/edit", ensureAuth, tasksController.editPage);
router.post("/task/:id", ensureAuth, tasksController.updateTask);

module.exports = router;
