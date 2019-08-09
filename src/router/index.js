const express = require('express')
const app = express()

app.use('/socket', require('./socket'))

module.exports = app;