const path = require('path')
const knex = require('knex')
require('dotenv').config()
const express = require('express')
const CategoriesService = require('./categories-service')

const categoriesRouter = express.Router()
const jsonParser = express.json()

const serializeCategories = category => ({
  categoriesid: category.categoriesid,
  categoriesdescription: category.categoriesdescription,

})


categoriesRouter
  .route('/')
  .get((req, res, next) => {
    

    const knexInstance = req.app.get('db')
    CategoriesService.getAllCategories(knexInstance)

      .then(results => {
        res.status(200).json(results)
       
      })
      .catch(next)
  })

categoriesRouter
  .route('/:categoriesid')
  .all((req, res, next) => {
    CategoriesService.getById(
      req.app.get('db'),
      req.params.categoriesid
    )
      .then(category => {
        if (!category) {
          return res.status(404).json({
            error: { message: `Category doesn't exist` }
          })
        }
        res.category = category
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeCategories(res.category))
  })
  

module.exports = categoriesRouter