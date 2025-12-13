const Goal = require("../models/Goal");

module.exports = {
  // get user goals
  getUserGoals: async (userId) => {
    try {
      return await Goal.find({ user: userId });
    } catch (err) {
      console.error(err);
    }
  },

  // Create / Update One Goal
  // get the name from the req.body
  // try to find one goal & update
  // if there is no goal, we will create it
  // redirect to createGoal
  createOrUpdateGoal : async (req, res) => {
    try {
      const { name, description, completed } = req.body;

      const updatedGoal = await Goal.findOneAndUpdate({
        user: req.user.id,
      },{
        name
      })
      console.log(updatedGoal)

      //if we don't hv the goal yet, disregard findone andupdate one bcs it's null

      //prevent submit if the input is empty
      //have the original name inside input field
      //if the name is empty on the backend, we just ignore

      if (updatedGoal == null) {
        const goal = await Goal.create({
        name,
        description,
        completed: completed || false,
        user: req.user.id,
      });
      }
      res.redirect("/userGoal");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },


  // create a goal
  createGoal: async (req, res) => {
    try {
      const { name, description, completed } = req.body;

      const goal = await Goal.create({
        name,
        description,
        completed: completed || false,
        user: req.user.id,
      });

      console.log("Goal created:", goal);
      res.redirect("/userGoal");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },

  // update a goal
  updateGoal: async (req, res) => {
    try {
      const { name, description, completed } = req.body;

      const updatedGoal = await Goal.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { name, description: description ?? "", completed: completed ?? false }
      );

      if (!updatedGoal) {
        return res.status(404).send("Goal not found or unauthorized");
      }

      res.status(200).json({ message: "Goal updated", goal: updatedGoal });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },

  // delete a goal
  deleteGoal: async (req, res) => {
    try {
      const deletedGoal = await Goal.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });

      if (!deletedGoal) {
        return res
          .status(404)
          .json({ error: "Goal not found or unauthorized" });
      }

      console.log("Deleted goal:", deletedGoal);
      res.status(200).json({ message: "Goal deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },
};
