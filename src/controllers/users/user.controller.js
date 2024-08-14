const UserModel = require("../../models/users/user.model");
const BcryptEncode = require("../../utils/bcrypt");
const JwtGender = require("../../utils/jwt-gender");
const fs = require("fs");

class UserController {
  static async register(req, res) {
    try {
      const bodyData = req.body;

      const user = {
        username: bodyData.username,
        email: bodyData.email,
        password: bodyData.password,
        full_name: bodyData.full_name,
        phone_number: bodyData.phone_number,
        address: bodyData.address,
        role: "user",
        avatar: "avatar-default.png",
      };
      if (!user.username) {
        return res.status(400).json({ message: "user name is required" });
      }
      if (!user.email) {
        return res.status(400).json({ message: "email is required" });
      }
      if (!user.password) {
        return res.status(400).json({ message: "password is required" });
      }
      if (!user.role) {
        return res.status(400).json({ message: "role is required" });
      }
      if (!user.full_name) {
        return res.status(400).json({ message: "full name is required" });
      }
      if (!user.phone_number) {
        return res.status(400).json({ message: "phone number is required" });
      }
      if (!user.address) {
        return res.status(400).json({ message: "address is required" });
      }

      const hashedPassword = await BcryptEncode.encodePassword(
        bodyData.password
      );
      user.password = hashedPassword;

      const newUser = await UserModel.create(user);
      await newUser.save();

      const jwtData = { id: newUser._id, username: newUser.username };
      const token = await JwtGender.generateToken(jwtData);

      res.cookie("token", token, { httpOnly: true });

      res
        .status(201)
        .json({ message: "user created successfully", token: token });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async login(req, res) {
    try {
      const body = req.body;

      if (!body.username) {
        return res.status(400).json({ message: "user name is required" });
      }
      if (!body.password) {
        return res.status(400).json({ message: "password is required" });
      }

      const findUser = await UserModel.findOne({ username: body.username });

      if (!findUser) {
        return res.status(404).json({ message: "username is not found" });
      }

      const checkPassword = await BcryptEncode.decodePassword(
        body.password,
        findUser.password
      );

      if (!checkPassword) {
        return res.status(404).json({ message: "password is incorrect " });
      }

      const jwtData = { id: findUser._id, username: findUser.username };
      const token = await JwtGender.generateToken(jwtData);

      res.cookie("token", token, { httpOnly: true });

      res.status(200).json({ message: "login successfully", data: { token } });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async getProfile(req, res) {
    try {
      const { userId } = req;

      const findUser = await UserModel.findById(userId);

      if (!findUser) {
        return res.status(404).json({ message: "user not found" });
      }

      const formatData = JSON.parse(JSON.stringify(findUser));

      delete formatData.password;
      delete formatData.__v;
      delete formatData.createdAt;
      delete formatData.updatedAt;

      res
        .status(200)
        .json({ message: "get profile successfully", data: formatData });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async createUser(req, res) {
    const filePath = process.cwd() + "/public/avatar/";
    const { file } = req;
    try {
      const { body } = req;

      const user = {
        username: body.username,
        email: body.email,
        password: body.password,
        full_name: body.full_name,
        phone_number: body.phone_number,
        address: body.address,
        role: body.role || "user",
      };

      if (!user.username) {
        if (fs.existsSync(filePath + file.filename)) {
          fs.unlinkSync(filePath + file.filename);
        }
        return res.status(400).json({ message: "user name is required" });
      }
      if (!user.email) {
        if (fs.existsSync(filePath + file.filename)) {
          fs.unlinkSync(filePath + file.filename);
        }
        return res.status(400).json({ message: "email is required" });
      }
      if (!user.password) {
        if (fs.existsSync(filePath + file.filename)) {
          fs.unlinkSync(filePath + file.filename);
        }
        return res.status(400).json({ message: "password is required" });
      }
      if (!user.role) {
        if (fs.existsSync(filePath + file.filename)) {
          fs.unlinkSync(filePath + file.filename);
        }
        return res.status(400).json({ message: "role is required" });
      }
      if (!user.full_name) {
        if (fs.existsSync(filePath + file.filename)) {
          fs.unlinkSync(filePath + file.filename);
        }
        return res.status(400).json({ message: "full name is required" });
      }
      if (!user.phone_number) {
        if (fs.existsSync(filePath + file.filename)) {
          fs.unlinkSync(filePath + file.filename);
        }
        return res.status(400).json({ message: "phone number is required" });
      }
      if (!user.address) {
        if (fs.existsSync(filePath + file.filename)) {
          fs.unlinkSync(filePath + file.filename);
        }
        return res.status(400).json({ message: "address is required" });
      }

      const hashedPassword = await BcryptEncode.encodePassword(body.password);
      user.password = hashedPassword;
      user.avatar = file.filename;
      const newUser = await UserModel.create(user);
      await newUser.save();

      res.status(201).json({ message: "create user successfully" });
    } catch (err) {
      if (fs.existsSync(filePath + file.filename)) {
        fs.unlinkSync(filePath + file.filename);
      }
      res.status(500).json(err);
    }
  }

  static async updateUser(req, res) {
    const filePath = process.cwd() + "/public/avatar/";
    const { file } = req;
    const {
      username,
      password,
      email,
      full_name,
      phone_number,
      address,
      role,
    } = req.body;
    const { userid } = req.params;
    try {
      if (!userid) {
        if (fs.existsSync(filePath + file.filename)) {
          fs.unlinkSync(filePath + file.filename);
        }
        return res.status(400).json({ message: "user id is required" });
      }

      const findUser = await UserModel.findById(userid);

      if (!findUser) {
        if (fs.existsSync(filePath + file.filename)) {
          fs.unlinkSync(filePath + file.filename);
        }
        return res
          .status(404)
          .json({ message: `user with ${userid} not found` });
      }

      let avatar = findUser.avatar;

      if (file) {
        avatar = file.filename;
      }

      let newPassword = findUser.password;

      if (password) {
        newPassword = await BcryptEncode.encodePassword(password);
      }

      const result = await UserModel.findByIdAndUpdate(userid, {
        username: username ?? findUser.username,
        password: newPassword,
        email: email ?? findUser.email,
        address: address ?? findUser.address,
        full_name: full_name ?? findUser.full_name,
        phone_number: phone_number ?? findUser.phone_number,
        role: role ?? findUser.role,
        avatar,
      });

      if (!result) {
        if (fs.existsSync(filePath + file.filename)) {
          fs.unlinkSync(filePath + file.filename);
        }
        res.status(404).json({ message: "user not found or no changes" });
      }
      res.status(200).json({ message: "user updated" });
    } catch (err) {
      if (fs.existsSync(filePath + file.filename)) {
        fs.unlinkSync(filePath + file.filename);
      }
      res.status(500).json(err);
    }
  }

  static async listUserPaging(req, res) {
    try {
      const { pageNumber = 1, perPage = 10 } = req.query;
      let skip = (pageNumber - 1) * perPage;
      const users = await UserModel.find().skip(skip).limit(perPage);
      const totalUser = await UserModel.countDocuments();
      const result = [];
      for (const user of users) {
        const userJSON = JSON.parse(JSON.stringify(user));
        console.log(
          "🚀 ~ UserController ~ listUserPaging ~ userJSON:",
          userJSON
        );
        delete userJSON.password;
        delete userJSON.__v;
        result.push(userJSON);

        userJSON.avatar = "/avatar" + userJSON.avatar;
      }

      res.status(200).json({
        data: result,
        perPage: Number(perPage),
        pageNumber,
        total: totalUser,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async getOne(req, res) {
    try {
      const { userid } = req.params;
      if (!userid) {
        return res.status(400).json({ message: "userId is required" });
      }
      const findUser = await UserModel.findById(userid);

      if (!findUser) {
        return res.status(404).json({ message: "user not found" });
      }

      const userJSON = JSON.parse(JSON.stringify(findUser));
      delete userJSON.password;
      delete userJSON.__v;

      userJSON.avatar = "/avatar/" + userJSON.avatar;

      res.status(200).json({ data: userJSON });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async deleteUser(req, res) {
    try {
      const { userid } = req.params;
      if (!userid) {
        return res.status(400).json({ message: "user id is required" });
      }

      await UserModel.findByIdAndDelete(userid);
      res.status(200).json({ message: `user with id ${userid} deleted` });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = UserController;
