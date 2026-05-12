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

  const countByAuthor = {}

  blogs.forEach(blog => {
    countByAuthor[blog.author] =
      (countByAuthor[blog.author] || 0) + 1
  })

  const authorWithMostBlogs = Object.keys(countByAuthor)
    .reduce((a, b) =>
      countByAuthor[a] > countByAuthor[b] ? a : b
    )

  return {
    author: authorWithMostBlogs,
    blogs: countByAuthor[authorWithMostBlogs]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesByAuthor = {}

  blogs.forEach(blog => {
    likesByAuthor[blog.author] =
      (likesByAuthor[blog.author] || 0) + blog.likes
  })

  const authorWithMostLikes = Object.keys(likesByAuthor)
    .reduce((a, b) =>
      likesByAuthor[a] > likesByAuthor[b] ? a : b
    )

  return {
    author: authorWithMostLikes,
    likes: likesByAuthor[authorWithMostLikes]
  }
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}