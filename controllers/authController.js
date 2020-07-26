exports.auth = (req, res) => {
  // console.log(req.query.username);
  req.user.password = null;
  console.log("user",req.user);
  res.send(req.user);
  // res.redirect('/dashboard');
};
exports.authenticate = (req, res) => {
  if (!req.isAuthenticated()) {
    res.json({ authenticated: false });
  } else {
    // req.user.password = null;
    res.json({ authenticated: true, user: req.user });
  }
};
