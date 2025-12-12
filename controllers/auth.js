const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

exports.getLogin = (req, res) => {
  if (req.user) {
    //main page to make or join groups
    return res.redirect("/home");
  }
  //redirect to landing page if user not logged in
  res.redirect("/");
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    //redirect to landing page if user not logged in, and open correct modal
    req.flash("modal", "login");
    return res.redirect("/");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      //redirect to landing page if user not logged in, and open correct modal
      req.flash("modal", "login"); 
      return res.redirect("/");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      //main page to make or join groups
      res.redirect(req.session.returnTo || "/home");
    });
  })(req, res, next);
};

// exports.logout = (req, res) => {
//   req.logout(() => {
//     console.log('User has logged out.')
//   })
//   req.session.destroy((err) => {
//     if (err)
//       console.log("Error : Failed to destroy the session during logout.", err);
//     req.user = null;
//     res.redirect("/");
//   });
// };
exports.logout = (req, res) => {
  req.logout(function(err){
    if(err) {console.log(err)}

    console.log('User has logged out.')

    req.session.destroy((err) => {
      if (err)
        console.log("Error : Failed to destroy the session during logout.", err);
      // req.user = null;
      res.redirect("/");
    })
  })
  
};

exports.getSignup = (req, res) => {
  if (req.user) {
    //main page to make or join groups
    return res.redirect("/home");
  }
  //redirect back to landing page in case of signup error
  res.redirect("/");
};

exports.postSignup = async (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    //redirect to landing page and open correct modal
    req.flash("modal", "signup");
    return res.redirect("/");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    access: req.body?.access,     // -> ?. <- before access is checking for any access value. If it's there, then return value. If not, then return udefined
    password: req.body.password,
    score:0
  })
  
  console.log('user',user)

  const existingUser = await User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] }
  )
  if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        //redirect to landing page and open correct modal
        req.flash("modal", "signup");
        return res.redirect("/");
      }
  user.save()
  .then(usr => {req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        //main page to make or join groups
        res.redirect("/home");
      });
  });
};



/* this functionality will make use of the following dependencies -- async, nodemailer, crypto --  to create a token, and send an email to a user to change their forgotten password

 *async - provides .waterfall() method -
 **from the async docs:
 ***Runs the tasks array of functions in series, each passing their results to the next in the array. However, if any of the   tasks pass an error to their own callback, the next function is not executed, and the main callback is immediately called with the error.

*nodemailer - sends an email to the user's registered email address using SMTP

*crypto - creates a random token to send to user's email to verify their password!

* Author: @JustinJoshi
*/
exports.forgotPassword = function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'gmail',
        auth: {
          user: '!!! YOUR SENDGRID USERNAME !!!',
          pass: '!!! YOUR SENDGRID PASSWORD !!!'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
};