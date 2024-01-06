const passport = require("passport");
const { UnauthorizedError } = require("../expressError");

function authenticateJWT(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => { //session being false means we don't want to store the user in the session
    if (user) {
      req.user = user;
    }
    return next();
  })(req, res, next);
}

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return next(new UnauthorizedError());
  }
  return next();
}

function ensureAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return next(new UnauthorizedError());
  }
  return next();
}

function ensureCorrectUserOrAdmin(req, res, next) {
  if (!(req.user && (req.user.isAdmin || req.user.username === req.params.username))) {
    return next(new UnauthorizedError());
  }
  return next();
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
};