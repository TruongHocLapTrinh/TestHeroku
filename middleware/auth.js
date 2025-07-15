exports.ensureAuthenticated = (req, res, next) => {
  console.log("Checking authentication:", req.session);
  if (req.session.userId) {
    return next();
  }
  res.redirect("/auth/login");
};

exports.ensureRole = (role) => (req, res, next) => {
  console.log(
    "Checking role:",
    req.session.role,
    "Required:",
    role,
    "User ID:",
    req.session.userId
  );
  if (req.session.role === role) {
    return next();
  }
  res.status(403).send("Access denied");
};
