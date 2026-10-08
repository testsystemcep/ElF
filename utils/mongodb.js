const db = require('../config/db');

module.exports = {
  connectDB: db.connectDB,
  disconnectDB: db.disconnectDB,
  isDatabaseConnected: db.isDatabaseConnected,
  logger: db.logger,
  sanitizeString: db.sanitizeString
};
