const express = require("express");
const UserController = require("../../controllers/users/user.controller");
const AuthMiddleware = require("../../middleware/authorization");
const UploadStorage = require("../../utils/upload-storage");

const route = express.Router();

route.post("/register", UserController.register);
route.post("/login", UserController.login);
route.get("/profile", AuthMiddleware.authorize, UserController.getProfile);

const uploadAvatar =
  UploadStorage.uploadImage("public/avatar").single("avatar");

route.get("/user", AuthMiddleware.authorize, UserController.listUserPaging);
route.get("/user/:userid", AuthMiddleware.authorize, UserController.getOne);
route.post(
  "/user",
  AuthMiddleware.authorize,
  uploadAvatar,
  UserController.createUser
);
route.put(
  "/user/:userid",
  AuthMiddleware.authorize,
  AuthMiddleware.checkAdmin,
  uploadAvatar,
  UserController.updateUser
);
route.delete(
  "/user/:userid",
  AuthMiddleware.authorize,
  AuthMiddleware.checkAdmin,
  UserController.deleteUser
);

module.exports = route;
