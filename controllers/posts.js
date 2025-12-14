const cloudinary = require("../middleware/cloudinary");
const Cluster = require("../models/Cluster");
const Post = require("../models/Post");
const Task = require("../models/Task");
const { getUserTasks } = require("./tasks");
const Goal = require("../models/Goal");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user, showProfileBubble: true });
    } catch (err) {
      console.log(err);
    }
  },
  //this is the page that shows after successful login
  getHome: async (req, res) => {
    try {
      res.render("homePage.ejs", { user: req.user, showProfileBubble: true });
    } catch (err) {
      console.log(err);
    }
  },
  getTeamPage: async (req, res) => {
    try {
      res.render("teamPage.ejs", { user: req.user, showProfileBubble: true });
    } catch (err) {
      console.log(err);
    }
  },
  getUserGoal: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      const tasks = await Task.find({ user: req.user.id });
      const goals = await Goal.findOne({ user: req.user.id });
      res.render("userGoal.ejs", { posts, user: req.user, tasks, goals, showProfileBubble: false });
    } catch (err) {
      console.log(err);
    }
  },
  //this function gets the user profile, and the todo list of tasks!
  getUserProfile: async (req, res) => {
    try {
      const tasks = await getUserTasks(req.user.id);
      res.render("userProfile.ejs", { user: req.user, tasks, showProfileBubble: true });
    } catch (err) {
      console.log(err);
    }
  },
  //this function gets the cluster creation page!
  getClusterCreationPage: async (req, res) => {
    try {
      res.render("clusterCreation.ejs", { user: req.user, showProfileBubble: true });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts, showProfileBubble: true });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user, showProfileBubble: true });
    } catch (err) {
      console.log(err);
    }
  },
  //this function updates a cluser
  createCluster: async (req, res) => {
    console.log('request', req.body)
    try {
      //this function will make a pseudo-randomly generated code on cluster creation. users can use this code to join a cluster.
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
        user: req.user.id,
        cluster_join_id: randomCode,
        cluster_members: [req.user.id],
        member_count: 1,
      });
      console.log("Post has been added!");
      //after creating a cluster the user is redirected to the group page
      res.redirect("/teamPage");
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // upload image to cloudinary
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
      res.redirect("/userProfile");
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
  },
  // delete a post (remove cloudinary image and DB record)
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      if (!post) return res.status(404).redirect('/userProfile');

      // Delete image from cloudinary
      if (post.cloudinaryId) {
        await cloudinary.uploader.destroy(post.cloudinaryId);
      }

      // Delete post from db
      await Post.findOneAndDelete({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/userProfile");
    } catch (err) {
      console.log(err);
      res.redirect("/userProfile");
    }
  },
  //RESOLVE - moved deleteTask to controllers/tasks.js @author Winnie

  
  // users joining a cluster code - shawn
  joinCluster: async (req, res) => {
    console.log('hi')
    try {
      const joinCode = req.body.code;

      console.log(joinCode)

      const cluster = await Cluster.findOne({
        cluster_join_id: joinCode,
      });

      if (!cluster) {
        return res.status(404).send("Cluster not found");
      }

      // prevent duplicate joins!!
      if (cluster.cluster_members.includes(req.user.id)) {
        return res.status(400).send("Already a member of this cluster");
      }

      cluster.cluster_members.push(req.user.id);
      // update member count by 1
      cluster.member_count += 1;

      await cluster.save();

      res.redirect("/userProfile");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error joining cluster");
    }
  },

  // letting users leave a cluster - shawn
  leaveCluster: async (req, res) => {
    try {
      // get cluster by its generated ID
      const clusterId = req.params.id;

      const cluster = await Cluster.findById(clusterId);

      // if there's no cluster
      if (!cluster) {
        return res.status(404).send("Cluster doesn't exist!");
      }

      // Check membership
      if (!cluster.cluster_members.includes(req.user.id)) {
        return res.status(400).send("You are not a member of this cluster");
      }

      // Remove user
      cluster.cluster_members = cluster.cluster_members.filter(
        userId => userId !== req.user.id
      );

      cluster.member_count = cluster.cluster_members.length;

      await cluster.save();

      res.redirect("/userProfile");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error leaving cluster");
    }
  },

  // Search for a cluster by join ID
  searchCluster: async (req, res) => {
    try {
      const { joinCode } = req.query;

      if (!joinCode) {
        return res.status(400).json({ message: "Join code is required" });
      }

      const cluster = await Cluster.findOne({
        cluster_join_id: joinCode,
      }).lean();

      if (!cluster) {
        return res.status(404).json({ message: "Cluster not found" });
      }

      res.json(cluster);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error searching for cluster" });
    }
  },
};