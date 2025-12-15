const express = require("express");
const router = express.Router();

router.get("/404", (req, res) => {
  res.status(404).render("errors/404", {
    message: "Cluster Not Found",
  });
});

module.exports = router;
