import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Testing React apps',
    author: 'Miguel',
    url: 'http://example.com',
    likes: 10,
    user: { name: 'Miguel' }
  }

  render(<Blog blog={blog} />)
  // visibles por defecto
  expect(screen.getByText('Testing React apps Miguel')).toBeDefined()

  expect(screen.queryByText('http://example.com')).toBeNull()
  expect(screen.queryByText('likes 10')).toBeNull()
})