/* eslint-disable class-methods-use-this */
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import ExpressRateLimit from 'express-rate-limit';
import csurf from 'csurf';
import morgan from 'morgan'

import { DBConnectionManager } from '@database';
import { routerErrorHandlers } from '@middlewares';
import { serverLogger } from '@helpers'
import routes from '@routes';
import config from '@config'

class App {
  constructor() {
    this.app = express();
    this.connectDatabase();
    this.setMiddleware();
    this.mountRoutes();
    this.handleRouterError();
  }

  connectDatabase = () => {
    DBConnectionManager.connect();
  }

  setMiddleware = () => {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(cors());
    this.app.use(helmet());

    // enable limit repeated requests
    this.app.use(
      new ExpressRateLimit({
        windowMs: config.rateLimit.WINDOW_MS,
        max: config.rateLimit.MAX_CONNECTIONS,
        message: config.rateLimit.MESSAGE
      }),
    );
    
    // log config
    this.app.use(morgan('combined', serverLogger.stream()));
    
    // uncomment this line if you want enable csurf
    // the token will be stored in a cookie called '_csrf'
    this.preventCSRFAttack();
  }

  mountRoutes = () => {
    const router = express.Router();
    router.get('/', function(request,response){
      response.json({
        message: `Thank you for visiting our website. Unfortunately, we don't have anything to show here!`,
      });
    });
    this.app.use('/', router);
    this.app.use('/api/v1/', routes);
  }

  handleRouterError = () =>{
    this.app.use('/', routerErrorHandlers.handle404Error);
    this.app.use('/', routerErrorHandlers.handleClientError);
    this.app.use('/', routerErrorHandlers.handleServerError);
  }

  preventCSRFAttack = () =>{
    this.app.use(csurf({ cookie: true }));
    this.app.use(this.attachCSRFToken);
    this.app.use(this.handleCSRFError);
  }

  attachCSRFToken = (request, response, next) => {
    response.locals._csrf = request.csrfToken();
    next();
  }

  handleCSRFError = (error, request, response, next) => {
    if (error.code !== 'EBADCSRFTOKEN') return next(error);
    response.status(403).json({ code: 403, message: { error } });
    return next();
  }
}

export default new App().app;
