const { parse } = require("dotenv");

require("dotenv").config();

const config = {
  PORT: process.env.PORT || 3000,
  APP_NAME: process.env.APP_NAME,
  APP_STATUS: process.env.APP_STATUS,
  APP_VERSION: process.env.APP_VERSION,
  ENVIRONMENT: process.env.ENVIRONMENT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};

module.exports = config;
