const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeCategoriesArray } = require("./categories.fixtures");
const { makeStoresArray } = require("./stores.fixtures");
const { makePackagingsArray } = require("./packagings.fixtures");
const { makeRatingsArray } = require("./ratings.fixtures");

describe("Stores Endpoints", function() {
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
    db.raw(
      "TRUNCATE sustainability_ratings, sustainability_packagings, sustainability_categories, sustainability_stores RESTART IDENTITY CASCADE"
    )
  );

  afterEach("cleanup", () =>
    db.raw(
      "TRUNCATE sustainability_stores, sustainability_ratings, sustainability_packagings, sustainability_categories RESTART IDENTITY CASCADE"
    )
  );

  describe(`GET /api/stores`, () => {
    context(`Given no stores`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/stores")
          .expect(200, []);
      });
    });
  });

  context("Given there are stores in the database", () => {
    const testCategories = makeCategoriesArray();
    const testStores = makeStoresArray();
    const testPackagings = makePackagingsArray();
    const testRatings = makeRatingsArray();

    beforeEach("insert stores", () => {
      return db
        .into("sustainability_packagings")
        .insert(testPackagings)
        .then(() => {
          return db.into("sustainability_categories").insert(testCategories);
        })
        .then(() => {
          return db.into("sustainability_ratings").insert(testRatings);
        })
        .then(() => {
          return db.into("sustainability_stores").insert(testStores);
        });
    });

    it("responds with 200 and all of the stores", () => {
      return supertest(app)
        .get("/api/stores")
        .expect(200, testStores);
    });
  });

  describe(`GET /api/stores/:storeid`, () => {
    context(`Given no store`, () => {
      it(`responds with 404`, () => {
        const storeid = 123456;
        return supertest(app)
          .get(`/api/stores/${storeid}`)
          .expect(404, { error: { message: `Store doesn't exist` } });
      });
    });

    context("Given there are stores in the database", () => {
      const testCategories = makeCategoriesArray();
      const testStores = makeStoresArray();
      const testPackagings = makePackagingsArray();
      const testRatings = makeRatingsArray();

      beforeEach("insert stores", () => {
        return db
          .into("sustainability_packagings")
          .insert(testPackagings)
          .then(() => {
            return db.into("sustainability_categories").insert(testCategories);
          })
          .then(() => {
            return db.into("sustainability_ratings").insert(testRatings);
          })
          .then(() => {
            return db.into("sustainability_stores").insert(testStores);
          });
      });

      it("responds with 200 and the specified store", () => {
        const storeid = 2;
        const expectedStore = testStores[storeid - 1];
        return supertest(app)
          .get(`/api/stores/${storeid}`)
          .expect(200, expectedStore);
      });
    });
  });

  describe(`POST /api/stores`, () => {
    context("Given there are stores in the database", () => {
      const testCategories = makeCategoriesArray();
      const testStores = makeStoresArray();
      const testPackagings = makePackagingsArray();
      const testRatings = makeRatingsArray();

      beforeEach("insert stores", () => {
        return db
          .into("sustainability_packagings")
          .insert(testPackagings)
          .then(() => {
            return db.into("sustainability_categories").insert(testCategories);
          })
          .then(() => {
            return db.into("sustainability_ratings").insert(testRatings);
          })
          .then(() => {
            return db.into("sustainability_stores").insert(testStores);
          });
      });

      it(`creates a store, responding with 201 and the new store`, () => {
        const newStore = {
          storeid: 19,
          storename: "Test Store Name",
          website: "www.test.com",
          comments:
            "Praesent sagittis a mi sit amet dictum. Donec orci nibh, dignissim in leo et, congue semper mauris. Donec elit lacus, dictum et placerat eget, rhoncus sodales erat. Curabitur sit amet placerat neque, a tempus mi. Suspendisse a tempus dolor. Nullam porttitor nisi sed justo dictum consequat. Etiam sed congue felis.",
          categoriesid: 1,
          packagingsid: 1,
          ratingsid: 3
        };
        return supertest(app)
          .post("/api/stores")
          .send(newStore)
          .expect(201)
          .expect(res => {
            console.log(res.body);
            expect(res.body.storename).to.eql(newStore.storename);
            expect(res.body).to.have.property("storeid");
            expect(res.headers.location).to.eql(
              `/api/stores/${newStore.storeid}`
            );
          })
          .then(res =>
            supertest(app)
              .get(`/api/stores/${newStore.storeid}`)
              .expect(res.body)
          );
      });
    });
    const requiredFields = [
      "storename",
      "website",
      "comments",
      "categoriesid",
      "ratingsid",
      "packagingsid"
    ];

    requiredFields.forEach(field => {
      const newStore = {
        storeid: 19,
        storename: "Test Store Name",
        website: "www.test.com",
        comments:
          "Praesent sagittis a mi sit amet dictum. Donec orci nibh, dignissim in leo et, congue semper mauris. Donec elit lacus, dictum et placerat eget, rhoncus sodales erat. Curabitur sit amet placerat neque, a tempus mi. Suspendisse a tempus dolor. Nullam porttitor nisi sed justo dictum consequat. Etiam sed congue felis.",
        categoriesid: 1,
        packagingsid: 1,
        ratingsid: 3
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newStore[field];

        return supertest(app)
          .post("/api/stores")
          .send(newStore)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          });
      });
    });
  });

  describe(`DELETE /api/stores/:storeid`, () => {
    context(`Given no stores`, () => {
      it(`responds with 404`, () => {
        const storeid = 1234;
        return supertest(app)
          .delete(`/api/stores/${storeid}`)
          .expect(404, { error: { message: `Store doesn't exist` } });
      });
    });

    context("Given there are stores in the database", () => {
      const testCategories = makeCategoriesArray();
      const testStores = makeStoresArray();
      const testPackagings = makePackagingsArray();
      const testRatings = makeRatingsArray();

      beforeEach("insert stores", () => {
        return db
          .into("sustainability_packagings")
          .insert(testPackagings)
          .then(() => {
            return db.into("sustainability_categories").insert(testCategories);
          })
          .then(() => {
            return db.into("sustainability_ratings").insert(testRatings);
          })
          .then(() => {
            return db.into("sustainability_stores").insert(testStores);
          });
      });

      it("responds with 204 and removes the store", () => {
        const idToRemove = 2;
        const expectedStores = testStores.filter(
          store => store.storeid !== idToRemove
        );
        return supertest(app)
          .delete(`/api/stores/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/stores`)
              .expect(expectedStores)
          );
      });
    });
  });
});
