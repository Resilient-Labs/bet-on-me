const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripe");
const { ensureAuth } = require("../middleware/auth");

// create checkout session
router.post("/create-checkout-session", ensureAuth, stripeController.createCheckoutSession);

// success page
router.get("/success", ensureAuth, stripeController.handleSuccess);

// webhook is already handled in server.js with raw body parser

// get payment status
router.get("/payment-status/:sessionId", ensureAuth, stripeController.getPaymentStatus);

// for withdrawal
router.post("/process-payout", ensureAuth, stripeController.withdrawalWallet);

module.exports = router;