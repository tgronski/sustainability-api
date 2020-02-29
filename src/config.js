module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "production",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://theresegronski@localhost/postgres",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    "postgresql://theresegronski@localhost/sustainability-test"
};
