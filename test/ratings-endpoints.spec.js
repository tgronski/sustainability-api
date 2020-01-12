const { expect } = require('chai')
  const knex = require('knex')
  const app = require('../src/app')
  const { makeRatingsArray } = require('./ratings.fixtures')

  
  
  describe('Ratings Endpoints', function() {
    let db
  
    before('make knex instance', () => {
  
      db = knex({
        client: 'pg',
        connection: 'postgresql://dunder_mifflin@localhost/sustainability-test',
      })
      app.set('db', db)
      
    })
    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE sustainability_ratings CASCADE'))

   afterEach('cleanup', () => db.raw('TRUNCATE sustainability_ratings CASCADE'))
    describe(`GET /api/ratings`, () => {
        context(`Given no ratings`, () => {
        it(`responds with 200 and an empty list`, () => {
            return supertest(app)
            .get('/api/ratings')
            .expect(200, [])
        })
        })
    })   

   describe(`GET /api/ratings`, () => {
    context('Given there are ratings in the database', () => {
      const testRatings = makeRatingsArray()

      beforeEach('insert ratings', () => {
        return db
          .into('sustainability_ratings')
          .insert(testRatings)
      })

      it('responds with 200 and all of the ratings', () => {
        return supertest(app)
          .get('/api/ratings')
          .expect(200, testRatings)
      })
    })
  })




})


