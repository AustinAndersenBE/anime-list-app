const express = require("express");
const cors = require("cors");
const passport = require("passport");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const { NotFoundError } = require("./expressError");
const { configurePassportStrategies } = require("./config/passportConfig");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const animeRoutes = require("./routes/anime");

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'https://my-anime-list-z6is.onrender.com'],
  credentials: true,
}));
app.use(express.json());
app.use(morgan("tiny"));

app.use(passport.initialize());
configurePassportStrategies(passport);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/anime", animeRoutes);


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
