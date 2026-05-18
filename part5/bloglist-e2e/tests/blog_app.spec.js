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

            await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {


            await page.getByTestId('username').fill('miguel')
            await page.getByTestId('password').fill('wrong')

            await page.getByRole('button', { name: /login/i }).click()

            await expect(page.getByText(/wrong username or password/i)).toBeVisible()
        })

    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.goto('http://localhost:5173')

            await page.getByTestId('username').fill('miguel')
            await page.getByTestId('password').fill('1234')
            await page.getByRole('button', { name: /login/i }).click()

            await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()
        })

        test('a new blog can be created', async ({ page }) => {
            const createButton = page.getByRole('button', { name: /create new blog/i })
            await expect(createButton).toBeVisible()
            await createButton.click()

            await page.getByPlaceholder('title').fill('Blog E2E test')
            await page.getByPlaceholder('author').fill('Miguel')
            await page.getByPlaceholder('url').fill('http://e2e-test.com')

            await page.locator('form').getByRole('button', { name: /create/i }).click()

            const blog = page.locator('.blog').filter({ hasText: 'Blog E2E test' })
            await expect(blog).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            await page.getByRole('button', { name: /create new blog/i }).click()

            await page.getByPlaceholder('title').fill('Blog Like Test')
            await page.getByPlaceholder('author').fill('Miguel')
            await page.getByPlaceholder('url').fill('http://like-test.com')

            await page.locator('form').getByRole('button', { name: /create/i }).click()

            const blog = page.getByTestId('blog').filter({ hasText: 'Blog Like Test' })

            await blog.getByRole('button', { name: /view/i }).click()

            const likes = blog.getByTestId('likes')

            await expect(likes).toContainText('0')

            await blog.getByRole('button', { name: /like/i }).click()

            await expect(likes).toContainText('1')
        })
    })
})  