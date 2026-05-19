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
    blog.user &&
    user &&
    blog.user.username === user.username

  return (
    <div style={blogStyle} className="blog" data-testid="blog">

      {!visible ? (
        <>
          <span data-testid="blog-title">
            {blog.title} {blog.author}
          </span>

          <button onClick={toggleVisibility}>
            view
          </button>
        </>
      ) : (
        <>
          <div>
            {blog.title} {blog.author}

            <button onClick={toggleVisibility}>
              hide
            </button>
          </div>

          <div>{blog.url}</div>

          <div>
            <span data-testid="likes">
              likes {blog.likes}
            </span>

            <button onClick={() => handleLike(blog)}>
              like
            </button>
          </div>

          <div>{blog.user?.name}</div>

          {showRemoveButton && (
            <button onClick={() => handleRemove(blog)}>
              remove
            </button>
          )}
        </>
      )}

    </div>
  )
}

export default Blog