import http from 'http';
import app from '@app';
import config from '@config';
import { serverLogger } from '@helpers';

class Server {
  constructor(app) {
    this.app = app;
    this.setServerPort();
    this.startServer();
  }

  setServerPort = () => {
    this.port = this.normalizePort(config.server.PORT);
    this.app.set('port', this.port);
  };

  startServer = () => {
    this.server = http.createServer(this.app);
    this.server.listen(this.port);
    this.server.on('error', this.onError);
    this.server.on('listening', this.onListening);
  };
  normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      return val;
    }

    if (port >= 0) {
      return port;
    }

    return false;
  };

  onError = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind =
      typeof this.port === 'string' ? `Pipe ${this.port}` : `Port ${this.port}`;
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        serverLogger.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        serverLogger.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  onListening = () => {
    const addr = this.server.address();
    const bind =
      typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    serverLogger.log(`Listening on ${bind}`);
  };
}

export default new Server(app);
