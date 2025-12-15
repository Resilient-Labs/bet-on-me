const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const figlet = require("figlet");

// ROUTES
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const taskRoutes = require("./routes/task");
const goalRoutes = require("./routes/goal");
const userRoutes = require("./routes/users");
const errorRoutes = require("./routes/error");

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// passport config
require("./config/passport")(passport);

// connect to database
connectDB();

// using EJS for views
app.set("view engine", "ejs");

// static folder
app.use(express.static("public"));

// override before parsing 
app.use(methodOverride("_method"));

// Stripe webhook route MUST come before body parsing! 
//// this is because Stripe needs the raw request body to verify signatures
app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  require("./controllers/stripe").handleWebhook
);

// body parsing middleware - comes AFTER webhook route
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// logging
app.use(logger("dev"));

// Sessions (stored in MongoDB)
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// use flash messages for errors, info, etc...
// Make user available in all EJS templates so conditional can be made for header; user || !user for login/logout buttons in nav
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//Make isInGroup available in all EJS files so conditional can be made for header; user && in group || !user && !isInGroup for Team Page/ User Goal in nav
const setUserGroupStatus = require("./middleware/setUserGroupStatus");
app.use(setUserGroupStatus);

//Use flash messages for errors, info, ect...
app.use(flash());

// Make figlet available in views
app.locals.figlet = figlet;

//Setup Routes For Which The Server Is Listening
app.use("/users", userRoutes);
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("/task", taskRoutes);
app.use("/goal", goalRoutes);
app.use("/stripe", require("./routes/stripe"));

// Manual 404 route (/404)
app.use(errorRoutes);

// global 404 handler must be last
app.use((req, res) => {
  res.status(404).redirect("/404");
});

// Server
app.listen(process.env.PORT, () => {
  console.log(`Server is running, you better catch it! localhost:${process.env.PORT}`);
});