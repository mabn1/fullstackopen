const User = require('../models/user')
const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    if (!username || !password) {
      return response.status(400).json({
        error: 'username y password son requeridos'
      })
    }

    if (username.length < 3) {
      return response.status(400).json({
        error: 'username debe tener al menos 3 caracteres'
      })
    }

    if (password.length < 3) {
      return response.status(400).json({
        error: 'password debe tener al menos 3 caracteres'
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)

  } catch (error) {
    next(error)
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1 })

  response.json(users)
})

module.exports = usersRouter