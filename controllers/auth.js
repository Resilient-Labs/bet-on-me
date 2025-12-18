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


  require("dotenv").config({ path: "./config/.env" });


};
const sendWelcomeEmail = async (email, userName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS
    }
  });

  const mailOptions = {
    from: 'betonmemailer@gmail.com',
    to: email,
    subject: 'Welcome to Bet On Me!',
    html: `<p>Hi ${userName},</p>
    <p>Welcome to Bet On Me!</p>
    <p>We're so excited you've decided to join us and can't wait to help you achieve your goals!</p>
    <img src="cid:BOMLogo" alt="Bet On Me Logo">
    <p>Best,<br>The Bet On Me Team</p>`,
    attachments: [
      {
        filename: "logo.png",
        path: "public/imgs/logo.png", // Adjust path as needed
        cid: "BOMLogo"
      }
    ]
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/home");
  }
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
    req.flash("modal", "signup");
    return res.redirect("/");
  }
  
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    access: req.body?.access,
    password: req.body.password,
    wallet: 0,
    score: 0
  });

  console.log('user', user);

  const existingUser = await User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] }
  );
  
  if (existingUser) {
    req.flash("errors", {
      msg: "Account with that email address or username already exists.",
    });
    req.flash("modal", "signup");
    return res.redirect("/");
  }
  
  try {
    await user.save();
    
    // Send welcome email after user is saved
    await sendWelcomeEmail(user.email, user.userName);
    
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/home");
    });
  } catch (error) {
    console.error('Signup error:', error);
    req.flash("errors", { msg: "An error occurred during signup." });
    req.flash("modal", "signup");
    return res.redirect("/");
  }
};



/* this functionality will make use of the following dependencies -- nodemailer, crypto --  to create a token, and send an email to a user to change their forgotten password

*nodemailer - sends an email to the user's registered email address

*crypto - creates a random token to send to user's email to verify their password!

* Author: @JustinJoshi
*/

require("dotenv").config({ path: "./config/.env" });

exports.forgotPassword = (req, res) => {
  const generateResetToken = () => {
    return crypto.randomBytes(20).toString('hex');
  };

  const token = generateResetToken();

  const saveTokenToDatabase = async (email, token) => {
    const user = await User.findOne({ email });
    if (!user) {
      return; //Will show an error in the request password modal
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS
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
      //Show message in request reset modal
      req.flash("success", { msg: "Password reset email sent!" });
      res.redirect("/");
    } catch (error) {
      //Show message in request reset modal
      req.flash("errors", { msg: `${error}` });
      req.flash("modal", "reset");
      res.redirect("/");
      console.error('Error sending email:', error);
    }
  };
  saveTokenToDatabase(req.body.resetEmail, token)
  sendResetEmail(req.body.resetEmail, token)
}

// Change password while user is logged in
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const errors = [];
    if (!currentPassword || !newPassword || !confirmPassword) {
      errors.push({ msg: 'Please fill out all password fields.' });
    }
    if (newPassword && newPassword.length < 8) {
      errors.push({ msg: 'Password must be at least 8 characters long' });
    }
    if (newPassword !== confirmPassword) {
      errors.push({ msg: 'New passwords do not match' });
    }
    const isAjax = req.xhr || req.get('X-Requested-With') === 'XMLHttpRequest' || req.accepts('json') === 'json';
    if (errors.length) {
      if (isAjax) return res.status(400).json({ success: false, errors });
      errors.forEach(e => req.flash('errors', e));
      return res.redirect('/profile');
    }

    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (!user) {
      req.flash('errors', { msg: 'User not found' });
      return res.redirect('/profile');
    }

    user.comparePassword(currentPassword, async (err, isMatch) => {
      if (err) {
        console.error(err);
        if (isAjax) return res.status(500).json({ success: false, message: 'Error verifying password' });
        req.flash('errors', { msg: 'Error verifying password' });
        return res.redirect('/profile');
      }
      if (!isMatch) {
        if (isAjax) return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        req.flash('errors', { msg: 'Current password is incorrect' });
        return res.redirect('/profile');
      }

      user.password = newPassword;
      await user.save();
      if (isAjax) return res.json({ success: true, message: 'Password changed successfully' });
      req.flash('success', { msg: 'Password changed successfully' });
      return res.redirect('/profile');
    });
  } catch (err) {
    console.error('changePassword error', err);
    req.flash('errors', { msg: 'Could not change password' });
    return res.redirect('/profile');
  }
};
