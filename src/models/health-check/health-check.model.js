class HealthCheckModel {
  constructor(appName, status, version) {
    this.app_name = appName;
    this.status = status;
    this.version = version;
  }

  static getHealthCheck() {
    return {
      app_name: this.app_name,
      version: this.version,
      status: this.status,
    };
  }
}

module.exports = HealthCheckModel;
