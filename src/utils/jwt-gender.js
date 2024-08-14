const jwt = require("jsonwebtoken");
const config = require("../config/config");

class JwtGender {
  static async generateToken(data) {
    const token = jwt.sign(data, config.JWT_SECRET, { expiresIn: "3h" });
    return token;
  }

  static async verifyToken(token) {
    const decode = jwt.verify(token, config.JWT_SECRET);
    return decode;
  }
}

module.exports = JwtGender;
