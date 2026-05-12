const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({})
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (req, res, next) => {
  try {
    const blog = new Blog(req.body)
    const result = await blog.save()
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter