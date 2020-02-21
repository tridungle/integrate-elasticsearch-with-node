import express from 'express';

const api = express();

api.get('/', (req, res) => {
  res.status(200).json({
    code: 200,
    message: 'Hello from the API',
    name: 'api',
    version: '0.1',
  });
});

export default api;