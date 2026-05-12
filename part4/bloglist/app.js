const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch(err => logger.error(err.message))

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

// middleware al final SIEMPRE
app.use(middleware.errorHandler)

module.exports = app