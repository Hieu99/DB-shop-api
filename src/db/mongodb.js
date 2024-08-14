const mongoose = require("mongoose");
const config = require("../config/config");

const mongoDBConnection = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log(`Connected to MongoDB: ${process.env.MONGODB_URI}`);
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
};

module.exports = mongoDBConnection;
