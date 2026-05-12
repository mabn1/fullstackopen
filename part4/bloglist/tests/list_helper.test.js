const { test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { describe } = require('node:test')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const emptyList = []

  const listWithOneBlog = [
    {
      title: 'test',
      author: 'me',
      likes: 5
    }
  ]

  const biggerList = [
    { title: 'a', author: 'x', likes: 5 },
    { title: 'b', author: 'y', likes: 3 },
    { title: 'c', author: 'z', likes: 7 }
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(biggerList)
    assert.strictEqual(result, 15)
  })
})