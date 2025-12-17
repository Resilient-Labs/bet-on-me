const Cluster = require("../models/Cluster");
const Goal = require("../models/Goal");
const Task = require("../models/Task");
const User = require("../models/User");
const MoneyJar = require("../models/moneyjar");

function getDuration(createdAt, endAt) {
  const diffMs = endAt - createdAt;

  return {
    hours: Math.floor(diffMs / (1000 * 60 * 60)),
    minutes: Math.floor((diffMs / (1000 * 60)) % 60),
    seconds: Math.floor((diffMs / 1000) % 60),
  };
}

module.exports = {
  getTeamPage: async (req, res) => {
    try {
      const cluster = await Cluster.findOne({
        cluster_members: req.user.id,
      }).lean();

      if (!cluster) {
        return res.status(404).send("Team not found");
      }

      const duration = getDuration(
        cluster.createdAt,
        cluster.endDate || new Date()
      );

      const membersWithGoals = await Promise.all(
        cluster.cluster_members.map(async (memberId) => {
          const user = await User.findById(memberId).lean();
          if (!user) return null;

          const goals = await Goal.find({ user: memberId }).lean();
          const mainGoal = goals.length ? goals[0] : null;

          const tasks = await Task.find({ user: memberId }).lean();
          const completed = tasks.filter(t => t.task_is_completed).length;
          const progress = tasks.length
            ? Math.round((completed / tasks.length) * 100)
            : 0;

          return {
            userName: user.userName,
            profile_image: user.profile_image,
            wagerAmount: mainGoal?.wagerAmount || 0,
            wagerPaid: mainGoal?.wagerPaid || false,
            progress,
            duration,
          };
        })
      );

      res.render("teamPage.ejs", {
        user: req.user,
        cluster,
        members: membersWithGoals.filter(Boolean),
        duration,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading team page");
    }
  },

  getTeamData: async (req, res) => {
    try {
      const cluster = await Cluster.findOne({
        cluster_members: req.user.id,
      }).lean();

      if (!cluster) {
        return res.status(404).send("Team not found");
      }

      const duration = getDuration(
        cluster.createdAt,
        cluster.endDate || new Date()
      );

      const membersWithGoals = await Promise.all(
        cluster.cluster_members.map(async (memberId) => {
          const user = await User.findById(memberId).lean();
          if (!user) return null;

          const goals = await Goal.find({ user: memberId }).lean();
          const mainGoal = goals.length ? goals[0] : null;

          const tasks = await Task.find({ user: memberId }).lean();
          const completed = tasks.filter(t => t.task_is_completed).length;
          const progress = tasks.length
            ? Math.round((completed / tasks.length) * 100)
            : 0;

          return {
            userName: user.userName,
            profile_image: user.profile_image,
            wagerAmount: mainGoal?.wagerAmount || 0,
            wagerPaid: mainGoal?.wagerPaid || false,
            progress,
          };
        })
      );

      res.json({
        cluster,
        members: membersWithGoals.filter(Boolean),
        duration,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading team data");
    }
  },

  deleteTeamData: async (req, res) => {
    try {
      const cluster = await Cluster.findById(req.params.id);

      if (!cluster) {
        return res.status(404).send("Team not found");
      }

      if (String(cluster.user) !== String(req.user.id)) {
        return res.status(403).send("Unauthorized");
      }

      await Cluster.deleteOne({ _id: req.params.id });
      res.redirect("/profile");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting team");
    }
  },
};
