const { logger, sanitizeString } = require('../utils/mongodb');
const { sendResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const safeMessage = sanitizeString ? sanitizeString(err.message) : err.message;
  const safeStack = err.stack ? (sanitizeString ? sanitizeString(err.stack) : err.stack) : null;
  
  logger.error(safeStack || safeMessage);
  
  return sendResponse(res, statusCode, false, safeMessage || "Internal Server Error", {
    stack: process.env.NODE_ENV === 'production' ? null : safeStack,
  });
};

module.exports = { errorHandler };

