const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const { BCRYPT_WORK_FACTOR } = require('../config.js');

class User {
    static async authenticate(username, password) {
      const user = await prisma.user.findUnique({
        where: { username },
      });
  
      if (user && await bcrypt.compare(password, user.passwordHash)) {
        delete user.passwordHash;
        return user;
      }
  
      throw new UnauthorizedError("Invalid username/password");
    }
  
    static async register({ username, password, firstName, lastName, email, isAdmin }) {
      const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
  
      try {
        const newUser = await prisma.user.create({
          data: {
            username,
            passwordHash: hashedPassword,
            firstName,
            lastName,
            email,
            isAdmin,
          },
        });
        delete newUser.passwordHash;
        return newUser;
      } catch (error) {
        if (error.code === 'P2002') {
          throw new BadRequestError(`Duplicate username: ${username}`);
        } else {
          throw new Error(error);
        }
      }
    }
  

  }


module.exports = User;