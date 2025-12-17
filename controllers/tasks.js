/**
 * Task Controller
 * Handles task-related logic and database interactions.
 * Used by routes/task.js
 */

const Task = require("../models/Task");
const Goal = require("../models/Goal");
const Cluster = require("../models/Cluster");

module.exports = {
  // get all user's tasks
  getUserTasks: async (userId) => {
    try {
      return await Task.find({ user: userId });
    } catch (err) {
      console.error(err);
    }
  },

  // get one task by id
  getTaskById: async (taskId) => {
    try {
      return await Task.find({ _id: taskId });
    } catch (err) {
      console.error(err);
    }
  },

  // update one task
  updateTask: async (req, res) => {
    const { task_name, task_is_completed } = req.body;

    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id, creator_user_id: req.user.id },
        { task_name, task_is_completed }
      );

      if (!updatedTask) {
        return res.status(404).send("Error: Task not found or Unauthorized");
      }

      // check if all tasks for goal have been completed
      if (task_is_completed && updatedTask.goal_id) {
        const allTasks = await Task.find({ goal_id: updatedTask.goal_id });
        const goalCompleted = allTasks.every((task) => task.task_is_completed);

        if (goalCompleted) {
          await Goal.findByIdAndUpdate(updatedTask.goal_id, {
            completed: true,
          });
        }

        // compute updated memberProgress for cluster
        let memberProgress = [];
        try {
          const cluster = await Cluster.findOne({ cluster_members: req.user.id }).populate('cluster_members').lean();
          if (cluster && cluster.cluster_members) {
            for (const member of cluster.cluster_members) {
              const total = await Task.countDocuments({ user: member._id });
              const completed = await Task.countDocuments({ user: member._id, task_is_completed: true });
              const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
              memberProgress.push({ userId: String(member._id), percent });
            }
          }
        } catch (e) {
          console.error('memberProgress compute failed', e);
        }

        return res.status(200).json({
          message: "Task updated",
          goalCompleted,
          memberProgress,
        });
      }

      // For non-goal-completing updates, still return memberProgress for realtime UI
      let memberProgress = [];
      try {
        const cluster = await Cluster.findOne({ cluster_members: req.user.id }).populate('cluster_members').lean();
        if (cluster && cluster.cluster_members) {
          for (const member of cluster.cluster_members) {
            const total = await Task.countDocuments({ user: member._id });
            const completed = await Task.countDocuments({ user: member._id, task_is_completed: true });
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            memberProgress.push({ userId: String(member._id), percent });
          }
        }
      } catch (e) {
        console.error('memberProgress compute failed', e);
      }

      res.status(200).json({
        message: "Task updated",
        goalCompleted: false,
        memberProgress,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },

  createTask: async (req, res) => {
    try {
      // enforce 6-task-per-user limit
      const taskCount = await Task.countDocuments({ user: req.user.id });
      if (taskCount >= 6) {
        console.log("User has reached the task limit");
        req.flash('error', 'Task limit reached (maximum 6 tasks).');
        return res.redirect('/userGoal');
      }

      const goal = await Goal.findOne({ user: req.user.id });

      // Create the task
      await Task.create({
        task_name: req.body.title,
        creator_user_id: req.user.id,
        task_is_completed: false,
        user: req.user.id,
        goal_id: goal.id,
      });

      // reset goal to not completed when a new task is added
      await Goal.findByIdAndUpdate(goal.id, {
        completed: false,
      });

      console.log("Task has been added!");

      return res.redirect("/userGoal");
    } catch (err) {
      console.log(err);
    }
  },
  // delete one task
  deleteTask: async (req, res) => {
    try {
      await Task.findOneAndDelete({
        _id: req.params.id,
        creator_user_id: req.user.id,
      });
      console.log("Deleted Task");
      return res.status(200).json({ message: "Task deleted" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  },
  //limit tasks to max 10 per user
  limitTask: async (userID) => {
    try {
      const taskCount = await Task.countDocuments({ user: userID });
      return taskCount < 6;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};
