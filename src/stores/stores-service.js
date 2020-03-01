const StoresService = {
  getAllStores(knex) {
    return knex.select("*").from("sustainability_stores");
  },
  getById(knex, storeid) {
    return knex
      .from("sustainability_stores")
      .select("*")
      .where("storeid", storeid)
      .first();
  },
  insertStore(knex, newStore) {
    return knex
      .insert(newStore)
      .into("sustainability_stores")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteStore(knex, storeid) {
    return knex("sustainability_stores")
      .where("storeid", storeid)
      .delete();
  },
  updateStore(knex, storeid, editStore) {
    return knex("sustainability_stores")
      .where("storeid",storeid)
      .update(editStore, returning=true)
      .returning("*")

  },
};

module.exports = StoresService;
