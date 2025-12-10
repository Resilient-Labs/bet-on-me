const Task = require("../models/Task");

module.exports = {
  getUserTasks: async (userId) => {
    try {
      return await Task.find({ user: userId });
    } catch (err) {
      console.log(err);
    }
  },
};
