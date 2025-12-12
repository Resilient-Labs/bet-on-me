/**
 * MoneyJarcontroller.js file
 * This file contains the business logic for handling requests related to money jars
 * @author Innocent
 */
const MoneyJar = require("../models/moneyjar");
const Cluster = require("../models/Cluster");

//creating new money jar. It starts when it is empty
exports.createMoneyJar = async (req, res) => {
  try {
    const { clusterId, createdByUserId } = req.body;

    // Validating that the cluster exists before creating a jar for it
    const cluster = await Cluster.findById(clusterId);
    if (!cluster) return res.status(404).json({ message: "Cluster not found" });

    // Creating a new money jar with default values
    const moneyJar = await MoneyJar.create({
      cluster: clusterId,   // Link jar to cluster
      participants: [],     // Empty until users deposit
      totalAmount: 0,       // Starts when it is empty
    });

    res.json({ message: "Money jar created", moneyJar });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//Depositing money into the money jar
exports.deposit = async (req, res) => {
  try {
    const { jarId } = req.params;
    const { userId, amount } = req.body;

    // Finding the jar by its ID
    const jar = await MoneyJar.findById(jarId);
    if (!jar) return res.status(404).json({ message: "Money jar not found" });

    // Checking if the user has already made a deposit before
    const participant = jar.participants.find(
      (p) => p.user.toString() === userId
    );

    if (participant) {
      // updating the balance and total if the user exists
      participant.amountBet += amount;
      participant.currentBalance += amount;
    } else {
      // creating new pacitipants if the user bets for the first time
      jar.participants.push({
        user: userId,
        amountBet: amount,
        currentBalance: amount,
      });
    }

    // Updating the money jar’s total amount
    jar.totalAmount += amount;

    // Adding a transaction to the jar history
    jar.transactions.push({
      user: userId,
      type: "deposit",
      amount,
    });

    // Persist changes
    await jar.save();

    res.json({ message: "Deposit successful", jar });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//Payout process which is also the end of the challenge or goal

exports.processPayouts = async (req, res) => {
  try {
    const { jarId } = req.params;

    // Fetching jar
    const jar = await MoneyJar.findById(jarId);
    if (!jar) return res.status(404).json({ message: "Money jar not found" });

    // Changing jar status to indicate payouts are done
    jar.jarStatus = "payouts_processed";

    // Going through each participant and determine payout
    jar.participants.forEach((p) => {
      if (p.taskCompleted) {
        //user wins the payout if he completes the task
        p.payoutStatus = "paid";
      } else {
        //user gets nothing if he fails to complete the task
        p.payoutStatus = "forfeited";
        p.currentBalance = 0;
      }
    });

    // Saving final results
    await jar.save();

    res.json({ message: "Payouts processed", jar });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
