import { httpStatus } from '@helpers/constants';
class APIResponseHandler {
  constructor() {
    this.status = httpStatus;
    this._hasOwnProperty = Object.prototype.hasOwnProperty;
  }

  success = (request, response, data) => {
    this.jsonResponse(response, data, {
      status: this.status.OK
    });
  };

  badRequest = (request, response, errors) => {
    const body = {
      message: this.statusMessage(this.status.BAD_REQUEST),
      errors: { errors }
    };
    this.jsonResponse(response, body, {
      status: this.status.BAD_REQUEST
    });
  };

  unauthorized = (request, response, error) => {
    const body = {
      message: this.statusMessage(this.status.UNAUTHORIZED),
      error: { error }
    };

    this.jsonResponse(response, body, {
      status: this.status.UNAUTHORIZED
    });
  };

  forbidden = (request, response) => {
    const body = {
      message: this.statusMessage(this.status.FORBIDDEN)
    };

    this.jsonResponse(response, body, {
      status: this.status.FORBIDDEN
    });
  };

  notFound = (request, response) => {
    const body = {
      message: this.statusMessage(this.status.NOT_FOUND)
    };

    this.jsonResponse(response, body, {
      status: this.status.NOT_FOUND
    });
  };

  unsupportedAction = (request, response) => {
    const body = {
      message: this.statusMessage(this.status.UNSUPPORTED_ACTION)
    };

    this.jsonResponse(response, body, {
      status: this.status.UNSUPPORTED_ACTION
    });
  };

  invalid = (request, response, errors) => {
    const body = {
      message: this.statusMessage(this.status.VALIDATION_FAILED),
      errors: { errors }
    };

    this.jsonResponse(response, body, {
      status: this.status.VALIDATION_FAILED
    });
  };

  serverError = (request, response, error) => {
    let reformatError = error;
    if (reformatError instanceof Error) {
      reformatError = {
        message: error.message,
        stacktrace: error.stack
      };
    }
    const body = {
      message: this.statusMessage(this.status.SERVER_ERROR),
      error: reformatError
    };

    this.jsonResponse(response, body, {
      status: this.status.SERVER_ERROR
    });
  };

  requireParams = (request, response, params, next) => {
    const missing = [];
    const reformatParams = Array.isArray(params) ? params : [params];
    reformatParams.forEach(param => {
      if (
        !(request.body && this._hasOwnProperty.call(request.body, param)) &&
        !(request.params && this._hasOwnProperty.call(request.params, param)) &&
        !this._hasOwnProperty.call(request.query, param)
      ) {
        missing.push(`Missing required parameter: ${param}`);
      }
    });

    if (missing.length) {
      this.badRequest(request, response, missing);
    } else {
      next();
    }
  };

  created = (request, response, data) => {
    this.jsonResponse(response, data, {
      status: this.status.OK
    });
  };

  requireHeaders = (request, response, headers, next) => {
    const missing = [];
    const reformatHeaders = Array.isArray(headers) ? headers : [headers];

    reformatHeaders.forEach(header => {
      if (
        !(request.headers && this._hasOwnProperty.call(request.headers, header))
      ) {
        missing.push(`Missing required header parameter: ${header}`);
      }
    });

    if (missing.length) {
      this.badRequest(request, response, missing);
    } else {
      next();
    }
  };

  jsonResponse = (response, body, options) => {
    const reformatOptions = options || {};
    reformatOptions.status = reformatOptions.status || this.status.OK;
    response
      .status(reformatOptions.status)
      .json({ code: reformatOptions.status, result: body || null });
  };

  statusMessage = status => {
    switch (status) {
      case this.status.BAD_REQUEST:
        return 'Bad Request';
      case this.status.UNAUTHORIZED:
        return 'Unauthorized';
      case this.status.FORBIDDEN:
        return 'Forbidden';
      case this.status.NOT_FOUND:
        return 'Not Found';
      case this.status.UNSUPPORTED_ACTION:
        return 'Unsupported Action';
      case this.status.VALIDATION_FAILED:
        return 'Validation Failed';
      case this.status.SERVER_ERROR:
        return 'Internal Server Error';
      case this.status.CREATED:
        return 'Created';
    }
  };
}

export default new APIResponseHandler();
