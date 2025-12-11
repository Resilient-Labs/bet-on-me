module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs",{
      //get flash messages to login/signup modals
      messages: req.flash()
    });
  },
};
