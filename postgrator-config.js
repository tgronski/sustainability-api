require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'test')
    ? 'postgresql://dunder_mifflin@localhost/sustainability-test'
    : 'postgresql://dunder_mifflin@localhost/theresegronski',
  "ssl": !!process.env.SSL,
}