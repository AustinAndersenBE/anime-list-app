require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'default-secret-key';

module.exports = { SECRET_KEY };

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;



module.exports = {
    SECRET_KEY,
    BCRYPT_WORK_FACTOR,
  };