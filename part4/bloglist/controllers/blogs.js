const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', { username: 1, name: 1 })

    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  try {
    if (!request.user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = request.user
    const body = request.body

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)

  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end()
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'forbidden' })
    }

    await Blog.findByIdAndDelete(request.params.id)

    response.status(204).end()

  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const { likes } = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { returnDocument: 'after', runValidators: true, context: 'query' }
    )

    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }

  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter