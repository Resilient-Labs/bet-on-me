/**
 * MoneyJar routes file
 * The file connects URLs to controller functions
 * @author Innocent
 */
const express = require("express");
const router = express.Router();
const moneyJarController = require("../controllers/moneyJarController");

// Creating jar for a squad
router.post("/", moneyJarController.createMoneyJar);

// User deposits money
router.post("/:jarId/deposit", moneyJarController.deposit);

// Process payouts after challenge ends
router.post("/:jarId/payouts", moneyJarController.processPayouts);

module.exports = router;
