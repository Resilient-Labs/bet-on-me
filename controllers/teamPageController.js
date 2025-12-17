const Cluster = require("../models/Cluster");
const Goal = require("../models/Goal");
const Task = require("../models/Task");
const User = require("../models/User");

/**
 * Utility: convert a start/end pair into an hours/minutes/seconds duration.
 * This is used only for initial challenge length, not for the live countdown.
 */
function getDuration(createdAt, endAt) {
  const diffMs = endAt - createdAt;

  return {
    hours: Math.floor(diffMs / (1000 * 60 * 60)),
    minutes: Math.floor((diffMs / (1000 * 60)) % 60),
    seconds: Math.floor((diffMs / 1000) % 60),
  };
}

/**
 * Utility: given a cluster with timerStartAt and timerDurationSec,
 * compute how many seconds remain in the shared countdown.
 */
function getRemainingSeconds(cluster) {
  if (!cluster.timerStartAt || !cluster.timerDurationSec) return 0;

  const now = Date.now();
  const start = cluster.timerStartAt.getTime();
  const elapsed = Math.floor((now - start) / 1000);
  return Math.max(0, cluster.timerDurationSec - elapsed);
}

/**
 * Utility: convert a number of seconds into { hours, minutes, seconds }.
 */
function secondsToHMS(totalSeconds) {
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

module.exports = {
  /**
   * GET /team
   * Render the team page with the shared countdown for this cluster.
   * All members of the same cluster will see the same remaining time.
   */
  getTeamPage: async (req, res) => {
    try {
      const cluster = await Cluster.findOne({
        cluster_members: req.user.id,
      });

      if (!cluster) {
        return res.status(404).send("Team not found");
      }

      // Compute remaining seconds from the shared timer fields
      const remainingSec = getRemainingSeconds(cluster);
      const duration = secondsToHMS(remainingSec);

      // Fetch goals and tasks for each member to get wager amounts and progress
      const membersWithGoals = await Promise.all(
        cluster.cluster_members.map(async (member) => {
          // Get member's main goal for wager amount
          const goals = await Goal.find({ user: member._id }).lean();
          const mainGoal = goals.length > 0 ? goals[0] : null;
          const user = await User.findById(member);

          // Get member's tasks to calculate progress
          const tasks = await Task.find({ user: member._id }).lean();
          const completedTasks = tasks.filter(
            (task) => task.task_is_completed
          ).length;
          const progress =
            tasks.length > 0
              ? Math.round((completedTasks / tasks.length) * 100)
              : 0;

          return {
            username: user.userName,
            wagerAmount: mainGoal?.wagerAmount || 0,
            wagerPaid: mainGoal?.wagerPaid || false,
            progress,
            // Optional: pass duration if template expects it per member
            duration,
          };
        })
      );

      res.render("teamPage.ejs", {
        user: req.user,
        cluster,
        members: membersWithGoals,
        duration, // shared remaining time for the whole cluster
        isCreator: cluster.user.toString() === req.user.id,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error loading team page");
    }
  },

  /**
   * GET /api/team-data
   * Returns JSON for the team dashboard, including the shared countdown state.
   *
   * Important:
   * - Initializes the shared timer ONCE per cluster, when it has no timer fields yet.
   * - Afterwards, it only reads timerStartAt / timerDurationSec and
   *   computes remaining time; it does not reset the timer on every request.
   */
  getTeamData: async (req, res) => {
    try {
      const cluster = await Cluster.findOne({
        cluster_members: req.user.id,
      });

      if (!cluster) {
        return res.status(404).send("Team not found");
      }

      // compute remainingSec from existing timer fields
      const remainingSec = getRemainingSeconds(cluster);
      const duration = secondsToHMS(remainingSec);

      const membersWithGoals = await Promise.all(
        cluster.cluster_members.map(async (member) => {
          const goals = await Goal.find({ user: member._id }).lean();
          const mainGoal = goals.length > 0 ? goals[0] : null;
          const user = await User.findById(member);
          const tasks = await Task.find({ user: member._id }).lean();
          const completedTasks = tasks.filter(t => t.task_is_completed).length;
          const progress = tasks.length > 0
            ? Math.round((completedTasks / tasks.length) * 100)
            : 0;

          return {
            userName: user.userName,
            wagerAmount: mainGoal?.wagerAmount || 0,
            wagerPaid: mainGoal?.wagerPaid || false,
            progress,
          };
        })
      );

      res.json({
        cluster,
        members: membersWithGoals,
        duration,                // remaining time; 0/0/0 if not started
        timerStartAt: cluster.timerStartAt, // may be null
        timerDurationSec: cluster.timerDurationSec, // may be null
        timerRunning: remainingSec > 0, // true if timer is active
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error loading team data");
    }
  },
  /**
   * 
   * POST /team/:id/startTimer
   * Starts the shared timer for the cluster.
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  startTeamTimer: async (req, res) => {
    try {
      const cluster = await Cluster.findOne({
        _id: req.params.id,
        user: req.user.id,          // only creator can start
      });

      if (!cluster) {
        return res.status(404).send("Team not found or not authorized");
      }

      // If already started, just return current state
      if (cluster.timerStartAt && cluster.timerDurationSec) {
        const remainingSec = getRemainingSeconds(cluster);
        return res.json({
          timerStartAt: cluster.timerStartAt,
          timerDurationSec: cluster.timerDurationSec,
          timerRunning: remainingSec > 0,
        });
      }

      // Define the challenge duration once (e.g. from createdAt to endDate)
      const endDate = cluster.endDate || new Date();
      const initialDuration = getDuration(cluster.createdAt, endDate);
      const durationSec =
        initialDuration.hours * 3600 +
        initialDuration.minutes * 60 +
        initialDuration.seconds;

      cluster.timerStartAt = new Date();
      cluster.timerDurationSec = durationSec;
      await cluster.save();

      const remainingSec = getRemainingSeconds(cluster);

      res.json({
        timerStartAt: cluster.timerStartAt,
        timerDurationSec: cluster.timerDurationSec,
        timerRunning: remainingSec > 0,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error starting team timer");
    }
  },
  /**
   * 
   * POST /team/:id/resetTimer
   * Resets the shared timer for the cluster.
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  resetTeamTimer: async (req, res) => {
    try {
      const cluster = await Cluster.findOne({
        _id: req.params.id,
        user: req.user.id,        // only creator can reset
      });
      console.log("Resetting timer for cluster:", req.params.id);
      console.log("Request by user:", req.user.id);
      console.log("Found cluster:", cluster);
      if (!cluster) {
        return res.status(404).send("Team not found or not authorized");
      }

      // Clear timer fields
      cluster.timerStartAt = null;
      cluster.timerDurationSec = null;
      await cluster.save();

      // res.json({ ok: true });
      res.redirect("/teamPage");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error resetting team timer");
    }
  },

  /**
   * POST /team/:id/delete
   * Deletes a cluster; only the creator may perform this action.
   */
  deleteTeamData: async (req, res) => {
    try {
      // Find the cluster by ID
      const cluster = await Cluster.findById(req.params.id);

      if (!cluster) {
        return res.status(404).send("Team not found");
      }

      // Verify the user has permission to delete (must be the creator)
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
  },

  /**
   * POST /team/:id/leave
   * Removes the current user from the cluster members.
   * The creator is not allowed to leave; they must delete the team instead.
   */
  leaveTeamData: async (req, res) => {
    try {
      const cluster = await Cluster.findById(req.params.id);

      if (!cluster) {
        return res.status(404).send("Team not found");
      }

      // Check if user is actually in the cluster
      if (
        !cluster.cluster_members.some(
          (member) => member._id.toString() === req.user.id
        )
      ) {
        return res.status(403).send("You are not a member of this team");
      }

      // Prevent creator from leaving (they must delete instead)
      if (cluster.user.toString() === req.user.id) {
        return res
          .status(403)
          .send("Creator cannot leave. Please delete the team instead.");
      }

      // Remove user from cluster_members array
      cluster.cluster_members = cluster.cluster_members.filter(
        (member) => member._id.toString() !== req.user.id
      );

      await cluster.save();

      res.redirect("/profile");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error leaving team");
    }
  },
};
