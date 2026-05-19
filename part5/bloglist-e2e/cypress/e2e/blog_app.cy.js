describe('Blog app', function() {

  beforeEach(function() {

    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'testpass'
    }

    cy.request('POST', 'http://localhost:3001/api/users', user)

    cy.visit('/')
  })

  it('Login form is shown', function() {
    cy.contains('Log in')
  })

  describe('Login', function() {

    it('succeeds with correct credentials', function() {

      cy.get('[data-testid="username"]').type('testuser')
      cy.get('[data-testid="password"]').type('testpass')

      cy.contains('login').click()

      cy.contains('logged in')
    })

    it('fails with wrong credentials', function() {

      cy.get('[data-testid="username"]').type('testuser')
      cy.get('[data-testid="password"]').type('wrongpass')

      cy.contains('login').click()

      cy.contains('wrong username or password')
    })

  })

})