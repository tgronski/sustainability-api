const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makePackagingsArray } = require("./packagings.fixtures");

describe("Packagings Endpoints", function() {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: "postgresql://theresegronski@localhost/sustainability-test"
    });
    app.set("db", db);
  });
  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE sustainability_packagings CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE sustainability_packagings CASCADE")
  );

  describe(`GET /api/packagings`, () => {
    context(`Given no packagings`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/packagings")
          .expect(200, []);
      });
    });
  });

  describe(`GET /api/packagings`, () => {
    context("Given there are packagings in the database", () => {
      const testPackagings = makePackagingsArray();

      beforeEach("insert packagings", () => {
        return db.into("sustainability_packagings").insert(testPackagings);
      });

      it("responds with 200 and all of the packagings", () => {
        return supertest(app)
          .get("/api/packagings")
          .expect(200, testPackagings);
      });
    });
  });
});
