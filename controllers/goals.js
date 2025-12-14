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

  createOrUpdateGoal: async (req, res) => {
    try {
      const { name, description, completed } = req.body;

      const updatedGoal = await Goal.findOneAndUpdate({
        user: req.user.id,
      }, {
        name
      })
      console.log(updatedGoal)

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
  completeGoal: async (req, res) => {
    try {
      const goalId = req.params.id;

      console.log("goalId:", goalId);

      // Make sure missionId exists
      if (!goalId || goalId.trim() === "") {
        console.log("goalId is missing or empty");
        return res.redirect("/userGoal");
      }

      // Grab mission info
      const goal = await Goal.findById(goalId).lean();
      console.log("goal from DB:", goal);

      if (!goal) {
        console.log("goal not found in database");
        return res.redirect("userGoal");
      }


      // Update mission status
      const updateGoal = await Goal.findOneAndUpdate(
        {
          _id: goalId,
          "complete": false,
        },
        {
          $set: { "completedAt": new Date(), "complete": true },
        },
        { new: true }
      );

      if (!updateGoal) {
        console.log("failed to update goal status");
        return res.redirect("/userGoal");
      }

      console.log("Goal marked as complete:", updateGoal);

    } catch (err) {
      console.log("Error in completeStudentMission:", err);
      return res.redirect("/userGoal");
    }
  },

  //on Backend - if the name is empty = ignore Goal value

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
