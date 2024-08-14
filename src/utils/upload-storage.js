const multer = require("multer");

class UploadStorage {
  static uploadImage(path) {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path);
      },
      filename: (req, file, cb) => {
        const formatName =
          Date.now() + "_" + file.originalname.replace(" ", "_");
        cb(null, formatName);
      },
    });

    const upload = multer({ storage: storage });

    return upload;
  }
}

module.exports = UploadStorage;
