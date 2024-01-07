const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

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

  return jwt.sign(payload, SECRET_KEY, options);
}

module.exports = { createToken };