const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Goal = require("../models/Goal");

module.exports = {
  // create a checkout session for goal wager
  createCheckoutSession: async (req, res) => {
    try {
      const { amount, goalId, goalName } = req.body;

      // validate amount
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const amountNum = parseFloat(amount);

      // check if whole number
      if (!Number.isInteger(amountNum)) {
        return res.status(400).json({
          error: "Amount must be a whole dollar amount (no cents)",
        });
      }
      // check maximum
      if (amountNum > 999) {
        return res.status(400).json({
          error: "Maximum wager amount is $999",
        });
      }

      // check minimum
      if (amountNum < 1) {
        return res.status(400).json({
          error: "Minimum wager amount is $1",
        });
      }

      // convert amount to cents (Stripe uses smallest currency unit)
      const amountInCents = Math.round(amountNum * 100);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Goal: ${goalName}`,
                description: "Raise the stakes",
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.protocol}://${req.get(
          "host"
        )}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get(
          "host"
        )}/userGoal?canceled=true`,
        client_reference_id: goalId,
        metadata: {
          userId: req.user.id.toString(),
          goalId: goalId.toString(),
          amount: amount.toString(),
        },
      });

      res.json({ url: session.url });
    } catch (err) {
      console.error("Stripe checkout error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // handle successful payment
  handleSuccess: async (req, res) => {
    try {
      const { session_id } = req.query;

      if (!session_id) {
        req.flash("errors", { msg: "Invalid session." });
        return res.redirect("/userGoal");
      }

      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status === "paid") {
        // update goal with payment info
        const goalId = session.client_reference_id;
        await Goal.findByIdAndUpdate(goalId, {
          wagerAmount: parseFloat(session.metadata.amount),
          wagerPaid: true,
          stripeSessionId: session_id,
        });

        req.flash("success", {
          msg: "Payment successful! Your wager has been placed.",
        });
      } else {
        req.flash("errors", { msg: "Payment not completed." });
      }

      res.redirect("/userGoal");
    } catch (err) {
      console.error("Success handler error:", err);
      req.flash("errors", { msg: "Error processing payment confirmation." });
      res.redirect("/userGoal");
    }
  },

  // Webhook to handle Stripe events
  handleWebhook: async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      // construct event from raw body and signature
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("Payment completed:", session.id);

        // update goal with payment info
        if (session.payment_status === "paid") {
          try {
            const goalId = session.client_reference_id;
            const updatedGoal = await Goal.findByIdAndUpdate(
              goalId,
              {
                wagerAmount: parseFloat(session.metadata.amount),
                wagerPaid: true,
                stripeSessionId: session.id,
              },
              { new: true }
            );
            console.log("Goal updated:", updatedGoal?._id);
          } catch (dbErr) {
            console.error("Database update error:", dbErr);
          }
        }
        break;

      case "checkout.session.async_payment_succeeded":
        console.log("Async payment succeeded:", event.data.object.id);
        // handle async payment success (ACH)
        break;

      case "checkout.session.async_payment_failed":
        console.log("Async payment failed:", event.data.object.id);
        // handle async payment failure
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  },

  // get payment status
  getPaymentStatus: async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      res.json({
        status: session.payment_status,
        amount: session.amount_total / 100,
      });
    } catch (err) {
      console.error("Error retrieving payment status:", err);
      res.status(500).json({ error: err.message });
    }
  },
};
