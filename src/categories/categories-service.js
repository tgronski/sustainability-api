
const CategoriesService = {
  getAllCategories(knex) {
    return knex
    .select('*')
    .from('sustainability_categories')
  },
  getById(knex, categoriesid) {
    return knex.from('sustainability_categories').select('*').where('categoriesid', categoriesid).first()
  },
  
}

module.exports = CategoriesService;