const jwt = require("jsonwebtoken");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");

  let payload = {
    id: user.id,
    isAdmin: user.isAdmin || false,
  };

  // expiration time for the JWT
  const options = {
    expiresIn: '24h'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports = { createToken };