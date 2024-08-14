const UserModel = require("../models/users/user.model");
const JwtGender = require("../utils/jwt-gender");

class AuthMiddleware {
  static async authorize(req, res, next) {
    try {
      const authorize = req.headers.authorization;

      if (!authorize) {
        return res.status(401).json({ message: "token is required" });
      }

      const token = authorize.split(" ")[1];

      const decode = await JwtGender.verifyToken(token);
      if (!decode) {
        return res.status(401).json({ message: "token is invalid" });
      }

      const findUserById = await UserModel.findById(decode.id);

      if (!findUserById) {
        return res.status(404).json({ message: "user not found" });
      }

      req.userId = decode.id;
      next();
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async checkAdmin(req, res, next) {
    try {
      const authorize = req.headers.authorization;

      if (!authorize) {
        return res.status(401).json({ message: "token is required" });
      }

      const token = authorize.split(" ")[1];

      const decode = await JwtGender.verifyToken(token);
      if (!decode) {
        return res.status(401).json({ message: "token is invalid" });
      }

      const findUserById = await UserModel.findById(decode.id);

      if (!findUserById) {
        return res.status(404).json({ message: "user not found" });
      }

      if (findUserById.role === "user") {
        return res.status(403).json({ message: "permission denied" });
      }

      req.userid = decode.id;
      next();
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = AuthMiddleware;
