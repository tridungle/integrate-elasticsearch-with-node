export class HTTPClientError extends Error {
      constructor(message) {
      if (message instanceof Object) {
        super(JSON.stringify(message));
      }else {
        super(message);
      }
      //this.stack = new Error().stack;
    }
  }
  
  export class HTTP404Error extends HTTPClientError {
    statusCode = 404;
    constructor(message = 'Not found') {
      super(message);
    }
  }