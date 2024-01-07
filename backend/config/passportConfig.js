const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const prisma = require('../prismaClient');
const User = require('../models/user');

const configurePassportStrategies = (passport) => {
  // Local strategy configuration
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await User.authenticate(username, password);
        return done(null, user);
      } catch (err) {
        return done(null, false, { message: err.message });
      }
    }
  ));

  // JWT strategy configuration
  const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['token'];
      }
      return token;
    }
  ]),
  secretOrKey: process.env.JWT_SECRET,
};

  passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: jwt_payload.id },
      });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }));
};

module.exports = {
  configurePassportStrategies,
};