const express = require("express");
const cors = require("cors");
const passport = require("passport");
const morgan = require("morgan");

const { NotFoundError } = require("./expressError");
const { configureJWTStrategy } = require("./config/passportConfig");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use(passport.initialize());
configureJWTStrategy(passport);

app.use("/auth", authRoutes);

app.use(function (req, res, next) {
    return next(new NotFoundError());
});

app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
  });
  
  module.exports = app;
