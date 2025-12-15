const express = require("express");
const router = express.Router();
const figlet = require("figlet");

router.get("/404", (req, res) => {
  figlet("404 - NOT FOUND", (err, data) => {
    res.status(404).render("errors/404", {
      ascii: err ? "404 - NOT FOUND" : data,
      message: "The page you are looking for does not exist.",
    });
  });
});

module.exports = router;
