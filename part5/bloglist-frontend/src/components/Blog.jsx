import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showRemoveButton =
    blog.user && user && blog.user.username === user.username

  if (!visible) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
      </div>

      <div>{blog.url}</div>

      <div>
        likes {blog.likes}
        <button onClick={() => handleLike(blog)}>like</button>
      </div>

      <div>
        {blog.user?.name}
      </div>


      {showRemoveButton && (
        <button onClick={() => handleRemove(blog)}>
          remove
        </button>
      )}
    </div>
  )
}

export default Blog