
const StoresService = {
  getAllStores(knex) {
    return knex
    .select('*')
    .from('sustainability_stores')
  },
  getById(knex, storeid) {
    return knex.from('sustainability_stores').select('*').where('storeid', storeid).first()
  },
  deleteStore(knex, storeid) {
    return knex('sustainability_stores')
      .where('storeid', storeid)
      .delete()
  },
}

module.exports = StoresService;