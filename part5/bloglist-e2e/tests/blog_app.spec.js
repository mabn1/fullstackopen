const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {

  beforeEach(async ({ request }) => {
    await request.post('/api/testing/reset')

    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'testpass'
      }
    })
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await page.goto('/')

      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('testpass')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText(/logged in/i)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('/')

      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('wrongpass')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {

    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'testpass')
    })

    test('a new blog can be created', async ({ page }) => {

      const createBlog = async (title, author, url) => {
        await page.getByRole('button', { name: 'create new blog' }).click()

        await page.getByPlaceholder('title').fill(title)
        await page.getByPlaceholder('author').fill(author)
        await page.getByPlaceholder('url').fill(url)

        await page.getByRole('button', { name: 'create' }).click()

        await expect(page.getByText(`${title} ${author}`)).toBeVisible()
      }

      await createBlog('Test blog', 'Miguel', 'http://test.com')
    })

    test('a blog can be liked', async ({ page }) => {

      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByPlaceholder('title').fill('Like test')
      await page.getByPlaceholder('author').fill('Miguel')
      await page.getByPlaceholder('url').fill('http://like.com')

      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.getByText('Like test Miguel')
      await expect(blog).toBeVisible()

      await blog.locator('..').getByRole('button', { name: 'view' }).click()

      const likes = page.getByTestId('likes')
      await expect(likes).toHaveText('likes 0')

      await page.getByRole('button', { name: 'like' }).click()
      await expect(likes).toHaveText('likes 1')
    })

    test('a blog can be deleted by its creator', async ({ page }) => {

      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByPlaceholder('title').fill('Delete test')
      await page.getByPlaceholder('author').fill('Miguel')
      await page.getByPlaceholder('url').fill('http://delete.com')

      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.getByText('Delete test Miguel')
      await expect(blog).toBeVisible()

      await blog.locator('..').getByRole('button', { name: 'view' }).click()

      page.on('dialog', dialog => dialog.accept())

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(blog).not.toBeVisible()
    })

    test('only the creator can see the remove button', async ({ page, request }) => {

      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByPlaceholder('title').fill('Protected blog')
      await page.getByPlaceholder('author').fill('Miguel')
      await page.getByPlaceholder('url').fill('http://protected.com')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('/api/users', {
        data: {
          name: 'Other User',
          username: 'otheruser',
          password: 'otherpass'
        }
      })

      await loginWith(page, 'otheruser', 'otherpass')

      const blog = page.getByText('Protected blog Miguel')

      await blog.locator('..').getByRole('button', { name: 'view' }).click()

      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered according to likes', async ({ page }) => {
      const createBlog = async (title, author, url) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByPlaceholder('title').fill(title)
        await page.getByPlaceholder('author').fill(author)
        await page.getByPlaceholder('url').fill(url)
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page.getByText(`${title} ${author}`)).toBeVisible()
      }

      await createBlog('First blog', 'Miguel', 'http://first.com')
      await createBlog('Second blog', 'Miguel', 'http://second.com')
      await createBlog('Third blog', 'Miguel', 'http://third.com')

      const likeNTimes = async (title, times) => {
        const blog = page.getByTestId('blog').filter({ hasText: title })
        await blog.getByRole('button', { name: 'view' }).click()

        for (let i = 0; i < times; i++) {
          const putResponse = page.waitForResponse(resp =>
            resp.url().includes('/api/blogs') && resp.request().method() === 'PUT'
          )
          await blog.getByRole('button', { name: 'like' }).click()
          await putResponse
          await expect(blog.getByTestId('likes')).toContainText(String(i + 1))
        }
      }

      await likeNTimes('Second blog', 2)
      await likeNTimes('Third blog', 1)

      const blogElements = page.getByTestId('blog')
      await expect(blogElements).toHaveCount(3)

      const titles = await blogElements.evaluateAll(blogs =>
        blogs.map(b => {
          const titleEl = b.querySelector('[data-testid="blog-title"]')
          if (titleEl) return titleEl.textContent.trim()
          const firstDiv = b.querySelector('div')
          return firstDiv ? firstDiv.childNodes[0].textContent.trim() : ''
        })
      )

      expect(titles[0]).toContain('Second blog')
      expect(titles[1]).toContain('Third blog')
      expect(titles[2]).toContain('First blog')
    })
  })
})