const path = require("path");
require("dotenv").config();
const express = require("express");
const StoresService = require("./stores-service");
const xss = require(xss);
const storesRouter = express.Router();
const jsonParser = express.json();

const serializeStores = store => ({
  storeid: store.storeid,
  storename: xxs(store.storename),
  website: xss(store.website),
  lastdatemodified: store.lastdatemodified,
  comments: xss(store.comments),
  packagingsid: store.packagingsid,
  categoriesid: store.categoriesid,
  ratingsid: store.ratingsid
});

storesRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");

    StoresService.getAllStores(knexInstance)

      .then(results => {
        res.status(200).json(results);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      storename,
      website,
      comments,
      packagingsid,
      categoriesid,
      ratingsid
    } = req.body;
    const newStore = {
      storename,
      website,
      comments,
      packagingsid,
      categoriesid,
      ratingsid
    };
    for (const [key, value] of Object.entries(newStore)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request` }
        });
      }
    }

    StoresService.insertStore(req.app.get("db"), newStore)
      .then(store => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${store.storeid}`))
          .json(serializeStores(store));
      })
      .catch(next);
  });

storesRouter
  .route("/:storeid")
  .all((req, res, next) => {
    StoresService.getById(req.app.get("db"), req.params.storeid)
      .then(store => {
        if (!store) {
          return res.status(404).json({
            error: { message: `Store doesn't exist` }
          });
        }
        res.store = store;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeStores(res.store));
  })
  .delete((req, res, next) => {
    StoresService.deleteStore(req.app.get("db"), req.params.storeid)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch((req,res,next)=>{
    const {storeid,
      storename,
      website,
      comments,
      packagingsid,
      categoriesid,
      ratingsid} = req.body
    const editStore = {storeid,
      storename,
      website,
      comments,
      packagingsid,
      categoriesid,
      ratingsid}
    
    for( const [key,value] of Object.entries(editStore))
    if(value==null)
    res.status(400).json({error:{message: `Missing ${key}`}})

    StoresService.updateStore(req.app.get("db"), req.params.storeid, editStore)
    .then(editedStore=>{
      res.status(200).json(serializeStores(editedStore[0]))
    })
    .catch(next);
  })

module.exports = storesRouter;
