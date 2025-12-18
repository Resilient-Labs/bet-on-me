const express = require("express");
const router = express.Router();
const goalsController = require("../controllers/goals");
const { ensureAuth } = require("../middleware/auth");

router.post("/", ensureAuth, goalsController.createOrUpdateGoal);
router.get("/test/:id", ensureAuth, goalsController.getCluster)
router.delete("/:id", ensureAuth, goalsController.deleteGoal);
// router.put("/:id", ensureAuth, goalsController.updateGoal);
router.put("/complete/:id", ensureAuth, goalsController.completeGoal);

module.exports = router;
