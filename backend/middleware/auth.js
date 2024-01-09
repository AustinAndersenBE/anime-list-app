const passport = require("passport");
const { UnauthorizedError } = require("../expressError");

function authenticateJWT(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new UnauthorizedError());
    }
    req.user = user;
    return next();
  })(req, res, next);
}

function ensureAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return next(new UnauthorizedError());
  }
  return next();
}

function ensureCorrectUserOrAdmin(req, res, next) {
  if (!req.user) {
    return next(new UnauthorizedError());
  }
  if ( req.user.id == req.params.id ) {
    return next();
  }
  if (req.user.isAdmin) {
    return next();
  }
  return next(new UnauthorizedError());
}

module.exports = {
  authenticateJWT,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
};