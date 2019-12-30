
const RatingsService = {
  getAllRatings(knex) {
    return knex
    .select('*')
    .from('sustainability_ratings')
  },
  getById(knex, ratingsid) {
    return knex.from('sustainability_ratings').select('*').where('ratingsid', ratingsid).first()
  },
  
}

module.exports = RatingsService;