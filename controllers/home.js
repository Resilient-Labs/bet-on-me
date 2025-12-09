module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs",{
      messages: req.flash()
    });
  },
};
