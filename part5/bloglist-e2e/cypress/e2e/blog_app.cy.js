describe('Blog app', function () {

  beforeEach(function () {

    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'testpass'
    }

    cy.request('POST', 'http://localhost:3001/api/users', user)

    const anotherUser = {
      name: 'Another User',
      username: 'anotheruser',
      password: 'anotherpass'
    }

    cy.request('POST', 'http://localhost:3001/api/users', anotherUser)

    cy.visit('/')
  })

  it('Login form is shown', function () {
    cy.contains('Log in')
  })

  describe('Login', function () {

    it('succeeds with correct credentials', function () {

      cy.get('[data-testid="username"]').type('testuser')
      cy.get('[data-testid="password"]').type('testpass')

      cy.contains('login').click()

      cy.contains('logged in')
    })

    it('fails with wrong credentials', function () {

      cy.get('[data-testid="username"]').type('testuser')
      cy.get('[data-testid="password"]').type('wrongpass')

      cy.contains('login').click()

      cy.contains('wrong username or password')
    })

  })

  describe('When logged in', function () {

    beforeEach(function () {

      cy.request('POST', 'http://localhost:3001/api/login', {
        username: 'testuser',
        password: 'testpass'
      }).then(({ body }) => {

        localStorage.setItem('loggedBlogappUser', JSON.stringify(body))

        cy.visit('/')
      })
    })

    it('A blog can be created', function () {

      cy.contains('create new blog').click()

      cy.get('[placeholder="title"]').type('Cypress blog')
      cy.get('[placeholder="author"]').type('Miguel')
      cy.get('[placeholder="url"]').type('http://cypress.com')

      cy.get('#create-blog-button').click()

      cy.contains('Cypress blog Miguel')
    })

    it('A blog can be liked', function () {

      cy.contains('create new blog').click()

      cy.get('[placeholder="title"]').type('Blog con likes')
      cy.get('[placeholder="author"]').type('Miguel')
      cy.get('[placeholder="url"]').type('http://likes.com')

      cy.get('#create-blog-button').click()

      cy.contains('Blog con likes Miguel')

      cy.contains('view').click()

      cy.contains('likes 0')

      cy.contains(/^like$/).click()

      cy.contains(/^likes 1$/)
    })

    it('A blog can be deleted by the creator', function () {

      cy.contains(/^create new blog$/).click()

      cy.get('[placeholder="title"]').type('Blog para borrar')
      cy.get('[placeholder="author"]').type('Miguel')
      cy.get('[placeholder="url"]').type('http://delete.com')

      cy.get('#create-blog-button').click()

      cy.contains('Blog para borrar Miguel')

      cy.contains('Blog para borrar Miguel')
        .parent()
        .contains(/^view$/)
        .click()

      cy.on('window:confirm', () => true)

      cy.contains('Blog para borrar Miguel')
        .parent()
        .contains(/^remove$/)
        .click()

      cy.contains('Blog para borrar Miguel')
        .should('not.exist')
    })

    it('Only the creator can see the remove button', function () {

      cy.request('POST', 'http://localhost:3001/api/login', {
        username: 'testuser',
        password: 'testpass'
      }).then(({ body }) => {

        localStorage.setItem('loggedBlogappUser', JSON.stringify(body))

        cy.visit('/')
      })

      cy.contains(/^create new blog$/).click()

      cy.get('[placeholder="title"]').type('Blog privado')
      cy.get('[placeholder="author"]').type('Miguel')
      cy.get('[placeholder="url"]').type('http://private.com')

      cy.get('#create-blog-button').click()

      cy.contains('logout').click()

      cy.request('POST', 'http://localhost:3001/api/login', {
        username: 'anotheruser',
        password: 'anotherpass'
      }).then(({ body }) => {

        localStorage.setItem('loggedBlogappUser', JSON.stringify(body))

        cy.visit('/')
      })

      cy.contains('Blog privado Miguel')
        .parent()
        .contains(/^view$/)
        .click()

      cy.contains(/^remove$/).should('not.exist')
    })

    it('Blogs are ordered according to likes', function () {
      const createBlog = (title, author, url) => {
        cy.contains(/^create new blog$/).click()
        cy.get('[placeholder="title"]').type(title)
        cy.get('[placeholder="author"]').type(author)
        cy.get('[placeholder="url"]').type(url)
        cy.get('#create-blog-button').click()
        cy.contains(`${title} ${author}`).should('be.visible')
      }

      createBlog('First blog', 'Miguel', 'http://1.com')
      createBlog('Second blog', 'Miguel', 'http://2.com')
      createBlog('Third blog', 'Miguel', 'http://3.com')

      cy.get('.blog').each($blog => {
        cy.wrap($blog).contains(/^view$/).click()
      })

      cy.contains('.blog', 'Second blog').contains(/^like$/).click()
      cy.contains('.blog', 'Second blog').find('[data-testid="likes"]').should('contain', '1')

      cy.contains('.blog', 'Second blog').contains(/^like$/).click()
      cy.contains('.blog', 'Second blog').find('[data-testid="likes"]').should('contain', '2')

      cy.contains('.blog', 'Third blog').contains(/^like$/).click()
      cy.contains('.blog', 'Third blog').find('[data-testid="likes"]').should('contain', '1')

      cy.get('.blog').should('have.length', 3)
      cy.get('.blog').eq(0).should('contain', 'Second blog')
      cy.get('.blog').eq(1).should('contain', 'Third blog')
      cy.get('.blog').eq(2).should('contain', 'First blog')
    })

  })

})