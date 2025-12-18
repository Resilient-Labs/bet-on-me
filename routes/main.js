const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const tasksController = require("../controllers/tasks");

const teamPageController = require("../controllers/teamPageController");

const { ensureAuth } = require("../middleware/auth");
const upload = require("../middleware/multer");




//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
// userGoal page (also available under /post/userGoal)
router.get("/userGoal", ensureAuth, postsController.getUserGoal);
//Main page after login
router.get("/home", ensureAuth, postsController.getHome);
//this route will lead to the page where user can create a cluster!
router.get("/createCluster", ensureAuth, postsController.getClusterCreationPage);




router.get("/teamPage", ensureAuth, teamPageController.getTeamPage);
router.get("/api/data", ensureAuth, teamPageController.getTeamData);
router.delete("/teamPage/deleteTeamData/:id", ensureAuth, teamPageController.deleteTeamData);
router.delete("/teamPage/leaveTeamData/:id", ensureAuth, teamPageController.leaveTeamData);
router.post("/teamPage/:id/startTimer",ensureAuth,teamPageController.startTeamTimer);
router.post("/teamPage/:id/resetTimer",ensureAuth,teamPageController.resetTeamTimer)

//this route will lead to the user profile!
router.get("/userProfile", ensureAuth, postsController.getUserProfile);
router.get("/feed", ensureAuth, postsController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
// this function leads to where a user can reset their password
router.post("/passwordReset", upload.single("file"), authController.forgotPassword);
// Routes for password reset flow (link sent by email)
router.get('/reset/:token', authController.renderReset);
router.post('/reset/:token', authController.resetPasswordPost);
// Change password (from profile modal)
router.post("/profile/changePassword", ensureAuth, authController.changePassword);
// this route allows users to edit a task
router.put("/task/:id", ensureAuth, tasksController.updateTask);

module.exports = router;