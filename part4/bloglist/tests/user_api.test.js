const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
})

test('fails if username is too short', async () => {
  const newUser = {
    username: 'ab',
    name: 'test',
    password: '123'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(response.body.error.includes('username'))
})

test('fails if password is too short', async () => {
  const newUser = {
    username: 'validuser',
    name: 'test',
    password: '12'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(response.body.error.includes('password'))
})

after(async () => {
  await mongoose.connection.close()
})