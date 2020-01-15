const knex = require("knex");
require("dotenv").config();
const express = require("express");
const RatingsService = require("./ratings-service");

const ratingsRouter = express.Router();
const jsonParser = express.json();

const serializeRatings = rating => ({
  ratingsid: rating.ratingsid,
  ratingsdescription: rating.ratingsdescription
});

ratingsRouter.route("/").get((req, res, next) => {
  const knexInstance = req.app.get("db");

  RatingsService.getAllRatings(knexInstance)

    .then(results => {
      res.status(200).json(results);
    })
    .catch(next);
});

ratingsRouter
  .route("/:ratingsid")
  .all((req, res, next) => {
    RatingsService.getById(req.app.get("db"), req.params.ratingsid)
      .then(rating => {
        if (!rating) {
          return res.status(404).json({
            error: { message: `Rating doesn't exist` }
          });
        }
        res.rating = rating;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeRatings(res.rating));
  });

module.exports = ratingsRouter;
