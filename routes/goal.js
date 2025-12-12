const express = require("express");
const router = express.Router();
const goalsController = require("../controllers/goals");
const { ensureAuth } = require("../middleware/auth");

router.post("/", ensureAuth, goalsController.createGoal);
router.delete("/:id", ensureAuth, goalsController.deleteGoal);
router.put("/:id", ensureAuth, goalsController.updateGoal);

module.exports = router;
