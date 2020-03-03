require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'test')
    ? 'postgresql://theresegronski@localhost/sustainability-test'
    : 'postgresql://theresegronski@localhost/postgres',
}