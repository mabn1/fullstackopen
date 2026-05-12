const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const favorite = blogs.reduce((max, blog) =>
    blog.likes > max.likes ? blog : max
  )

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const count = {}

  blogs.forEach(blog => {
    count[blog.author] = (count[blog.author] || 0) + 1
  })

  const author = Object.keys(count).reduce((a, b) =>
    count[a] > count[b] ? a : b
  )

  return {
    author,
    blogs: count[author]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}