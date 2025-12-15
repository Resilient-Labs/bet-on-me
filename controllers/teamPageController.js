const Cluster = require("../models/Cluster");
const Goal = require("../models/Goal");
const Task = require("../models/Task");
const User = require("../models/User");


function getDuration(createdAt, endAt) {
  const diffMs = endAt - createdAt;

  return {
    hours: Math.floor(diffMs / (1000 * 60 * 60)),
    minutes: Math.floor((diffMs / (1000 * 60)) % 60),
    seconds: Math.floor((diffMs / 1000) % 60)
  };
}
module.exports = {
  getTeamPage: async (req, res) => {
    try {
      const cluster = await Cluster.findOne({
        cluster_members: req.user.id,
      });

      if (!cluster) {
        return res.status(404).send("Team not found");
      }
      const duration = getDuration(
        cluster.createdAt,
        cluster.endDate || new Date()
      );
      console.log("Cluster duration:", duration);
      // Fetch goals and tasks for each member to get wager amounts and progress
      const membersWithGoals = await Promise.all(
        cluster.cluster_members.map(async (member) => {
          // Get member's main goal for wager amount
          const goals = await Goal.find({ user: member._id }).lean();
          const mainGoal = goals.length > 0 ? goals[0] : null;
          const user = await User.findById(member);

          // Get member's tasks to calculate progress
          const tasks = await Task.find({ user: member._id }).lean();
          const completedTasks = tasks.filter(task => task.task_is_completed).length;
          const progress = tasks.length > 0
            ? Math.round((completedTasks / tasks.length) * 100)
            : 0;

          return {
            username: user.userName,
            wagerAmount: mainGoal?.wagerAmount || 0,
            wagerPaid: mainGoal?.wagerPaid || false,
            progress: progress,
            duration: duration
          };
        })
      );
      console.log(req.user);

      res.render("teamPage.ejs", {
        user: req.user,
        cluster,
        members: membersWithGoals,
        duration
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error loading team page");
    }
  },
  getTeamData: async (req, res) => {
    try {
      const cluster = await Cluster.findOne({
        cluster_members: req.user.id,
      });

      if (!cluster) {
        return res.status(404).send("Team not found");
      }
      const duration = getDuration(
        cluster.createdAt,
        cluster.endDate || new Date()
      );
      // Fetch goals and tasks for each member to get wager amounts and progress
      const membersWithGoals = await Promise.all(
        cluster.cluster_members.map(async (member) => {
          // Get member's main goal for wager amount
          const goals = await Goal.find({ user: member._id }).lean();
          const mainGoal = goals.length > 0 ? goals[0] : null;
          const user = await User.findById(member);

          // Get member's tasks to calculate progress
          const tasks = await Task.find({ user: member._id }).lean();
          const completedTasks = tasks.filter(task => task.task_is_completed).length;
          const progress = tasks.length > 0
            ? Math.round((completedTasks / tasks.length) * 100)
            : 0;

          return {
            username: user.userName,
            wagerAmount: mainGoal?.wagerAmount || 0,
            wagerPaid: mainGoal?.wagerPaid || false,
            progress: progress
          };
        })
      );

      res.json({
        cluster,
        members: membersWithGoals,
        duration
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error loading team data");
    }},
        deleteTeamData: async (req, res) => {
      try {
        // Find the cluster by ID
        const cluster = await Cluster.findById(req.params.id);
        
        if (!cluster) {
          return res.status(404).send("Team not found");
        }
    
        // Optional: Verify the user has permission to delete (e.g., is the cluster creator)
        if (cluster.user.toString() !== req.user.id) {
          return res.status(403).send("Unauthorized to delete this team");
        }
    
        // Delete the cluster
        await Cluster.deleteOne({ _id: req.params.id });
    
        // Redirect to profile or success page
        res.redirect("/profile");
      } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting team");
      }
    }
};