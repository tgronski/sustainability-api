require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./errorHandler')
const uuid = require('uuid/v4');
const categoriesRouter = require('./categories/categories-router')
const packagingsRouter = require('./packagings/packagings-router')
const storesRouter = require('./stores/stores-router')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))
app.use(cors())
app.use(helmet())
app.use(express.json());



app.get('/', (req, res) => {
  console.log(req.body);
  res.send('Hello, world!')
})

app.use('/api/categories', categoriesRouter)

app.use('/api/packagings', packagingsRouter)
app.use('/api/stores', storesRouter)

app.post('/', (req, res) => {
  res
    .send('POST request received.');
});


app.use(errorHandler)

module.exports = app