const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.headers.authorization

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }

  next()
}

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }

  next(error)
}

module.exports = {
  tokenExtractor,
  errorHandler
}
