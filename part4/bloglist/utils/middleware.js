const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  res.status(500).json({ error: 'something went wrong' })
}

module.exports = { errorHandler }