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

describe('favorite blog', () => {
  const blogs = [
    {
      title: 'a',
      author: 'x',
      likes: 5
    },
    {
      title: 'b',
      author: 'y',
      likes: 10
    },
    {
      title: 'c',
      author: 'z',
      likes: 7
    }
  ]

  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    assert.deepStrictEqual(result, {
      title: 'b',
      author: 'y',
      likes: 10
    })
  })

  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])

    assert.strictEqual(result, null)
  })
})

describe('most blogs', () => {
  const blogs = [
    { author: 'x' },
    { author: 'y' },
    { author: 'x' },
    { author: 'x' },
    { author: 'y' }
  ]

  test('returns author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: 'x',
      blogs: 3
    })
  })

  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])

    assert.strictEqual(result, null)
  })
})

describe('most likes', () => {
  const blogs = [
    { title: 'a', author: 'x', likes: 5 },
    { title: 'b', author: 'y', likes: 10 },
    { title: 'c', author: 'x', likes: 7 },
    { title: 'd', author: 'x', likes: 3 },
    { title: 'e', author: 'y', likes: 2 }
  ]

  test('returns author with most likes', () => {
    const result = listHelper.mostLikes(blogs)

    assert.deepStrictEqual(result, {
      author: 'x',
      likes: 15
    })
  })

  test('of empty list is null', () => {
    const result = listHelper.mostLikes([])

    assert.strictEqual(result, null)
  })
})