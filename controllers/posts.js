const cloudinary = require("../middleware/cloudinary");
const Cluster = require("../models/Cluster");
const Post = require("../models/Post");
const Task = require("../models/Task");
const { getUserTasks } = require("./tasks");

module.exports = {
  getUserGoal: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      const tasks = await Task.find({ user: req.user.id })
      res.render("userGoal.ejs", { posts: posts, user: req.user, tasks: tasks });
    } catch (err) {
      console.log(err);
    }
  },
  //this function gets the user profile, and the todo list of tasks!
  getUserProfile: async (req, res) => {
    try {
      const tasks = await getUserTasks(req.user.id);
      res.render("userProfile.ejs", { user: req.user, tasks });
    } catch (err) {
      console.log(err);
    }
  },
  //this function gets the cluster creation page!
  getClusterCreationPage: async (req, res) => {
    try {
      res.render("clusterCreation.ejs", { user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  //this function updates a cluser
  createCluster: async (req, res) => {
    console.log('request', req.body)
    try {
      //this function will make a pseudo-randomly generated code on cluster creation. Users can use this code to join a cluster.
      function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result
      }

      const randomCode = makeid(8)
      await Cluster.create({
        cluster_name: req.body.title,
        creator_user_id: req.user.id,
        cluster_join_id: randomCode,
        cluster_members: req.user.id,
        member_count: 1,
      });
      console.log("Post has been added!");
      res.redirect("/createCluster");
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      console.log(req.body)
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  //RESOLVE - moved createTask to controllers/tasks.js @author Winnie
  //RESOLVE - get this function to update user pfps!
  //RESOLVE - after a user creates an account, they should be able to 
  updateUserPfp: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  }
  ,
  // delete a post (remove cloudinary image and DB record)
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      if (!post) return res.status(404).redirect('/profile');

      // Delete image from cloudinary
      if (post.cloudinaryId) {
        await cloudinary.uploader.destroy(post.cloudinaryId);
      }

      // Delete post from db
      await Post.findOneAndDelete({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
      res.redirect("/profile");
    }
  }
  //RESOLVE - moved deleteTask to controllers/tasks.js @author Winnie
};
