const express = require("express");
const jsonschema = require("jsonschema");
const passport = require("passport");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const { authenticateJWT } = require("../middleware/auth");

const router = new express.Router();

/** POST /auth/token */ 
router.post("/token", async (req, res, next) => {
  const validator = jsonschema.validate(req.body, userAuthSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    return next(new BadRequestError(errs));
  }

  // returns a middleware function that will be immediately invoked
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new UnauthorizedError("Invalid username/password"));
    }
    const token = createToken(user);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', //set to secure if in production
      maxAge: 86400000, 
      sameSite: 'strict'
    });

    return res.status(200).end();
  })(req, res, next);
});

/** POST /auth/register */
router.post("/register", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body, isAdmin: false }); 
    const token = createToken({ id: newUser.id, isAdmin: newUser.isAdmin });

    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 86400000,
      sameSite: 'strict'
    });


    return res.status(201).end();
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/logout */
router.post("/logout", (req, res) => {
  res.clearCookie('token');
  return res.status(200).end();
});

/** GET /auth/status */
router.get("/status", authenticateJWT, (req, res) => {
  res.json({
    isAuthenticated: true,
    user: {
      id: req.user.id,
      isAdmin: req.user.isAdmin,
    }
  });
});


module.exports = router;

