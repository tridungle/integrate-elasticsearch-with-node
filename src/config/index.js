import dotenv from 'dotenv';
import appRoot from 'app-root-path';

dotenv.config();

export default {
  rateLimit: {
    WINDOW_MS: process.env.WINDOW_MS || 15 * 60 * 1000, // 15 munites
    MAX_CONNECTIONS: process.env.MAX_NUMBER_OF_CONNECTIONS_DURING_WINDOW_MS || 10, // start blocking after 10 requests
    MESSAGE: process.env.MESSAGE ||
      'Too many accounts created from this IP, please try again after 15 munites'
  },
  server: {
    PORT: process.env.SERVER_PORT || 3000
  },
  logger: {
    format: process.env.LOGGER_FORMAT || 'dev',
    file: {
      filename: process.env.LOGGER_LOG_PATH || `${appRoot}/log/server.log`,
      handleExceptions: true,
      zippedArchive: true,
      maxsize: process.env.LOGGER_LOG_SIZE ? Number(process.env.LOGGER_LOG_SIZE) : 5242880, // 5MB
      maxFiles: process.env.LOGGER_MAX_FILE ? Number(process.env.LOGGER_MAX_FILE) : 5
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    }
  },
  database: {
    mongodb: {
      URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/boilerplate',
      OPTIONS: {
        retryWrites: true,
        autoReconnect: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      RECONNECT_TIMEOUT: process.env.MONGODB_RECONNECT_TIMEOUT || 60000
    }
  }
};
