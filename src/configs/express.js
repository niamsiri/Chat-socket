const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const methodOverride = require('method-override')

const app = express();

app.use(cors({
    origin: '*',
    methods: 'GET, HEAD, PUT, POST, DELETE,OPTIONS',
    optionSuccessStatus: 200
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

app.use('/view', require('../views/view'));
app.use('/api/', require('../router/index'));

module.exports = app 