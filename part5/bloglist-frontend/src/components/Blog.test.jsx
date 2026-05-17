import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Testing React apps',
    author: 'Miguel',
    url: 'https://test.com',
    likes: 10,
    user: { name: 'Miguel' }
  }

  render(<Blog blog={blog} />)

  expect(screen.getByText('Testing React apps Miguel')).toBeDefined()

  expect(screen.queryByText('https://test.com')).toBeNull()
  expect(screen.queryByText('likes 10')).toBeNull()
})

test('when view is clicked, url and likes are shown', async () => {
  const blog = {
    title: 'Testing React apps',
    author: 'Miguel',
    url: 'https://test.com',
    likes: 10,
    user: { name: 'Miguel' }
  }

  const user = userEvent.setup()

  render(<Blog blog={blog} />)

  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText('https://test.com')).toBeDefined()
  expect(screen.getByText('likes 10')).toBeDefined()
})

test('like button is called twice when clicked twice', async () => {
  const blog = {
    title: 'Testing React apps',
    author: 'Miguel',
    url: 'https://test.com',
    likes: 10,
    user: { name: 'Miguel' }
  }

  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(<Blog blog={blog} handleLike={mockHandler} />)

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})