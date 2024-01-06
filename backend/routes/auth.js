const express = require("express");
const jsonschema = require("jsonschema");
const passport = require("passport");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError, UnauthorizedError } = require("../expressError");

const router = new express.Router();

// POST /token
router.post("/token", async (req, res, next) => {
  const validator = jsonschema.validate(req.body, userAuthSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    return next(new BadRequestError(errs));
  }

  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new UnauthorizedError("Invalid username/password"));
    }
    const token = createToken(user);
    return res.json({ token });
  })(req, res, next);
});

// POST /register
router.post("/register", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }


    const newUser = await User.register({ ...req.body, isAdmin: false });

    const token = createToken({ username: newUser.username, isAdmin: newUser.isAdmin });
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;