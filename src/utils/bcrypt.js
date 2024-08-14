const bcrypt = require("bcrypt");

class BcryptEncode {
  static async encodePassword(password) {
    const saltRound = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRound);
    return hashedPassword;
  }

  static async decodePassword(password, hashedPassword) {
    const checkPassword = bcrypt.compareSync(password, hashedPassword);
    return checkPassword;
  }
}
module.exports = BcryptEncode;
