/**
 * Task Controller
 * Handles task-related logic and database interactions.
 * Used by routes/task.js
 */


const Task = require("../models/Task");

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

      res.status(200).json({ message: "Task updated" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },
  createTask: async (req, res) => {
    try {
      // enforce 10-task-per-user limit
      const taskCount = await Task.countDocuments({ user: req.user.id });
      if (taskCount >= 10) {
        const tasks = await Task.find({ user: req.user.id });
        console.log("User has reached the task limit");
        return res.status(400).render("userGoal.ejs", {
          tasks: tasks,
          error: "Task limit reached (maximum 10 tasks).",
        });
      }

      // Create the task
      await Task.create({
        task_name: req.body.title,
        creator_user_id: req.user.id,
        task_is_completed: false,
        user: req.user.id,
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
      await Task.findOneAndDelete({ _id: req.params.id, creator_user_id: req.user.id });
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
      return taskCount < 10;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};
