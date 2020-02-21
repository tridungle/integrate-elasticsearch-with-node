import debugLib from 'debug';
import chalk from 'chalk';
import winston from 'winston';
import config from '@config';

class ServerLog {
  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.File(config.logger.file),
        new winston.transports.Console(config.logger.console)
      ],
      exitOnError: false
    });
  }

  error = message => {
    const debug = debugLib('server:error');
    debug(chalk.red(message));
  };

  info = message => {
    const debugInfo = debugLib('server:info');
    debugInfo(chalk.blue(message));
  };

  log = message => {
    const debug = debugLib('server:log');
    debug(chalk.gray(message));
  };

  debug = message => {
    const debug = debugLib('server:debug');
    debug(chalk.green(message));
  };

  stream = () => {
    return {
      stream: {
        write: message => {
          this.logger.info(message);
        }
      }
    };
  };
  write = (message, level) => {
    switch (level) {
      case 'error':
        this.logger.error(message);
        break;
      case 'data':
        this.logger.data(message);
        break;
      case 'debug':
        this.logger.debug(message);
        break;
      default:
        this.logger.info(message);
        break;
    }
  };
}

export default new ServerLog();
