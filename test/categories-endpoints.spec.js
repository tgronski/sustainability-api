const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeCategoriesArray } = require("./categories.fixtures");

describe("Categories Endpoints", function() {
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
    db.raw("TRUNCATE sustainability_categories CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE sustainability_categories CASCADE")
  );
  describe(`GET /api/categories`, () => {
    context(`Given no categories`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/categories")
          .expect(200, []);
      });
    });
  });

  describe(`GET /api/categories`, () => {
    context("Given there are categories in the database", () => {
      const testCategories = makeCategoriesArray();

      beforeEach("insert categories", () => {
        return db.into("sustainability_categories").insert(testCategories);
      });

      it("responds with 200 and all of the categories", () => {
        return supertest(app)
          .get("/api/categories")
          .expect(200, testCategories);
      });
    });
  });
});
