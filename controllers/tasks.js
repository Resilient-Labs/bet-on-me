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
    const { task_name } = req.body;

    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id, creator_user_id: req.user.id },
        { task_name }
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
};
