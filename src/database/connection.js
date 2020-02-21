import mongoose from 'mongoose';
import { serverLogger } from '@helpers';
import config from '@config';
class MongoConnection {
  constructor() {
    this.subscribeConnectionEmmitter();
  }

  connect = () => {
    if (!config.database.mongodb.URI) {
      serverLogger.error('MONGODB_URI not specified.');
      process.exit();
    }

    mongoose
      .connect(config.database.mongodb.URI, config.database.mongodb.OPTIONS)
      .catch(error => {
        serverLogger.error(`---> ${error}`);
      });
  };

  subscribeConnectionEmmitter = () => {
    const db = mongoose.connection;
    db.on('connecting', () => {
      serverLogger.log('Connecting to MongoDB...');
    });

    db.on('error', err => {
      serverLogger.error(`MongoDB connection error: ${err}`);
      mongoose.disconnect();
    });

    db.on('connected', () => {
      serverLogger.info('Connected to MongoDB!');
    });

    db.once('open', () => {
      serverLogger.info('MongoDB connection opened!');
    });

    db.on('reconnected', () => {
      serverLogger.info('MongoDB reconnected!');
    });

    db.on('disconnected', () => {
      serverLogger.error(
        `MongoDB disconnected! Reconnecting in ${config.database.mongodb
          .RECONNECT_TIMEOUT / 1000}s...`
      );
      setTimeout(
        () => this.connect(),
        config.database.mongodb.RECONNECT_TIMEOUT
      );
    });
  };
}
export default new MongoConnection();
