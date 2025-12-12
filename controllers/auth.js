const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const async = require("async")
const crypto = require("crypto")
const nodemailer = require("nodemailer")

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
  req.logout(function (err) {
    if (err) { console.log(err) }

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
    score: 0
  })

  console.log('user', user)

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
    .then(usr => {
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        //main page to make or join groups
        res.redirect("/home");
      });
    });
};



/* this functionality will make use of the following dependencies -- nodemailer, crypto --  to create a token, and send an email to a user to change their forgotten password

*nodemailer - sends an email to the user's registered email address

*crypto - creates a random token to send to user's email to verify their password!

* Author: @JustinJoshi
*/



exports.forgotPassword = (req, res) => {
  const generateResetToken = () => {
    return crypto.randomBytes(20).toString('hex');
  };

  const token = generateResetToken();

  const saveTokenToDatabase = async (email, token) => {
    const user = await User.findOne({ email });
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'betonmemailer@gmail.com',
      pass: 'jjoi uzug jntu otha '
    }
  });

  const sendResetEmail = async (email, token) => {
    const mailOptions = {
      from: 'betonmemailer@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      //RESOLVE - insert link that redirects to hosted website resolve forgotPassword link
      html: `<p>You have requested a password reset. Click on the following link to reset your password: <a href="${token}">Reset Password</a></p>`
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  saveTokenToDatabase(req.body.resetEmail, token)
  sendResetEmail(req.body.resetEmail, token)
}
