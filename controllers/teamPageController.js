const Cluster = require("../models/Cluster");
const Goal = require("../models/Goal");
const Task = require("../models/Task");

module.exports = {
  getTeamPage: async (req, res) => {
    try {
      const cluster = await Cluster.findById(req.params.clusterId)
        .populate("cluster_members")
        .lean();

      if (!cluster) {
        return res.status(404).send("Team not found");
      }

      // Fetch goals and tasks for each member to get wager amounts and progress
      const membersWithGoals = await Promise.all(
        cluster.cluster_members.map(async (member) => {
          // Get member's main goal for wager amount
          const goals = await Goal.find({ user: member._id }).lean();
          const mainGoal = goals.length > 0 ? goals[0] : null;

          // Get member's tasks to calculate progress
          const tasks = await Task.find({ user: member._id }).lean();
          const completedTasks = tasks.filter(task => task.completed).length;
          const progress = tasks.length > 0 
            ? Math.round((completedTasks / tasks.length) * 100) 
            : 0;

          return {
            ...member,
            wagerAmount: mainGoal?.wagerAmount || 0,
            wagerPaid: mainGoal?.wagerPaid || false,
            progress: progress,
          };
        })
      );

      res.render("teamPage.ejs", {
        user: req.user,
        cluster,
        members: membersWithGoals,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error loading team page");
    }
  },
};