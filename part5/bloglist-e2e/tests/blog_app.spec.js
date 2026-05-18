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

      await expect(page.getByText('Test blog Miguel')).toBeVisible()
    })
  })

})