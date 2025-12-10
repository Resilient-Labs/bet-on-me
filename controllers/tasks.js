const Task = require("../models/Task");

module.exports = {
  // get all user's tasks
  getUserTasks: async (userId) => {
    try {
      return await Task.find({ user: userId });
    } catch (err) {
      console.log(err);
    }
  },

  // get one task by id
  getTaskById: async (taskId) => {
    try {
      return await Task.find({ _id: taskId });
    } catch (err) {
      console.log(err);
    }
  },

  // render edit task page
  editPage: async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.render("editTask.ejs", { task });
  },

  // update one task
  updateTask: async (req, res) => {
    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id, creator_user_id: req.user.id },
        {
          task_name: req.body.task_name,
        }
      );
      if (!updatedTask) {
        return res.status(404).send("Error: Task not found or Unauthorized");
      }

      res.redirect("/userProfile");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },
};
