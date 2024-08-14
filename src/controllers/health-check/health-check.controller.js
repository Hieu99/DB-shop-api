const config = require("../../config/config");
const HealthCheckModel = require("../../models/health-check/health-check.model");

class HealthCheckController {
  static healthCheck(_, res) {
    const appHealth = new HealthCheckModel(
      config.APP_NAME,
      config.APP_STATUS,
      config.APP_VERSION
    );

    return res.status(200).json(appHealth);
  }
}

module.exports = HealthCheckController;
