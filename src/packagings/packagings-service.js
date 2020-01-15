const PackagingsService = {
  getAllPackagings(knex) {
    return knex.select("*").from("sustainability_packagings");
  },
  getById(knex, packagingsid) {
    return knex
      .from("sustainability_packagings")
      .select("*")
      .where("packagingsid", packagingsid)
      .first();
  }
};

module.exports = PackagingsService;
