const cloudinary = require("../middleware/cloudinary");
const Cluster = require("../models/Cluster");
const Post = require("../models/Post");
const Task = require("../models/Task");
const { getUserTasks } = require("./tasks");
const Goal = require("../models/Goal");

module.exports = {
  
getProfile: async (req, res) => {
  try {
    // User posts!
    const posts = await Post.find({ user: req.user.id }).lean();

    // Member since
    let memberSince = "Unknown";
    if (req.user?.createdAt) {
      memberSince = new Date(req.user.createdAt).toLocaleDateString("en-US");
    }

    // FETCH CLUSTERS THE USER IS IN!!!!
    const clusters = await Cluster.find({
      cluster_members: req.user._id,
    })
      .populate("cluster_members")
      .lean();

    // fetch user's goals as an array for the profile view
    //dividing the goals into completed and incompleted just in case someone needed all the goals
    const goals = (await Goal.find({ user: req.user.id , completed: false}).lean()) || [];
    const completedGoals = (await Goal.find({ user: req.user.id , completed: true}).lean()) || [];
    res.render("profile", {
      posts,
      user: req.user,
      memberSince,
      clusters,
      goals,
      completedGoals,
      showProfileBubble: true,
      messages: req.flash(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading profile");
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
    try{
      //checks is user is a member of a group for nav
      const cluster = await Cluster.findOne({
        cluster_members: req.user.id
      });
      //redirects to home if not in group
      if(!cluster) {
        return res.redirect("/404");
      }

      res.render("teamPage.ejs", {
        user: req.user,
        cluster,
        showProfileBubble: true
      });
    } catch (err) {
      console.log(err);
      res.redirect("/home");
    }
  },
  getUserGoal: async (req, res) => {
    try{
      let cluster = await Cluster.findOne({
        cluster_members: req.user.id
      }).populate('cluster_members').lean();

     if (!cluster) {
  return res.redirect("/404");
}


      const posts = await Post.find({ user: req.user.id });
      const tasks = await Task.find({ user: req.user.id }) || [];
      const goals = await Goal.findOne({ user: req.user.id }) || null;

      // Compute simple member progress based on tasks: percent of completed tasks
      const memberProgress = [];
      for (const member of (cluster.cluster_members || [])) {
        try {
          const total = await Task.countDocuments({ user: member._id });
          const completed = await Task.countDocuments({ user: member._id, task_is_completed: true });
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
          memberProgress.push({ user: member, total, completed, percent });
        } catch (e) {
          memberProgress.push({ user: member, total: 0, completed: 0, percent: 0 });
        }
      }

      res.render("userGoal.ejs", {
        user: req.user,
        posts,
        tasks,
        goals,
        cluster,
        memberProgress,
        showProfileBubble: false,
        messages: req.flash()
      });
    } catch (err) {
      console.log("getUserGoal error:", err);
      res.redirect("/home");
    }
  },
  //this function gets the user profile, and the todo list of tasks!
  getUserProfile: async (req, res) => {
    try {
      const tasks = await getUserTasks(req.user.id);
      const goals = await Goal.findOne({ user: req.user.id });
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
        endDate: req.body.challengeDate
      });
      console.log("Post has been added!");
      //after creating a cluster the user is redirected to the group page
      res.redirect("/userGoal");
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
joinCluster: async (req, res) => {
  try {
    const joinCode = req.body.code;
    const userId = req.user._id;

    const cluster = await Cluster.findOne({
      cluster_join_id: joinCode,
    });

    // No cluster found
    if (!cluster) {
      req.flash("lateJoin", "Invalid group code.");
      return res.redirect("/404");
    }

    // Deny join if challenge already started
    const now = new Date();
    const challengeStart = new Date(cluster.challengeStartDate);

    if (now > challengeStart) {
      req.flash(
        "lateJoin",
        "You are late to join this challenge. You can join the next one!"
      );
      return res.redirect("/home");
    }

    // checking duplicates by their objectID!
    const alreadyMember = cluster.cluster_members.some(
      memberId => memberId.toString() === userId.toString()
    );

    if (alreadyMember) {
      req.flash("lateJoin", "You are already in this group.");
      return res.redirect("/home");
    }

    // CHECKING CAPACITY OF USERS
    if (cluster.member_count >= 8) {
      req.flash("lateJoin", "This group is already full (8 members max).");
      return res.redirect("/home");
    }

    // join is valid
    await Cluster.updateOne(
      { _id: cluster._id },
      {
        $push: { cluster_members: userId },
        $inc: { member_count: 1 },
      }
    );

    req.flash("success_msg", "Joined cluster successfully!");
    res.redirect("/userGoal");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Error joining cluster.");
    res.redirect("/clusters/join");
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
        return res.status(404).send("Cluster doesn't exist!").redirect("/404");
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