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

      await page.getByText('logged in').waitFor()

      await expect(page.getByText(/logged in/i)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('/')

      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('wrongpass')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()

      await expect(page.getByText('logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'testpass')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByPlaceholder('title').fill('Test blog')
      await page.getByPlaceholder('author').fill('Miguel')
      await page.getByPlaceholder('url').fill('http://test.com')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByTestId('blog-title')).toHaveText('Test blog Miguel')
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

      await expect(page.getByText('Delete test Miguel')).not.toBeVisible()
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

      await expect(
        page.getByRole('button', { name: 'remove' })
      ).not.toBeVisible()
    })
  })

})