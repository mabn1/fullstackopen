const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/users')

mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch(err => logger.error(err.message))

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.errorHandler)

module.exports = app