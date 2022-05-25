export const header = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, Content-Length, X-Requested-With',
}
export const statusMessage = {
  200: 'OK',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error',
}

export const successHandler = ({
  res, statusCode = 200, message, data,
}) => {
  res.writeHead(statusCode, header)
  res.end(
    JSON.stringify({
      status: 'success',
      statusCode,
      message: message || statusMessage[statusCode],
      data,
    }),
  )
}

export const errorHandler = ({
  res, statusCode = 404, message, error,
}) => {
  res.writeHead(statusCode, header)
  res.end(
    JSON.stringify({
      status: 'error',
      statusCode,
      message: message || statusMessage[statusCode],
      error,
    }),
  )
}
