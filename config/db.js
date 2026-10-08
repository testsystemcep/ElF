const mongoose = require('mongoose');

let isConnected = false;
let connectingPromise = null;

/**
 * Strips usernames, passwords, and sensitive query tokens from strings/URIs
 * @param {string} str - String potentially containing credentials
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/:\/\/([^:]+):([^@]+)@/g, '://***:***@');
};

/**
 * Builds or resolves the canonical MongoDB connection URI from environment variables
 * Supports MONGODB_URI directly, with placeholder replacement (<username>, <password>)
 * or credential injection if MONGODB_USERNAME and MONGODB_PASSWORD are provided.
 * @returns {string} Fully formed MongoDB Atlas URI
 */
const getMongoURI = () => {
  let uri = process.env.MONGODB_URI;
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;

  if (uri) {
    // If the URI uses placeholder tokens, substitute them
    if (username && uri.includes('<username>')) {
      uri = uri.replace('<username>', encodeURIComponent(username));
    }
    if (password && uri.includes('<password>')) {
      uri = uri.replace('<password>', encodeURIComponent(password));
    }

    // If URI lacks credentials but username & password are provided separately
    if (username && password) {
      if (uri.startsWith('mongodb+srv://') && !uri.slice(14).includes('@')) {
        uri = `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${uri.slice(14)}`;
      } else if (uri.startsWith('mongodb://') && !uri.slice(10).includes('@')) {
        uri = `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${uri.slice(10)}`;
      }
    }

    return uri;
  }

  // Fallback: construct URI if host/cluster and credentials are provided separately
  const cluster = process.env.MONGODB_CLUSTER || process.env.MONGODB_HOST;
  const dbName = process.env.MONGODB_DATABASE || '';

  if (username && password && cluster) {
    const protocol = cluster.includes('.') && !cluster.includes(':') ? 'mongodb+srv://' : 'mongodb://';
    return `${protocol}${encodeURIComponent(username)}:${encodeURIComponent(password)}@${cluster}/${dbName}?retryWrites=true&w=majority`;
  }

  throw new Error('Missing MongoDB configuration: MONGODB_URI (or MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER) must be defined.');
};

/**
 * Centralized MongoDB Atlas connection handler
 * Reuses existing connections, handles connection pooling, and sanitizes logs.
 * @returns {Promise<mongoose.Connection>}
 */
const connectDB = async () => {
  // 1. Connection already open and ready
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose.connection;
  }

  // 2. Connection is currently in flight - await the active promise to avoid duplicate connections
  if (mongoose.connection.readyState === 2 && connectingPromise) {
    return connectingPromise;
  }

  try {
    const uri = getMongoURI();

    const options = {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    };

    if (process.env.MONGODB_DATABASE) {
      options.dbName = process.env.MONGODB_DATABASE;
    }

    connectingPromise = mongoose.connect(uri, options);
    await connectingPromise;
    connectingPromise = null;
    isConnected = true;

    // Safe logging: never output passwords, usernames, or connection strings
    console.log('MongoDB connection established');
    return mongoose.connection;
  } catch (error) {
    connectingPromise = null;
    isConnected = false;

    const safeMessage = sanitizeString(error.message);
    console.error(`MongoDB connection error: ${safeMessage}`);
    throw new Error('Database connection unavailable');
  }
};

/**
 * Disconnects from MongoDB Atlas cleanly (used for shutdown or tests)
 */
const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
      isConnected = false;
      console.log('MongoDB disconnected successfully');
    } catch (error) {
      console.error('Error during MongoDB disconnection');
    }
  }
};

/**
 * Returns current database connection status
 * @returns {boolean}
 */
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Safe application logger ensuring no connection secrets are exposed in logs
const logger = {
  info: (msg) => console.log(`[INFO] ${sanitizeString(typeof msg === 'string' ? msg : JSON.stringify(msg))}`),
  error: (msg) => console.error(`[ERROR] ${sanitizeString(typeof msg === 'string' ? msg : JSON.stringify(msg))}`),
  warn: (msg) => console.warn(`[WARN] ${sanitizeString(typeof msg === 'string' ? msg : JSON.stringify(msg))}`)
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.disconnectDB = disconnectDB;
module.exports.isDatabaseConnected = isDatabaseConnected;
module.exports.logger = logger;
module.exports.sanitizeString = sanitizeString;
