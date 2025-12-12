const express = require("express");
const router = express.Router();
const goalsController = require("../controllers/goals");
const { ensureAuth } = require("../middleware/auth");

router.post("/", ensureAuth, goalsController.createGoal);

module.exports = router;
