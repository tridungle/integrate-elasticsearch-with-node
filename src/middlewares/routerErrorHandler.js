import { errorHandler } from '@helpers';

class RouterErrorHandler {
  handle404Error = () => {
    errorHandler.notFoundError();
  };

  handleClientError = (error, request, response, next) => {
    errorHandler.clientError(error, response, next);
  };

  handleServerError = (error, request, response, next) => {
    errorHandler.serverError(error, request, response, next);
  };
}

export default new RouterErrorHandler();
