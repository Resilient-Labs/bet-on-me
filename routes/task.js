/**
 * Task Routes
 * Handles task-related routes and logic
 * Used in userProfile.ejs for task creation
 */

// Required modules
const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasks");
const upload = require("../middleware/multer");
const { ensureAuth } = require("../middleware/auth");

// Handle direct GET requests to the createTask URL by redirecting
router.get("/createTask", ensureAuth, (req, res) => {
    return res.redirect("/profile");
});

// Create a new task (limit enforced in controller)
router.post("/createTask",ensureAuth, upload.single("file"), tasksController.createTask); 

// Delete a task by id
router.delete("/:id", ensureAuth, tasksController.deleteTask);

module.exports = router;