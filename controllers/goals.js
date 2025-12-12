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
