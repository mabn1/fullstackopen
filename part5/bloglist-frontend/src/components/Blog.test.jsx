import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Testing React apps',
    author: 'Miguel',
    url: 'http://example.com',
    likes: 10,
    user: { name: 'Miguel' }
  }

  render(<Blog blog={blog} />)

  expect(screen.getByText('Testing React apps Miguel')).toBeDefined()

  expect(screen.queryByText('http://example.com')).toBeNull()
  expect(screen.queryByText('likes 10')).toBeNull()
})

test('when view button is clicked, url and likes are shown', async () => {
  const blog = {
    title: 'Testing React apps',
    author: 'Miguel',
    url: 'http://example.com',
    likes: 10,
    user: {
      username: 'miguel',
      name: 'Miguel'
    }
  }

  const user = {
    username: 'miguel',
    name: 'Miguel'
  }

  render(<Blog blog={blog} user={user} />)

  const userEventInstance = userEvent.setup()

  const viewButton = screen.getByText('view')
  await userEventInstance.click(viewButton)

  expect(screen.getByText('http://example.com')).toBeDefined()
  expect(screen.getByText('likes 10')).toBeDefined()
})