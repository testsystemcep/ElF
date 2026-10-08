const path = require('path');
const dotenv = require('dotenv');

// Ensure .env is loaded before requiring application modules
dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const { logger, connectDB, disconnectDB } = require('./utils/mongodb');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Establish MongoDB connection during startup
    await connectDB();
    
    // 2. Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`Server started successfully in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      logger.info(`Admin Panel: http://localhost:${PORT}/admin`);
    });

    // 3. Graceful shutdown handler
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Closing HTTP server and database connection...`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
