describe('Blog app', function() {

  beforeEach(function() {
    cy.visit('/')
  })

  it('Login form is shown', function() {
    cy.contains('Log in')
  })

})