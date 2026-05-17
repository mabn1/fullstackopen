const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {
   
    await request.post('http://localhost:3001/api/testing/reset')

    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Miguel',
        username: 'miguel',
        password: '1234'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
  await expect(page.getByText('Log in')).toBeVisible()
  await expect(page.getByTestId('username')).toBeVisible()
  await expect(page.getByTestId('password')).toBeVisible()
})

  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      

      await page.getByTestId('username').fill('miguel')
      await page.getByTestId('password').fill('1234')

      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText(/miguel/i)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      

      await page.getByTestId('username').fill('miguel')
      await page.getByTestId('password').fill('wrong')

      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText(/wrong username or password/i)).toBeVisible()
    })

  })
})