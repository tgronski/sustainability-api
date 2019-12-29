const path = require('path')
const knex = require('knex')
require('dotenv').config()
const express = require('express')
const PackagingsService = require('./packagings-service')

const packagingsRouter = express.Router()
const jsonParser = express.json()

const serializePackagings = packaging => ({
  packagingsid: packaging.packagingsid,
  packagingsdescription: packaging.packagingsdescription,

})


packagingsRouter
  .route('/')
  .get((req, res, next) => {

    const knexInstance = req.app.get('db')
    
    PackagingsService.getAllPackagings(knexInstance)

      .then(results => {
        res.status(200).json(results)
       
      })
      .catch(next)
  })

packagingsRouter
  .route('/:packagingsid')
  .all((req, res, next) => {
    PackagingsService.getById(
      req.app.get('db'),
      req.params.packagingsid
    )
      .then(packaging => {
        if (!packaging) {
          return res.status(404).json({
            error: { message: `packaging doesn't exist` }
          })
        }
        res.packaging = packaging
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    
    res.json(serializePackagings(res.packaging))
  })
  

module.exports = packagingsRouter