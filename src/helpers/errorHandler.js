import { HTTPClientError, HTTP404Error, serverLogger } from '@helpers';

class ErrorHandler {
  notFoundError = () => {
    throw new HTTP404Error('Method not found');
  };
  clientError = (error, response, next) => {
    if (error instanceof HTTPClientError) {
      serverLogger.error(error);
      response
        .status(error.statusCode)
        .json({ code: error.statusCode, error: error.message });
    } else {
      next(error);
    }
  };

  serverError = (error, request, response, next) => {
    if (process.env.NODE_ENV === 'production') {
      response.status(500).json({ code: 500, error: 'Internal Server Error' });
    } else {
      response.status(500).json({ code: 500, error: error.stack });
    }
  };
}

export default new ErrorHandler();
